// 'use server'

// import { db } from '@/shared/libs/database'
// import { sendCampaignConfirmationEmail } from '../email/sendCampaignConfirmation'
// import { validateEmail } from '@/shared/utils/ZeroBounceApi'
// import { checkUsageLimit, incrementUsage } from '@/lib/checkAndUpdateUsage'
// import { currentUser } from '@clerk/nextjs/server'
// import { EmailType, SubscriptionStatus, NewsletterOwnerNotificationCategory, NotificationPriority, NotificationType } from '@prisma/client'

// export const addSubscriber = async ({
//   email,
//   name,
//   integrationId,
//   campaignId,
//   source,
//   status,
//   pageUrl,
// }: {
//   email: string
//   name?: string
//   integrationId?: string | null
//   campaignId?: string | null
//   source: string
//   status: SubscriptionStatus
//   pageUrl?: string
// }) => {
//   try {
//     const user = await currentUser()
//     if (!user) return { error: 'Unauthorized' }

//     const ownerId = user.id
//     const adminEmail = user.emailAddresses[0]?.emailAddress || ''

//     // Validate email format
//     if (!email || !/\S+@\S+\.\S+/.test(email)) {
//       return { error: 'Invalid email address' }
//     }

//     // Check for existing subscriber
//     const existing = await db.subscriber.findFirst({
//       where: {
//         email,
//         newsLetterOwnerId: ownerId,
//         ...(integrationId ? { integrationId } : {}),
//       },
//     })
//     if (existing) return { error: 'Subscriber already exists' }

//     // Validate email with ZeroBounce
//     const validation = await validateEmail({ email })
//     if (validation.status === 'invalid') {
//       return { error: 'Invalid email address' }
//     }

//     // Check usage limits
//     const usageCheck = await checkUsageLimit(ownerId, 'subscribersAdded')
//     if (!usageCheck.success) return { error: usageCheck.message }

//     // Fetch campaign & integration only if IDs provided
//     const campaign = campaignId
//       ? await db.campaign.findUnique({ where: { id: campaignId } })
//       : null
//     const integration = integrationId
//       ? await db.integration.findUnique({ where: { id: integrationId } })
//       : null

//     // Create subscriber
//     const subscriber = await db.subscriber.create({
//       data: {
//         email,
//         name,
//         status,
//         source,
//         pageUrl,
//         newsLetterOwnerId: ownerId,
//         ...(integrationId ? { integrationId } : {}),
//         ...(campaignId ? { campaignId } : {}),
//       },
//     })

//     // Update integration subscriber count
//     if (integrationId) {
//       await db.integration.update({
//         where: { id: integrationId },
//         data: { subscribers: { increment: 1 } },
//       })
//     }

//     await incrementUsage(ownerId, 'subscribersAdded')


//     // If no standard email template found, get notification template by priority
//     let notificationTemplate = null

//       notificationTemplate = await db.newsletterOwnerNotification.findFirst({
//         where: {
//           userId: ownerId,
//           category: NewsletterOwnerNotificationCategory.NEWSLETTER,
//           type:NotificationType.EMAIL
//         },
//         orderBy: [
//           { priority: 'desc' }, // Highest priority first (HIGH > MEDIUM > LOW)
//           { createdAt: 'desc' }, // Then most recent
//         ],
//       })

//       if (!notificationTemplate) {
//            return { error: 'Invalid email address' }
//       }

//       console.log(notificationTemplate, 'notificationTemplate')
    

//     // Send confirmation if template exists
//     if ( notificationTemplate) {
//       await sendCampaignConfirmationEmail({
//         userEmail: email,
//         campaign: campaign?.name ,
//         integration: integration?.name,
//         newsLetterOwnerId: ownerId,
//         emailTemplateId: notificationTemplate?.id,
//         adminEmail,
//         fromApplication: integration?.name || 'TheNews',
//       })
//     }

//     return { success: true, subscriber }
//   } catch (error) {
//     console.error('[ADD_SUBSCRIBER_ERROR]', error)
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : 'Failed to add subscriber',
//     }
//   }
// }





'use server'

import { db } from '@/shared/libs/database'
import { sendCampaignConfirmationEmail } from '../email/sendCampaignConfirmation'
import { validateEmail } from '@/shared/utils/ZeroBounceApi'
import { checkUsageLimit, incrementUsage } from '@/lib/checkAndUpdateUsage'
import { currentUser } from '@clerk/nextjs/server'
import { 
  EmailType,
  SubscriptionStatus,
  NewsletterOwnerNotificationCategory,
  NotificationPriority,
  NotificationType,
  NotificationStatus,
  SystemNotificationCategory 
} from '@prisma/client'
import { getWelcomeTemplate } from '@/shared/libs/email-templates/new-subscriber'

