


// 'use server';

// import * as nodemailer from 'nodemailer';
// import { EmailStatus } from '@prisma/client';
// import { db } from '@/shared/libs/database';
// import { checkUsageLimit, incrementUsage } from '@/lib/checkAndUpdateUsage';

// const BATCH_SIZE = 20;
// const BATCH_DELAY_MS = 1000;
// const MAX_RETRIES = 2;

// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,
//   port: Number(process.env.SMTP_PORT),
//   secure: process.env.SMTP_SECURE === "true",
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,
//   },
//   pool: true,
//   maxConnections: 5,
//   rateDelta: 5000,
//   tls: { rejectUnauthorized: false },
//   logger: true,
//   debug: true,
// });

// interface SendEmailParams {
//   userEmail: string[];
//   subject: string;
//   content: string;
//   emailId: string;
//   campaign?: string | null;         // optional
//   integrationId?: string | null;    // optional
//   newsLetterOwnerId: string;
//   contentJson: string;
//   adminEmail: string;
//   trackOpens?: boolean;
//   trackClicks?: boolean;
//   fromApplication: string;
// }

// export const sendEmail = async (params: SendEmailParams) => {
//   const {
//     userEmail,
//     subject,
//     content,
//     emailId,
//     campaign,
//     integrationId,
//     fromApplication,
//     newsLetterOwnerId,
//     contentJson,
//     adminEmail,
//     trackOpens = true,
//     trackClicks = true,
//   } = params;
 
//   // const domain = process.env.NEXT_PUBLIC_WEBSITE_URL || 'https://your-domain.com';
//   const domain = 'https://denews-xi.vercel.app/';
//   const startTime = Date.now();
//   const trackingId = `trk_${Date.now()}`;

//   try {
//     if (!newsLetterOwnerId || !adminEmail || !userEmail?.length) {
//       throw new Error('Missing required fields');
//     }

//     const usageCheck = await checkUsageLimit(newsLetterOwnerId, 'emailsSent');
//     if (!usageCheck.success) throw new Error(usageCheck.message);

//     const smtpAvailable = await transporter.verify().catch((err) => {
//       console.error("SMTP verification failed:", err);
//       return false;
//     });
//     if (!smtpAvailable) throw new Error("Email server unavailable");

//     // Update the email record (integration optional)
//     const emailRecord = await db.email.update({
//       where: { id: emailId },
//       data: {
//         content: contentJson,
//         status: EmailStatus.PENDING,
//         sentAt: new Date(),
//       },
//       include: {
//         campaign: { select: { name: true } },
//         integration: { select: { name: true } },
//       },
//     });

//     const batches = Array.from(
//       { length: Math.ceil(userEmail.length / BATCH_SIZE) },
//       (_, i) => userEmail.slice(i * BATCH_SIZE, (i + 1) * BATCH_SIZE)
//     );

//     let totalAccepted = 0;
//     let totalRejected = 0;
//     let lastMessageId = '';
//     const failedEmails: string[] = [];

//     for (const [batchIndex, batch] of batches.entries()) {
//       console.log(`Processing batch ${batchIndex + 1}/${batches.length}`);

//       const batchResults = await Promise.allSettled(
//         batch.map(async (email) => {
//           let retries = 0;
//           let lastError: Error | null = null;

//           while (retries <= MAX_RETRIES) {
//             try {
//               let enhancedContent = content;

//               if (trackClicks) {
//                 enhancedContent = enhancedContent.replace(
//                   /href="([^"]+)"/g,
//                   (_, url) => `href="${domain}/api/track/click?emailId=${emailId}&email=${encodeURIComponent(email)}&url=${encodeURIComponent(url)}&tid=${trackingId}"`
//                 );
//               }

//               if (trackOpens) {
//                 enhancedContent += `<img src="${domain}/api/track/open?emailId=${emailId}&email=${encodeURIComponent(email)}&tid=${trackingId}" width="1" height="1" style="display:none" />`;
//               }


//                // Add copyright notice and link to thenews.africa
//                 enhancedContent += `
//                   <div style="text-align:center;margin-top:20px;font-size:12px;color:#666;">
//                     <p>
//                       © 2025 <a href="https://thenews.africa" 
//                                 style="color:#666;text-decoration:underline;"
//                                 target="_blank">TheNews Africa</a>. 
//                       All rights reserved.
//                     </p>
//                   </div>
//                 `;

