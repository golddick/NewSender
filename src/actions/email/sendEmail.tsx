// 'use server';

// import { db } from '@/shared/libs/database';
// import { EmailStatus } from '@prisma/client';
// import { sendEmail } from '@/shared/utils/email.sender';
// import { currentUser } from '@clerk/nextjs/server';

// export const sendEmailNow = async ({
//   emailId,
//   htmlContent,
//   subscriberEmails,
// }: {
//   emailId: string;
//   htmlContent: string;
//   subscriberEmails: string[];
// }) => {
//   try {
//     // Validate input
//     if (!emailId || !htmlContent || !subscriberEmails?.length) {
//       return { success: false, error: 'Missing required parameters' };
//     }

//     // Get current user for admin email fallback
//     const user = await currentUser();
//     const adminEmail = user?.emailAddresses?.[0]?.emailAddress || process.env.SMTP_USER || '';

//     // Get email record with related data
//     const emailRecord = await db.email.findUnique({
//       where: { id: emailId },
//       include: {
//         campaign: {
//           select: {
//             name: true,
//             status: true,
//           },
//         },
//         integration: {
//           select: {
//             name: true,
//             status: true,
//           },
//         },
//       },
//     });

//     if (!emailRecord) {
//       return { success: false, error: 'Email not found' };
//     }

//     // Validate email associations
//     if (!emailRecord.integrationId || !emailRecord.campaignId || !emailRecord.newsLetterOwnerId) {
//       return { success: false, error: 'Missing required email associations (integration, campaign, owner)' };
//     }

//     // Check if campaign and integration are active
//     if (emailRecord.campaign?.status !== 'active') {
//       return { success: false, error: 'Associated campaign is not active' };
//     }

//     if (emailRecord.integration?.status !== 'active') {
//       return { success: false, error: 'Associated integration is not active' };
//     }

//     // Limit batch size for sending
//     const MAX_BATCH_SIZE = 50;
//     const batches = [];
//     for (let i = 0; i < subscriberEmails.length; i += MAX_BATCH_SIZE) {
//       batches.push(subscriberEmails.slice(i, i + MAX_BATCH_SIZE));
//     }

//     let successfulSends = 0;
//     const failedRecipients: string[] = [];

//     // Process email batches
//     for (const batch of batches) {
//       const result = await sendEmail({
//         userEmail: batch,
//         subject: emailRecord.emailSubject || emailRecord.title,
//         content: htmlContent,
//         emailId: emailRecord.id,
//         contentJson: emailRecord.content,
//         campaign: emailRecord.campaignId,
//         integrationId: emailRecord.integrationId,
//         newsLetterOwnerId: emailRecord.newsLetterOwnerId,
//         adminEmail,
//         trackOpens: emailRecord.trackOpens,
//         trackClicks: emailRecord.trackClicks,
//       });

//       if (result.success) {
//         successfulSends += batch.length;
//       } else {
//         failedRecipients.push(...batch);
//         console.error('Failed batch:', batch, 'Error:', result.error);
//       }
//     }

//     // Update email status and stats
//     await db.$transaction([
//       db.email.update({
//         where: { id: emailId },
//         data: {
//           status: successfulSends > 0 ? EmailStatus.SENT : EmailStatus.FAILED,
//           sentAt: new Date(),
//           recipients: { increment: successfulSends },
//         },
//       }),
//       db.campaign.update({
//         where: { id: emailRecord.campaignId },
//         data: {
//           emailsSent: { increment: 1 },
//         },
//       }),
//       db.integration.update({
//         where: { id: emailRecord.integrationId },
//         data: {
//           emailsSent: { increment: 1 },
//         },
//       }),
//     ]);

//     return {
//       success: successfulSends > 0,
//       message: successfulSends > 0
//         ? `Email sent to ${successfulSends} recipients${failedRecipients.length > 0 ? ` (${failedRecipients.length} failed)` : ''}`
//         : 'Failed to send to all recipients',
//       stats: {
//         sent: successfulSends,
//         failed: failedRecipients.length,
//         failedRecipients: failedRecipients.length > 0 ? failedRecipients : undefined,
//       },
//     };
//   } catch (error) {
//     console.error('[SEND_EMAIL_NOW_ERROR]', error);
    
//     // Attempt to mark as failed in database
//     try {
//       await db.email.update({
//         where: { id: emailId },
//         data: {
//           status: EmailStatus.FAILED,
//         },
//       });
//     } catch (dbError) {
//       console.error('Failed to update email status:', dbError);
//     }

//     return {
//       success: false,
//       error: error instanceof Error ? error.message : 'Failed to send email',
//     };
//   }
// };