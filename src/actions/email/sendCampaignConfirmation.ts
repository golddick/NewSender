



'use server'

import { db } from '@/shared/libs/database'
import { sendEmail } from '@/shared/utils/email.sender'
import { sendNotificationEmail } from '@/shared/utils/notificationEmail.sender'

export const sendCampaignConfirmationEmail = async ({
  userEmail,
  userName,
  campaign,
  newsLetterOwnerId,
  emailTemplateId,
  notificationTemplateContent,
  adminEmail,
  fromApplication
}: {
  userEmail: string
  userName?: string
  campaign?: string
  newsLetterOwnerId: string
  emailTemplateId: string
  notificationTemplateContent: {
    subject: string
    html?: string
    text?: string
  }
  adminEmail: string
  fromApplication: string
}) => {
  try {
    // Get email template for metadata purposes
    const emailTemplate = await db.newsletterOwnerNotification.findUnique({
      where: { id: emailTemplateId },
    })

    if (!emailTemplate) {
      throw new Error('Email template not found')
    }

    // Send email using personalized content 
    const result = await sendNotificationEmail({
      userEmail: [userEmail],
      subject: notificationTemplateContent.subject || `Welcome to ${campaign || fromApplication}`,
      content: notificationTemplateContent.html ?? '',
      contentJson: JSON.stringify(notificationTemplateContent.html),
      emailId: emailTemplateId,
      newsLetterOwnerId,
      adminEmail,
      fromApplication,
    })
 
    if (!result.success) {
      throw new Error(result.error || 'Failed to send confirmation email')
    }

    return { success: true }
  } catch (error) {
    console.error('[SEND_CONFIRMATION_ERROR]', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send confirmation',
    }
  }
}
















// // app/actions/email/sendCampaignConfirmation.ts
// 'use server'

// import { db } from '@/shared/libs/database'
// import { sendNotificationEmail } from '@/shared/utils/notificationEmail.sender'

// export const sendCampaignConfirmationEmail = async ({
//   userEmail,
//   campaign,
//   integration,
//   newsLetterOwnerId,
//   emailTemplateId,
//   adminEmail,
//   fromApplication
// }: {
//   userEmail: string
//   campaign?: string
//   integration?: string
//   newsLetterOwnerId: string
//   emailTemplateId: string
//   adminEmail: string
//   fromApplication: string
// }) => {
//   try {
//     // Get email template
//     const emailTemplate = await db.newsletterOwnerNotification.findUnique({
//       where: { id: emailTemplateId },
//     })

//     if (!emailTemplate || !emailTemplate.content) {
//       throw new Error('Email template not found')
//     }

//     // Send email
//     const result = await sendNotificationEmail({ 
//       userEmail: [userEmail],
//       subject: emailTemplate.content. || `Welcome to ${campaign}`,
//       content: emailTemplate.htmlContent ?? '',
//       contentJson: JSON.stringify(emailTemplate.content),
//       emailId: emailTemplateId,
//       newsLetterOwnerId,
//       integrationId: emailTemplate.integrationId,
//       adminEmail,
//       fromApplication
//     })

//     if (!result.success) {
//       throw new Error(result.error || 'Failed to send confirmation email')
//     }

//     return { success: true }
//   } catch (error) {
//     console.error('[SEND_CONFIRMATION_ERROR]', error)
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : 'Failed to send confirmation',
//     }
//   }
// }