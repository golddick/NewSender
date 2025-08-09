'use server'

import { db } from '@/shared/libs/database'
import { EmailStatus, EmailType } from '@prisma/client'

export const saveEmailToDatabase = async ({
  title,
  content,
  newsLetterOwnerId,
  campaignId,
  emailType,
  scheduleDate,
  scheduleTime,
  trackOpens = true,
  trackClicks = true,
  enableUnsubscribe = true,
  textContent,
  emailSubject,
  template,
  emailId,
}: {
  title: string
  content: string | any
  newsLetterOwnerId: string
  campaignId?: string | null
  emailType: EmailType
  scheduleDate?: Date
  scheduleTime?: string
  trackOpens?: boolean
  trackClicks?: boolean
  enableUnsubscribe?: boolean
  textContent: string
  emailSubject: string
  template?: string
  emailId?: string
  adminEmail: string
  fromApplication?: string
}) => {
  try {
    // ✅ Validate required fields
    if (!title || !content || !newsLetterOwnerId) {
      return { success: false, error: 'Missing required fields' }
    }

    const normalizedTitle = title.trim().toLowerCase()


    // ✅ If campaignId is provided, validate its status
    if (campaignId) {
      const campaign = await db.campaign.findUnique({
        where: { id: campaignId },
      })
      if (!campaign || campaign.status !== 'ACTIVE') {
        return { success: false, error: 'Campaign is not active' }
      }
    }

    // ✅ Prevent multiple automated emails per campaign (only if campaignId is provided)
    if (emailType === 'AUTOMATED' && campaignId) {
      const existingAutomated = await db.email.findFirst({
        where: {
          emailType: 'AUTOMATED',
          campaignId,
          newsLetterOwnerId,
          ...(emailId ? { NOT: { id: emailId } } : {}),
        },
      })

      if (existingAutomated) {
        return {
          success: false,
          error: 'An automated email already exists for this campaign.',
        }
      }
    }

    // ✅ Update existing email
    if (emailId) {
      const updatedEmail = await db.email.update({
        where: {
          id: emailId,
          newsLetterOwnerId,
        },
        data: {
          title: normalizedTitle,
          content,
          campaignId: campaignId || null,
          emailType,
          scheduleDate,
          scheduleTime,
          trackOpens,
          trackClicks,
          enableUnsubscribe,
          textContent,
          emailSubject,
          template,
          updatedAt: new Date(),
        },
      })

      return { success: true, email: updatedEmail }
    }

    // ✅ Prevent duplicate saved titles (case-insensitive)
    const existing = await db.email.findFirst({
      where: {
        newsLetterOwnerId,
        status: EmailStatus.SAVED,
        title: {
          equals: normalizedTitle,
          mode: 'insensitive',
        },
      },
    })

    if (existing) {
      return { success: false, error: 'Email with this title already exists' }
    }

    // ✅ Create new saved email
    const email = await db.email.create({
      data: {
        title: normalizedTitle,
        content,
        status: EmailStatus.SAVED,
        newsLetterOwnerId,
        campaignId: campaignId || null,
        emailType,
        userId: newsLetterOwnerId, 
        scheduleDate,
        scheduleTime,
        trackOpens,
        trackClicks,
        enableUnsubscribe,
        openCount: 0,
        clickCount: 0,
        openedByIps: [],
        clickedByIps: [],
        textContent,
        emailSubject,
        template,
      },
    })

    return { success: true, email }

  } catch (error) {
    console.error('[SAVE_EMAIL_ERROR]', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save email',
    }
  }
}





// 'use server'

// import { db } from '@/shared/libs/database'
// import { EmailStatus } from '@prisma/client'

// export const saveEmailToDatabase = async ({
//   title,
//   content,
//   newsLetterOwnerId,
//   campaignId,
//   integrationId,
//   emailType = 'scheduled',
//   scheduleType = 'scheduled',
//   scheduleDate,
//   scheduleTime,
//   trackOpens = true,
//   trackClicks = true,
//   enableUnsubscribe = true,
//   textContent,
//   emailSubject,
//   template,
//   emailId,
// }: {
//   title: string
//   content: string
//   newsLetterOwnerId: string
//   campaignId: string
//   integrationId: string
//   emailType?: 'instant' | 'automated' | 'scheduled'
//   scheduleType?: 'immediate' | 'scheduled' | 'draft'
//   scheduleDate?: Date
//   scheduleTime?: string
//   trackOpens?: boolean
//   trackClicks?: boolean
//   enableUnsubscribe?: boolean
//   textContent: string
//   emailSubject: string
//   template: string
//   emailId?: string
// }) => {
//   try {
//     if (!title || !content || !newsLetterOwnerId || !campaignId || !integrationId) {
//       return { success: false, error: 'Missing required fields' }
//     }

//     // ✅ Check if the integration and campaign are active
//     const [integration, campaign] = await Promise.all([
//       db.integration.findUnique({ where: { id: integrationId } }),
//       db.campaign.findUnique({ where: { id: campaignId } }),
//     ])

//     if (!integration || integration.status !== 'active') {
//       return { success: false, error: 'Integration is not active' }
//     }

//     if (!campaign || campaign.status !== 'active') {
//       return { success: false, error: 'Campaign is not active' }
//     }

//     // ✅ Enforce single automated email per campaign
//     if (emailType === 'automated') {
//       const existingAutomated = await db.email.findFirst({
//         where: {
//           emailType: 'automated',
//           campaignId,
//           newsLetterOwnerId,
//           ...(emailId ? { NOT: { id: emailId } } : {}),
//         },
//       })

//       if (existingAutomated) {
//         return {
//           success: false,
//           error: 'An automated email already exists for this campaign.',
//         }
//       }
//     }

//     // ✅ If updating existing email
//     if (emailId) {
//       const updatedEmail = await db.email.update({
//         where: {
//           id: emailId,
//           newsLetterOwnerId,
//         },
//         data: {
//           title,
//           content,
//           campaignId,
//           integrationId,
//           emailType,
//           scheduleType,
//           scheduleDate,
//           scheduleTime,
//           trackOpens,
//           trackClicks,
//           enableUnsubscribe,
//           textContent,
//           emailSubject,
//           template,
//           updatedAt: new Date(),
//         },
//       })

//       return { success: true, email: updatedEmail }
//     }

//     // ✅ Prevent duplicate saved titles
//     const existing = await db.email.findFirst({
//       where: {
//         title,
//         newsLetterOwnerId,
//         status: EmailStatus.SAVED,
//       },
//     })

//     if (existing) {
//       return { success: false, error: 'Email with this title already exists' }
//     }

//     // ✅ Create new email
//     const email = await db.email.create({
//       data: {
//         title,
//         content,
//         status: EmailStatus.SAVED,
//         newsLetterOwnerId,
//         campaignId,
//         integrationId,
//         emailType,
//         scheduleType,
//         scheduleDate,
//         scheduleTime,
//         trackOpens,
//         trackClicks,
//         enableUnsubscribe,
//         openCount: 0,
//         clickCount: 0,
//         openedByIps: [],
//         clickedByIps: [],
//         textContent,
//         emailSubject,
//         template,
//       },
//     })

//     return { success: true, email }
//   } catch (error) {
//     console.error('[SAVE_EMAIL_ERROR]', error)
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : 'Failed to save email',
//     }
//   }
// }