//                 // Add unsubscribe link
//               enhancedContent += `
//               <div style="text-align:center;margin-top:30px;font-size:12px;color:#666;">
//                 <a href="${domain}/api/unsubscribe?email=${encodeURIComponent(email)}&ownerId=${newsLetterOwnerId}${
//               integrationId ? `&integrationID=${encodeURIComponent(integrationId)}` : ""
//             }${campaign ? `&campaignID=${encodeURIComponent(campaign)}` : ""}"
//                   style="color:#666;text-decoration:underline;">
//                   Unsubscribe
//                 </a>
//               </div>
//             `;


//               const fromName = fromApplication.charAt(0).toUpperCase() + fromApplication.slice(1).toLowerCase();

//               const result = await transporter.sendMail({
//                 from: `${fromName} <${process.env.SMTP_USER}>`,
//                 to: email,
//                 subject,
//                 html: enhancedContent,
//                 headers: {
//                   'X-Email-ID': emailId,
//                   ...(campaign && { 'X-Campaign-ID': campaign }),
//                   'X-Tracking-ID': trackingId,
//                   ...(integrationId && { 'X-Integration-ID': integrationId }),
//                   'X-NewsLetter-Owner-ID': `${fromApplication} 'THENEWS' `,
//                   'List-Unsubscribe': `<${domain}/api/unsubscribe?email=${encodeURIComponent(email)}&ownerId=${newsLetterOwnerId}${integrationId ? `&integration=${encodeURIComponent(integrationId)}` : ''}${campaign ? `&campaignId=${encodeURIComponent(campaign)}` : ''}>`
//                 },
//               });

//               return { email, success: true, messageId: result.messageId };
//             } catch (error) {
//               lastError = error as Error;
//               retries++;
//               if (retries <= MAX_RETRIES) {
//                 await new Promise(res => setTimeout(res, 1000 * retries));
//               }
//             }
//           }

//           throw lastError || new Error('Failed after retries');
//         })
//       );

//       batchResults.forEach((result, index) => {
//         const email = batch[index];
//         if (result.status === 'fulfilled' && result.value.success) {
//           totalAccepted++;
//           lastMessageId = result.value.messageId || lastMessageId;
//         } else {
//           totalRejected++;
//           failedEmails.push(email);
//           console.error(`Failed to send to ${email}:`, result.status === 'rejected' ? result.reason : 'Unknown error');
//         }
//       });

//       if (batchIndex < batches.length - 1) {
//         await new Promise(res => setTimeout(res, BATCH_DELAY_MS));
//       }
//     }

//     // Transaction updates for campaign/integration if provided
//     await db.$transaction(async (tx) => {
//   await tx.email.update({
//     where: { id: emailId },
//     data: {
//       status: EmailStatus.SENT,
//       sentAt: new Date(),
//       messageId: lastMessageId,
//       recipients: { increment: totalAccepted },
//       emailsSent: { increment: 1 },
//     },
//   });

//   if (campaign) {
//     await tx.campaign.update({
//       where: { id: campaign },
//       data: {
//         emailsSent: { increment: 1 },
//         recipients: { increment: totalAccepted },
//         lastSentAt: new Date(),
//       },
//     });
//   }

//   if (integrationId) {
//     await tx.integration.update({
//       where: { id: integrationId },
//       data: {
//         emailsSent: { increment: 1 },
//         recipients: { increment: totalAccepted },
//       },
//     });
//   }
// });


//     await incrementUsage(newsLetterOwnerId, 'emailsSent', totalAccepted);

//     return {
//       success: true,
//       messageId: lastMessageId,
//       trackingId,
//       stats: {
//         total: userEmail.length,
//         accepted: totalAccepted,
//         rejected: totalRejected,
//         failedRecipients: failedEmails.length ? failedEmails : undefined,
//         batches: batches.length,
//         timeTaken: Date.now() - startTime,
//       },
//     };
//   } catch (error) {
//     console.error('[EMAIL_SEND_ERROR]', error);

//     await db.email.update({
//       where: { id: emailId },
//       data: { status: EmailStatus.FAILED },
//     });

//     return {
//       success: false,
//       error: error instanceof Error ? error.message : 'Email send failed',
//       trackingId,
//     };
//   }
// };










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
  secure: process.env.SMTP_SECURE === 'true',
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

interface SendEmailParams {
  userEmail: string[];
  subject: string;
  content: string;
  emailId: string;
  campaign?: string | null; // optional
  newsLetterOwnerId: string;
  contentJson: string;
  adminEmail: string;
  trackOpens?: boolean;
  trackClicks?: boolean;
  fromApplication: string;
}

