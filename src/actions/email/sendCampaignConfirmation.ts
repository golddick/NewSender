// app/actions/email/sendCampaignConfirmation.ts
'use server'

import { db } from '@/shared/libs/database'
import { sendEmail } from '@/shared/utils/email.sender'

export const sendCampaignConfirmationEmail = async ({
  userEmail,
  campaign,
  integration,
  newsLetterOwnerId,
  emailTemplateId,
  adminEmail,
  fromApplication
}: {
  userEmail: string
  campaign: string
  integration: string
  newsLetterOwnerId: string
  emailTemplateId: string
  adminEmail: string
  fromApplication: string
}) => {
  try {
    // Get email template
    const emailTemplate = await db.email.findUnique({
      where: { id: emailTemplateId },
    })

    if (!emailTemplate || !emailTemplate.content) {
      throw new Error('Email template not found')
    }

    // Send email
    const result = await sendEmail({
      userEmail: [userEmail],
      subject: emailTemplate.emailSubject || `Welcome to ${campaign}`,
      content: emailTemplate.textContent ?? '',
      contentJson: JSON.stringify(emailTemplate.content),
      emailId: emailTemplateId,
      newsLetterOwnerId,
      integrationId: emailTemplate.integrationId,
      campaign: emailTemplate.campaignId,
      adminEmail,
      fromApplication
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