export const addSubscriber = async ({
  email,
  name,
  integrationId,
  campaignId,
  source,
  status,
  pageUrl,
}: {
  email: string
  name?: string
  integrationId?: string | null
  campaignId?: string | null
  source: string
  status: SubscriptionStatus
  pageUrl?: string
}) => {
  try {
    const user = await currentUser()
    if (!user) return { error: 'Unauthorized' }

    const ownerId = user.id
    const adminEmail = user.emailAddresses[0]?.emailAddress || ''

    // Validate email format
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return { error: 'Invalid email address' }
    }

    // Check for existing subscriber
    const existing = await db.subscriber.findFirst({
      where: {
        email,
        newsLetterOwnerId: ownerId,
        ...(integrationId ? { integrationId } : {}),
      },
    })
    if (existing) return { error: 'Subscriber already exists' }

    // Validate email with ZeroBounce
    const validation = await validateEmail({ email })
    if (validation.status === 'invalid') {
      return { error: 'Invalid email address' }
    }

    // Check usage limits
    const usageCheck = await checkUsageLimit(ownerId, 'subscribersAdded')
    if (!usageCheck.success) return { error: usageCheck.message }

    // Create subscriber
    const subscriber = await db.subscriber.create({
      data: {
        email,
        name,
        status,
        source,
        pageUrl,
        newsLetterOwnerId: ownerId,
        ...(integrationId ? { integrationId } : {}),
        ...(campaignId ? { campaignId } : {}),
      },
    })

    // Update integration subscriber count
    let integration = null
    if (integrationId) {
      integration = await db.integration.update({
        where: { id: integrationId },
        data: { subscribers: { increment: 1 } },
      })
    }

    // Fetch campaign if available
    const campaign = campaignId
      ? await db.campaign.findUnique({ where: { id: campaignId } })
      : null

    // Increment usage
    await incrementUsage(ownerId, 'subscribersAdded')

    // 1. Try to get user's custom notification template
    let userTemplate = await db.newsletterOwnerNotification.findFirst({
      where: {
        userId: ownerId,
        category: NewsletterOwnerNotificationCategory.NEWSLETTER,
        type: NotificationType.EMAIL,
      },
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
    })

    // 2. If no user template, get system default template
    let systemTemplate = !userTemplate
      ? await db.systemNotification.findFirst({
          where: {
            category: SystemNotificationCategory.NEWSLETTER,
            type: NotificationType.EMAIL,
          },
        })
      : null

    // 3. If no system template exists, create it once
    if (!userTemplate && !systemTemplate) {
      const defaultTemplate = getWelcomeTemplate({ name: '[Name]', email: '[Email]' })
      systemTemplate = await db.systemNotification.create({
        data: {
          type: NotificationType.EMAIL,
          category: SystemNotificationCategory.NEWSLETTER,
          priority: NotificationPriority.MEDIUM,
          title: defaultTemplate.title,
          content: defaultTemplate.content,
          status: NotificationStatus.DRAFT,
          textContent: defaultTemplate.content.text,
          htmlContent: defaultTemplate.content.html,
        },
      })
      userTemplate = await db.newsletterOwnerNotification.create({
        data: {
          userId: ownerId,
          type: NotificationType.EMAIL,
          category: NewsletterOwnerNotificationCategory.NEWSLETTER,
          priority: NotificationPriority.MEDIUM,
          title: defaultTemplate.title,
          content: defaultTemplate.content,
          status: NotificationStatus.DRAFT,
          textContent: systemTemplate!.textContent,
          htmlContent: systemTemplate!.htmlContent,
        },
      })
    }

    // Determine active template
    const activeTemplate = userTemplate || systemTemplate
    if (!activeTemplate) throw new Error('No email template available')

    // Prepare content based on template type
    const templateContent = userTemplate
      ? {
          subject: userTemplate.title,
          html: userTemplate.htmlContent,
          text: userTemplate.textContent,
        }
      : {
          subject: systemTemplate!.title,
          html: systemTemplate!.htmlContent,
          text: systemTemplate!.textContent,
        }

    // Personalize content
    const personalizedContent = {
      ...templateContent,
      html: templateContent.html?.replace(/\[Name\]/g, name || '').replace(/\[Email\]/g, email),
      text: templateContent.text?.replace(/\[Name\]/g, name || '').replace(/\[Email\]/g, email),
      subject: templateContent.subject?.replace(/\[Name\]/g, name || ''),
    }

    // Send confirmation email
    await sendCampaignConfirmationEmail({
      userEmail: email,
      userName: name || '',
      campaign: campaign?.name || '',
      integration: integration?.name || '',
      newsLetterOwnerId: ownerId,
      emailTemplateId: activeTemplate.id,
      notificationTemplateContent: personalizedContent,
      adminEmail,
      fromApplication: integration?.name || 'TheNews',
    })

    return { success: true, subscriber }
  } catch (error) {
    console.error('[ADD_SUBSCRIBER_ERROR]', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to add subscriber',
    }
  }
}