export const sendEmail = async (params: SendEmailParams) => {
  const {
    userEmail,
    subject,
    content,
    emailId,
    campaign,
    fromApplication,
    newsLetterOwnerId,
    contentJson,
    adminEmail,
    trackOpens = true,
    trackClicks = true,
  } = params;

  const domain = 'https://denews-xi.vercel.app/';
  const startTime = Date.now();
  const trackingId = `trk_${Date.now()}`;

  try {
    if (!newsLetterOwnerId || !adminEmail || !userEmail?.length) {
      throw new Error('Missing required fields');
    }

    const usageCheck = await checkUsageLimit(newsLetterOwnerId, 'emailsSent');
    if (!usageCheck.success) throw new Error(usageCheck.message);

    const smtpAvailable = await transporter.verify().catch((err) => {
      console.error('SMTP verification failed:', err);
      return false;
    });
    if (!smtpAvailable) throw new Error('Email server unavailable');

    // Update the email record
    await db.email.update({
      where: { id: emailId },
      data: {
        content: contentJson,
        status: EmailStatus.PENDING,
        sentAt: new Date(),
      },
      include: {
        campaign: { select: { name: true } },
      },
    });

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

              if (trackClicks) {
                enhancedContent = enhancedContent.replace(
                  /href="([^"]+)"/g,
                  (_, url) =>
                    `href="${domain}/api/track/click?emailId=${emailId}&email=${encodeURIComponent(
                      email
                    )}&url=${encodeURIComponent(url)}&tid=${trackingId}"`
                );
              }

              if (trackOpens) {
                enhancedContent += `<img src="${domain}/api/track/open?emailId=${emailId}&email=${encodeURIComponent(
                  email
                )}&tid=${trackingId}" width="1" height="1" style="display:none" />`;
              }

              // Add copyright
              enhancedContent += `
                <div style="text-align:center;margin-top:20px;font-size:12px;color:#666;">
                  <p>
                    © 2025 <a href="https://thenews.africa" 
                              style="color:#666;text-decoration:underline;"
                              target="_blank">TheNews Africa</a>. 
                    All rights reserved.
                  </p>
                </div>
              `;

              // Add unsubscribe link
              enhancedContent += `
                <div style="text-align:center;margin-top:30px;font-size:12px;color:#666;">
                  <a href="${domain}/api/unsubscribe?email=${encodeURIComponent(
                email
              )}&ownerId=${newsLetterOwnerId}${
                campaign ? `&campaignID=${encodeURIComponent(campaign)}` : ''
              }"
                    style="color:#666;text-decoration:underline;">
                    Unsubscribe
                  </a>
                </div>
              `;

              const fromName =
                fromApplication.charAt(0).toUpperCase() +
                fromApplication.slice(1).toLowerCase();

              const result = await transporter.sendMail({
                from: `${fromName} <${process.env.SMTP_USER}>`,
                to: email,
                subject,
                html: enhancedContent,
                headers: {
                  'X-Email-ID': emailId,
                  ...(campaign && { 'X-Campaign-ID': campaign }),
                  'X-Tracking-ID': trackingId,
                  'X-NewsLetter-Owner-ID': `${fromApplication} 'THENEWS' `,
                  'List-Unsubscribe': `<${domain}/api/unsubscribe?email=${encodeURIComponent(
                    email
                  )}&ownerId=${newsLetterOwnerId}${
                    campaign ? `&campaignId=${encodeURIComponent(campaign)}` : ''
                  }>`
                },
              });

              return { email, success: true, messageId: result.messageId };
            } catch (error) {
              lastError = error as Error;
              retries++;
              if (retries <= MAX_RETRIES) {
                await new Promise((res) => setTimeout(res, 1000 * retries));
              }
            }
          }

          throw lastError || new Error('Failed after retries');
        })
      );

      batchResults.forEach((result, index) => {
        const email = batch[index];
        if (result.status === 'fulfilled' && result.value.success) {
          totalAccepted++;
          lastMessageId = result.value.messageId || lastMessageId;
        } else {
          totalRejected++;
          failedEmails.push(email);
          console.error(
            `Failed to send to ${email}:`,
            result.status === 'rejected' ? result.reason : 'Unknown error'
          );
        }
      });

      if (batchIndex < batches.length - 1) {
        await new Promise((res) => setTimeout(res, BATCH_DELAY_MS));
      }
    }

    // Update DB for campaign if provided
    await db.$transaction(async (tx) => {
      await tx.email.update({
        where: { id: emailId },
        data: {
          status: EmailStatus.SENT,
          sentAt: new Date(),
          messageId: lastMessageId,
          recipients: { increment: totalAccepted },
          emailsSent: { increment: 1 },
        },
      });

      if (campaign) {
        await tx.campaign.update({
          where: { id: campaign },
          data: {
            emailsSent: { increment: 1 },
            recipients: { increment: totalAccepted },
            lastSentAt: new Date(),
          },
        });
      }
    });

    await incrementUsage(newsLetterOwnerId, 'emailsSent', totalAccepted);

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
    console.error('[EMAIL_SEND_ERROR]', error);

    await db.email.update({
      where: { id: emailId },
      data: { status: EmailStatus.FAILED },
    });

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Email send failed',
      trackingId,
    };
  }
};









