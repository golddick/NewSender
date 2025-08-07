'use server';

import * as nodemailer from 'nodemailer';
import { db } from '@/shared/libs/database';

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
  isBulk?: boolean;
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
    isBulk = false,
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

    // Update the notification record
    await db.newsletterOwnerNotification.update({
      where: { id: emailId },
      data: {
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

              // Add click tracking
              if (trackClicks) {
                enhancedContent = enhancedContent.replace(
                  /href="([^"]+)"/g,
                  (_, url) => 
                    `href="${domain}/api/track-notifcation-mail/click?notificationId=${emailId}&email=${encodeURIComponent(email)}&url=${encodeURIComponent(url)}&tid=${trackingId}"`
                );
              }

              // Add open tracking
              if (trackOpens) {
                enhancedContent += `<img src="${domain}/api/track-notifcation-mail/open?notificationId=${emailId}&email=${encodeURIComponent(email)}&tid=${trackingId}" width="1" height="1" style="display:none" />`;
              }

              // Add footer with copyright and unsubscribe
              enhancedContent += `
                <div style="text-align:center;margin-top:20px;font-size:12px;color:#666;">
                  <p style="margin: 0 0 10px;">
                    © 2025 <a href="https://thenews.africa" style="color: #666666; text-decoration: underline;" target="_blank">TheNews Africa</a>. All rights reserved.
                  </p>
                  ${enableUnsubscribe ? `
                  <p style="margin: 0;">
                    <a href="${domain}/api/unsubscribe?email=${encodeURIComponent(email)}&ownerId=${newsLetterOwnerId}" 
                       style="color: #666666; text-decoration: underline;">
                      Unsubscribe 
                    </a>
                  </p>
                  ` : ''}
                </div>
              `;

              const fromName = fromApplication 
                ? `${fromApplication.charAt(0).toUpperCase()}${fromApplication.slice(1).toLowerCase()}`
                : 'TheNews';

              const result = await transporter.sendMail({
                from: `${fromName} <${process.env.SMTP_USER}>`,
                to: email,
                subject: subject,
                html: enhancedContent,
                headers: {
                  'X-Notification-ID': emailId,
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

    // Fetch current metadata
    const notification = await db.newsletterOwnerNotification.findUnique({
      where: { id: emailId },
      select: { metadata: true },
    });

  const currentMetadata = (notification?.metadata && typeof notification.metadata === "object" && !Array.isArray(notification.metadata))
  ? notification.metadata
  : {};

    // Update notification with final stats
    await db.newsletterOwnerNotification.update({
      where: { id: emailId },
      data: {
        status: 'SENT',
        sentAt: new Date(),
        emailsSent: { increment: 1 },
        recipients: { increment: totalAccepted },
        metadata: {
          ...currentMetadata,
          messageId: lastMessageId,
          failedRecipients: failedEmails.length ? failedEmails : undefined,
          totalRecipients: userEmail.length,
          batches: batches.length,
          successfulRecipients: totalAccepted,
        },
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
    console.error('[NOTIFICATION_SEND_ERROR]', error);

    await db.newsletterOwnerNotification.update({
      where: { id: emailId },
      data: { status: 'FAILED' },
    });

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Notification send failed',
      trackingId,
    };
  }
};