// 'use server'

// import { db } from '@/shared/libs/database'
// import { sendCampaignConfirmationEmail } from '../email/sendCampaignConfirmation'
// import { validateEmail } from '@/shared/utils/ZeroBounceApi'
// import { checkUsageLimit, incrementUsage } from '@/lib/checkAndUpdateUsage'
// import { currentUser } from '@clerk/nextjs/server'
// import { EmailType, SubscriptionStatus } from '@prisma/client'

// export const addSubscriber = async ({
//   email,
//   name,
//   integrationId,
//   campaignId,
//   source,
//   status,
//   pageUrl,
// }: {
//   email: string
//   name?: string
//   integrationId?: string | null
//   campaignId?: string | null
//   source: string
//   status: SubscriptionStatus
//   pageUrl?: string
// }) => {
//   try {
//     const user = await currentUser()
//     if (!user) return { error: 'Unauthorized' }

//     const ownerId = user.id
//     const adminEmail = user.emailAddresses[0]?.emailAddress || ''

//     // Validate email format
//     if (!email || !/\S+@\S+\.\S+/.test(email)) {
//       return { error: 'Invalid email address' }
//     }

//     // Check for existing subscriber
//     const existing = await db.subscriber.findFirst({
//       where: {
//         email,
//         newsLetterOwnerId: ownerId,
//         ...(integrationId ? { integrationId } : {}),
//       },
//     })
//     if (existing) return { error: 'Subscriber already exists' }

//     // Validate email with ZeroBounce
//     const validation = await validateEmail({ email })
//     if (validation.status === 'invalid') {
//       return { error: 'Invalid email address' }
//     }

//     // Check usage limits
//     const usageCheck = await checkUsageLimit(ownerId, 'subscribersAdded')
//     if (!usageCheck.success) return { error: usageCheck.message }

//     // Fetch campaign & integration only if IDs provided
//     const campaign = campaignId
//       ? await db.campaign.findUnique({ where: { id: campaignId } })
//       : null
//     const integration = integrationId
//       ? await db.integration.findUnique({ where: { id: integrationId } })
//       : null

//     // Create subscriber
//     const subscriber = await db.subscriber.create({
//       data: {
//         email,
//         name,
//         status,
//         source,
//         pageUrl,
//         newsLetterOwnerId: ownerId,
//         ...(integrationId ? { integrationId } : {}),
//         ...(campaignId ? { campaignId } : {}),
//       },
//     })

//     // Update integration subscriber count
//     if (integrationId) {
//       await db.integration.update({
//         where: { id: integrationId },
//         data: { subscribers: { increment: 1 } },
//       })
//     }

//     await incrementUsage(ownerId, 'subscribersAdded')

//     // Get email template: campaign > general automated
//  const emailTemplate = await db.email.findFirst({
//   where: {
//     OR: [
//       ...(campaignId
//         ? [
//             {
//               campaignId,
//               emailType: EmailType.AUTOMATED,
//               ...(integrationId ? { integrationId } : {}),
//             },
//           ]
//         : []),
//       {
//         newsLetterOwnerId: ownerId,
//         emailType: EmailType.AUTOMATED,
//         campaignId: null,
//         integrationId: null,
//       },
//     ],
//   },
//   orderBy: [
//     { campaignId: campaignId ? 'desc' : 'asc' },
//     { updatedAt: 'desc' },
//   ],
// })

//     // Send confirmation if template exists
//     if (emailTemplate) {
//       await sendCampaignConfirmationEmail({
//         userEmail: email,
//         campaign: campaign?.name || 'General Newsletter',
//         integration: integration?.name || 'TheNews',
//         newsLetterOwnerId: ownerId,
//         emailTemplateId: emailTemplate.id,
//         adminEmail,
//         fromApplication: integration?.name || 'TheNews',
//       })
//     }

//     return { success: true, subscriber }
//   } catch (error) {
//     console.error('[ADD_SUBSCRIBER_ERROR]', error)
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : 'Failed to add subscriber',
//     }
//   }
// }
