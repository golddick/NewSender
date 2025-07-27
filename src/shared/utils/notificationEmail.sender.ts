'use server';

import * as nodemailer from 'nodemailer';
import { EmailStatus } from '@prisma/client';
import { db } from '@/shared/libs/database';
import { checkUsageLimit, incrementUsage } from '@/lib/checkAndUpdateUsage';

const BATCH_SIZE = 20;
const BATCH_DELAY_MS = 1000;
const MAX_RETRIES = 2;

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  pool: true,
  maxConnections: 5,
  rateDelta: 5000,
  tls: { rejectUnauthorized: false },
  logger: true,
  debug: true,
});

interface SendNotificationEmailParams {
  userEmail: string[];
  subject: string;
  content: string;
  emailId: string;
  newsLetterOwnerId: string;
  contentJson: string;
  adminEmail: string;
  fromApplication: string;
  trackOpens?: boolean;
  trackClicks?: boolean;
  enableUnsubscribe?: boolean;
}

export const sendNotificationEmail = async (params: SendNotificationEmailParams) => {
  const {
    userEmail,
    subject,
    content,
    emailId,
    fromApplication,
    newsLetterOwnerId,
    contentJson,
    adminEmail,
    trackOpens = true,
    trackClicks = true,
    enableUnsubscribe = true,
  } = params;

  const domain = process.env.NEXT_PUBLIC_WEBSITE_URL || 'https://thenews.africa';
  const startTime = Date.now();
  const trackingId = `ntf_${Date.now()}`;

  try {
    // Validate required fields
    if (!newsLetterOwnerId || !adminEmail || !userEmail?.length) {
      throw new Error('Missing required fields');
    }


    // Verify SMTP connection
    const smtpAvailable = await transporter.verify().catch((err) => {
      console.error("SMTP verification failed:", err);
      return false;
    });
    if (!smtpAvailable) throw new Error("Email server unavailable");

    // Update the notification email record
    const emailRecord = await db.notificationEmail.update({
      where: { id: emailId },
      data: {
        content: content,
        status: "PENDING",
        sentAt: new Date(),
      }
    });

    // Process emails in batches
    const batches = Array.from(
      { length: Math.ceil(userEmail.length / BATCH_SIZE) },
      (_, i) => userEmail.slice(i * BATCH_SIZE, (i + 1) * BATCH_SIZE)
    );

    let totalAccepted = 0;
    let totalRejected = 0;
    let lastMessageId = '';
    const failedEmails: string[] = [];

    for (const [batchIndex, batch] of batches.entries()) {
      console.log(`Processing batch ${batchIndex + 1}/${batches.length}`);

      const batchResults = await Promise.allSettled(
        batch.map(async (email) => {
          let retries = 0;
          let lastError: Error | null = null;

          while (retries <= MAX_RETRIES) {
            try {
              let enhancedContent = content;

              // Add tracking if enabled
              if (trackClicks) {
                enhancedContent = enhancedContent.replace(
                  /href="([^"]+)"/g,
                  (_, url) => `href="${domain}/api/track/click?emailId=${emailId}&email=${encodeURIComponent(email)}&url=${encodeURIComponent(url)}&tid=${trackingId}"`
                );
              }

              if (trackOpens) {
                enhancedContent += `<img src="${domain}/api/track/open?emailId=${emailId}&email=${encodeURIComponent(email)}&tid=${trackingId}" width="1" height="1" style="display:none" />`;
              }

              // Add footer with copyright and unsubscribe
              enhancedContent += `
                <div style="margin-top: 40px; border-top: 1px solid #eaeaea; padding-top: 20px; font-family: Arial, sans-serif; color: #666666; font-size: 12px; line-height: 1.5;">
                  <p style="margin: 0 0 10px;">
                    © 2025 <a href="https://thenews.africa" style="color: #666666; text-decoration: underline;" target="_blank">TheNews Africa</a>. All rights reserved.
                  </p>
                  ${enableUnsubscribe ? `
                  <p style="margin: 0;">
                    <a href="${domain}/api/unsubscribe?email=${encodeURIComponent(email)}&ownerId=${newsLetterOwnerId}" 
                       style="color: #666666; text-decoration: underline;">
                      Unsubscribe from these notifications
                    </a>
                  </p>
                  ` : ''}
                </div>
              `;

              const fromName = fromApplication ? 
                `${fromApplication.charAt(0).toUpperCase()}${fromApplication.slice(1).toLowerCase()}` : 
                'TheNews Notifications';

              const result = await transporter.sendMail({
                from: `${fromName} <${process.env.SMTP_USER}>`,
                to: email,
                subject: subject,
                html: enhancedContent,
                headers: {
                'X-Email-ID': emailId,
                'X-Tracking-ID': trackingId,
                'X-NewsLetter-Owner-ID': newsLetterOwnerId,
                ...(enableUnsubscribe && { 
                    'List-Unsubscribe': `<${domain}/api/unsubscribe?email=${encodeURIComponent(email)}&ownerId=${newsLetterOwnerId}>`
                })
                } 
            });

              return { email, success: true, messageId: result.messageId };
            } catch (error) {
              lastError = error as Error;
              retries++;
              if (retries <= MAX_RETRIES) {
                await new Promise(res => setTimeout(res, 1000 * retries));
              }
            }
          }
          throw lastError || new Error('Failed after retries');
        })
      );

      // Process batch results
      batchResults.forEach((result, index) => {
        const email = batch[index];
        if (result.status === 'fulfilled' && result.value.success) {
          totalAccepted++;
          lastMessageId = result.value.messageId || lastMessageId;
        } else {
          totalRejected++;
          failedEmails.push(email);
          console.error(`Failed to send to ${email}:`, result.status === 'rejected' ? result.reason : 'Unknown error');
        }
      });

      // Delay between batches
      if (batchIndex < batches.length - 1) {
        await new Promise(res => setTimeout(res, BATCH_DELAY_MS));
      }
    }

    // Update email record with final stats
    await db.notificationEmail.update({
      where: { id: emailId },
      data: {
        status: 'SENT',
        content:content,
        textContent: contentJson,
        sentAt: new Date(),
        messageId: lastMessageId,
        recipients: totalAccepted,
        emailsSent: { increment: 1 },
      },
    });


    return {
      success: true,
      messageId: lastMessageId,
      trackingId,
      stats: {
        total: userEmail.length,
        accepted: totalAccepted,
        rejected: totalRejected,
        failedRecipients: failedEmails.length ? failedEmails : undefined,
        batches: batches.length,
        timeTaken: Date.now() - startTime,
      },
    };
  } catch (error) {
    console.error('[NOTIFICATION_EMAIL_SEND_ERROR]', error);

    await db.notificationEmail.update({
      where: { id: emailId },
      data: { status: 'FAILED' },
    });

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Notification email send failed',
      trackingId,
    };
  }
};