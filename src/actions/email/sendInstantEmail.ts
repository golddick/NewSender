'use server'

import { db } from '@/shared/libs/database'
import { sendEmail } from '@/shared/utils/email.sender'
import { saveEmailToDatabase } from './addEmail'
import { EmailType } from '@prisma/client'
import { currentUser } from '@clerk/nextjs/server'

export const sendInstantEmail = async ({
  userEmails,
  subject,
  content,
  htmlContent,
  emailTemplateId,
  newsLetterOwnerId,
  integrationId,
  campaignId,
  adminEmail,
}: {
  userEmails: string[]
  subject: string
  content: any
  htmlContent: string
  emailTemplateId: string
  newsLetterOwnerId: string 
  integrationId?: string | null
  campaignId?: string | null
  adminEmail: string

}) => {
  try {


      const user = await currentUser();
  if (!user) {
    return { success: false, error: "You must be logged in to create a blog post" };
  }
    const userId = user.id;

    const admin = await db.membership.findUnique({
      where: { userId: userId },
    })

    const fromApplication = admin?.SenderName || admin?.userName || "TheNews"


    // Check if email exists
    let emailTemplate = await db.email.findUnique({
      where: { id: emailTemplateId },
    })

    // If not, create with saveEmailToDatabase
    if (!emailTemplate) {
      const saved = await saveEmailToDatabase({
        title: subject,
        content: JSON.stringify(content),
        textContent: htmlContent,
        emailSubject: subject,
        newsLetterOwnerId,
        integrationId,
        campaignId,
        emailType: EmailType.INSTANT,
        emailId: emailTemplateId,
        trackOpens: true,
        trackClicks: true,
        enableUnsubscribe: true,
        adminEmail,
        fromApplication: fromApplication,
      })

      if (!saved.success || !saved.email) {
        throw new Error(saved.error || 'Failed to create email template')
      }

      emailTemplate = saved.email
    }

    // Only send if it's an instant email
    if (emailTemplate.emailType !== 'INSTANT') {
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
      contentJson: JSON.stringify(content),
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