// "use server";

// import * as AWS from "aws-sdk";
// import * as nodemailer from "nodemailer";
// import { revalidatePath } from "next/cache";
// import Email from "@/models/email.model";
// import mongoose from "mongoose";
// import { checkUsageLimit, incrementUsage } from "@/lib/checkAndUpdateUsage";
// import Campaign from "@/models/newsLetterCampaign.model";

// AWS.config.update({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_KEY_ID,
//   region: "eu-north-1",
// });

// const ses = new AWS.SES({ apiVersion: "2010-12-01" });
// const transporter = nodemailer.createTransport({ SES: ses });

// export const sendEmail = async (formData: {
//   userEmail: string[];
//   subject: string;
//   content: string;
//   emailId: string;
//   category: string;
//   campaign: string;
//   newsLetterOwnerId: string;
//   contentJson: string;
// }) => {
//   try {
//     if (!formData.newsLetterOwnerId) {
//       return { error: "User not found or not authenticated." };
//     }

//     if (!formData.campaign || !formData.category) {
//       return { error: "Campaign or Category ID is missing." };
//     }

//     const adminMail = process.env.ADMIN_EMAIL || "goldick60@gmail.com";
//     const domain = process.env.NEXT_PUBLIC_APP_DOMAIN || "https://denews-xi.vercel.app/";

//     // ✅ Check usage limit
//     const usageCheck = await checkUsageLimit(formData.newsLetterOwnerId, "emailsSent");
//     if (!usageCheck.success) {
//       return { error: usageCheck.message };
//     }

//     // ✅ Check if the email already exists
//     let emailDoc = await Email.findOne({ title: formData.subject, newsLetterOwnerId: formData.newsLetterOwnerId });

//     if (emailDoc) {
//       // ✅ Update content and mark as SENT
//       await Email.findByIdAndUpdate(emailDoc._id, {
//         content: formData.contentJson,
//         status: "SENT",
//         category: formData.category,
//         campaign: formData.campaign,
//       });
//     } else {
//       emailDoc = await Email.create({
//         title: formData.subject,
//         content: formData.contentJson,
//         newsLetterOwnerId: formData.newsLetterOwnerId,
//         category: formData.category,
//         campaign: formData.campaign,
//         status: "SENT", 
//       });
//     }

//     const actualEmailId = emailDoc._id.toString();

//     // ✅ Track opens and clicks
//     const openPixel = `<img src="${domain}/api/track/open?emailId=${actualEmailId}" width="1" height="1" style="opacity:0;" alt="tracker"/>`;
//     const modifiedHtml = formData.content.replace(/href="([^"]+)"/g, (match, url) => {
//       const encoded = encodeURIComponent(url);
//       return `href="${domain}/api/track/click?emailId=${actualEmailId}&url=${encoded}"`;
//     });
//     const htmlWithTracking = modifiedHtml + openPixel;
//     // ✅ Send email
//     const response = await transporter.sendMail({
//       from: adminMail,
//       to: formData.userEmail,
//       subject: formData.subject,
//       html: htmlWithTracking,
//     });

//     // ✅ Update campaign
//     if (formData.campaign && mongoose.Types.ObjectId.isValid(formData.campaign)) {
//       await Campaign.findByIdAndUpdate(formData.campaign, {
//         $inc: { emailsSent: 1 },
//         $addToSet: { emails: emailDoc._id },
//       });
//     }

//     // ✅ Track usage
//     await incrementUsage(formData.newsLetterOwnerId, "emailsSent");

//     revalidatePath("/dashboard");

//     return { success: true, messageId: response.messageId };
//   } catch (error) {
//     console.error("Email sending failed:", error);
//     return { error: "Failed to send email" };
//   }
// };
