'use server'

import { db } from '@/shared/libs/database'
import { sendEmail } from '@/shared/utils/email.sender'
import { saveEmailToDatabase } from './addEmail'

export const sendInstantEmail = async ({
  userEmails,
  subject,
  design,
  htmlContent,
  emailTemplateId,
  newsLetterOwnerId,
  integrationId,
  campaignId,
  adminEmail,
  fromApplication,
}: {
  userEmails: string[]
  subject: string
  design: any
  htmlContent: string
  emailTemplateId: string
  newsLetterOwnerId: string
  integrationId: string
  campaignId: string
  adminEmail: string
  fromApplication: string
}) => {
  try {
    // Check if email exists
    let emailTemplate = await db.email.findUnique({
      where: { id: emailTemplateId },
    })

    // If not, create with saveEmailToDatabase
    if (!emailTemplate) {
      const saved = await saveEmailToDatabase({
        title: subject,
        content: JSON.stringify(design),
        textContent: htmlContent,
        emailSubject: subject,
        newsLetterOwnerId,
        integrationId,
        campaignId,
        emailType: 'instant',
        scheduleType: 'immediate',
        template: 'instant',
        emailId: emailTemplateId,
        trackOpens: true,
        trackClicks: true,
        enableUnsubscribe: true,
      })

      if (!saved.success || !saved.email) {
        throw new Error(saved.error || 'Failed to create email template')
      }

      emailTemplate = saved.email
    }

    // Only send if it's an instant email
    if (emailTemplate.emailType !== 'instant') {
      return {
        success: false,
        error: 'Email type is not instant, skipping send.',
      }
    }

    // Send the email
    const result = await sendEmail({
      userEmail: userEmails,
      subject: emailTemplate.emailSubject || subject,
      content: htmlContent,
      contentJson: JSON.stringify(design),
      emailId: emailTemplate.id,
      newsLetterOwnerId,
      integrationId,
      campaign: campaignId,
      adminEmail,
      fromApplication,
    })

    if (!result.success) {
      throw new Error(result.error || 'Failed to send instant email')
    }

    return { success: true }
  } catch (error) {
    console.error('[SEND_INSTANT_EMAIL_ERROR]', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send instant email',
    }
  }
}
