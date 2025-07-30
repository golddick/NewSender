





// 'use server';

// import { db } from '@/shared/libs/database';
// import { newPostNotificationTemplate } from '@/shared/libs/email-templates/new-post';
// import { sendNotificationEmail } from '@/shared/utils/notificationEmail.sender';
// import { EmailStatus, NotificationEmailType } from '@prisma/client';
// import { v4 as uuidv4 } from 'uuid';

// interface NotifyParams {
//   post: {
//     id: string;
//     slug: string;
//     title: string;
//     subtitle?: string | null;
//     excerpt?: string | null;
//     featuredImage?: string | null;
//     author: string;
//     authorId: string;
//   };
//   adminEmail: string;
//   fromApplication: string;
//   integrationId?: string;  // optional if needed
//   campaignId?: string;     // optional if needed
// }

// /**
//  * Notify subscribers about a new published blog post using NotificationEmail
//  */
// export async function notifySubscribersAboutNewPost({
//   post,
//   adminEmail,
//   fromApplication,
//   integrationId,
//   campaignId,
// }: NotifyParams) {
//   try {
//     // 1. Fetch subscribers
//     const subscribers = await db.subscriber.findMany({
//       where: { newsLetterOwnerId: post.authorId },
//       select: { email: true },
//     }); 

//     if (!subscribers.length) {
//       console.log('No subscribers to notify.');
//       return { success: true, message: 'No subscribers found.' };
//     }

//     const userEmails = subscribers.map((s) => s.email);

//     // 2. Create a new notification email record for tracking
//     const notificationEmail = await db.notificationEmail.create({
//       data: {
//         title: `New Post: ${post.title}`,
//         content: '',
//         status: EmailStatus.PENDING,
//         newsLetterOwnerId: post.authorId,
//         userId: post.authorId,
//         emailType: NotificationEmailType.NEW_BLOG_POST,
//         trackOpens: true,
//         trackClicks: true,
//         enableUnsubscribe: true,
//         integrationId: integrationId,
//       },
//     });

//     // 3. Build email content using template
//     const content = newPostNotificationTemplate({
//       author: post.author,
//       title: post.title,
//       subtitle: post.subtitle ?? undefined,
//       excerpt: post.excerpt ?? undefined,
//       featuredImage: post.featuredImage ?? undefined,
//       url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/blog/${post.slug}`,
//       HostPlatformUrl: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/blog`,
//       HostPlatform: `${process.env.NEXT_PUBLIC_SOURCE}`, 
//       platform: fromApplication,
//     });

//     // 4. Send email via notification email sender
//     const result = await sendNotificationEmail({
//       userEmail: userEmails,
//       subject: `New Post: ${post.title}`,
//       content: content,
//       emailId: notificationEmail.id,
//       newsLetterOwnerId: post.authorId,
//       contentJson: JSON.stringify({ content }),
//       adminEmail: adminEmail,
//       fromApplication: fromApplication, 
//       trackOpens: true,
//       trackClicks: true,
//       enableUnsubscribe: true
//     });

//     console.log('[NOTIFY_SUBSCRIBERS_RESULT]', result);

//     // 5. Update notification email status based on result
//     await db.notificationEmail.update({
//       where: { id: notificationEmail.id },
//       data: {
//         status: result.success ? 'SENT' : 'FAILED',
//         sentAt: new Date(),
//         recipients: result.success ? userEmails.length : 0,
//         ...(result.messageId && { messageId: result.messageId })
//       },
//     });

//     return result;
//   } catch (error) {
//     console.error('[NOTIFY_SUBSCRIBERS_ERROR]', error);
    
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : 'Failed to notify subscribers',
//     };
//   }
// }








'use server';

import { db } from '@/shared/libs/database';
import { newPostNotificationTemplate } from '@/shared/libs/email-templates/new-post';
import { sendNotificationEmail } from '@/shared/utils/notificationEmail.sender';
import { NotificationType, NotificationCategory, NotificationStatus } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

interface NotifyParams {
  post: {
    id: string;
    slug: string;
    title: string;
    subtitle?: string | null;
    excerpt?: string | null;
    featuredImage?: string | null;
    author: string;
    authorId: string;
  };
  adminEmail: string;
  fromApplication: string;
  integrationId?: string;
  campaignId?: string;
}

/**
 * Notify subscribers about a new published blog post using the new Notification model
 * Creates a single notification that will be sent to all subscribers
 */
export async function notifySubscribersAboutNewPost({
  post,
  adminEmail,
  fromApplication,
  integrationId,
  campaignId,
}: NotifyParams) {
  try {
    // 1. Fetch subscribers
    const subscribers = await db.subscriber.findMany({
      where: { newsLetterOwnerId: post.authorId },
      select: { email: true },
    });

    if (!subscribers.length) {
      console.log('No subscribers to notify.');
      return { success: true, message: 'No subscribers found.' };
    }

    const userEmails = subscribers.map((s) => s.email);

    // 2. Build email content using template
    const content = newPostNotificationTemplate({
      author: post.author,
      title: post.title,
      subtitle: post.subtitle ?? undefined,
      excerpt: post.excerpt ?? undefined,
      featuredImage: post.featuredImage ?? undefined,
      url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/blog/${post.slug}`,
      HostPlatformUrl: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/blog`,
      HostPlatform: `${process.env.NEXT_PUBLIC_SOURCE}`,
      platform: fromApplication,
    });

    // 3. Create a single notification record for all subscribers
    const notification = await db.notification.create({
      data: {
        type: 'EMAIL',
        category: 'BLOG_APPROVAL',
        title: `New Post: ${post.title}`,
        content: content,
        textContent: post.excerpt || post.subtitle || post.title,
        status: 'PENDING',
        priority: 'MEDIUM',
        userId: post.authorId,
        recipient: 0, // Store admin email as primary recipient
        metadata: {
          postId: post.id,
          postSlug: post.slug,
          postTitle: post.title,
          campaignId: campaignId,
          subscriberEmails: userEmails, // Store all subscriber emails in metadata
          totalRecipients: userEmails.length,
        },
        integrationId: integrationId,
        emailsSent: 0, // Will be updated after sending
      },
    });

    // 4. Send bulk email via notification email sender
    const result = await sendNotificationEmail({
      userEmail: userEmails,
      subject: `New Post: ${post.title}`,
      content: content,
      emailId: notification.id, // Use the notification ID for tracking
      newsLetterOwnerId: post.authorId,
      contentJson: JSON.stringify({ content }),
      adminEmail: adminEmail,
      fromApplication: fromApplication,
      trackOpens: true,
      trackClicks: true,
      enableUnsubscribe: true,
      isBulk: true // Indicate this is a bulk send
    });

    console.log('[NOTIFY_SUBSCRIBERS_RESULT]', result);

    // 5. Update notification status based on result
    await db.notification.update({
      where: { id: notification.id },
      data: {
        status: result.success ? 'SENT' : 'FAILED',
        sentAt: new Date(),
        emailsSent: result.success ? userEmails.length : 0,
        ...(result.messageId && { 
          metadata: {
            messageId: result.messageId
          }
        })
      },
    });

    return result;
  } catch (error) {
    console.error('[NOTIFY_SUBSCRIBERS_ERROR]', error);

    // Update notification to failed status if error occurs
    await db.notification.updateMany({
      where: {
        metadata: { path: ['postId'], equals: post.id }
      },
      data: {
        status: 'FAILED'
      },
    });

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to notify subscribers',
    };
  }
}