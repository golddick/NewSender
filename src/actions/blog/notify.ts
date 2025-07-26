// 'use server';

// import { db } from '@/shared/libs/database';
// import { newPostNotificationTemplate } from '@/shared/libs/email-templates/new-post';
// import { sendEmail } from '@/shared/utils/email.sender';
// import { EmailStatus } from '@prisma/client';
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
//  * Notify subscribers about a new published blog post
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

//     // 2. Create a new email record for tracking
//     const emailRecord = await db.email.create({
//       data: {
//         title: `New Blog post by ${post.author}: ${post.title}`.toLowerCase(),
//         content: '',
//         status: EmailStatus.PENDING,
//         newsLetterOwnerId: post.authorId,
//         emailType:'INSTANT',
//         userId: post.authorId,

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

//     // 4. Send email via emailsender function
//     const result = await sendEmail({
//       userEmail: userEmails,
//       subject: `New Blog post by ${post.author}:${post.title}`,
//       content: content,
//       emailId: emailRecord.id,
//       campaign: campaignId,
//       integrationId: integrationId,
//       newsLetterOwnerId: post.authorId,
//       contentJson: JSON.stringify({ content}),
//       adminEmail,
//       trackOpens: true,
//       trackClicks: true,
//       fromApplication,
//     });

//     console.log('[NOTIFY_SUBSCRIBERS_RESULT]', result);

//     // 5. Update email status if successful
//     if (result.success) {
//       await db.email.update({
//         where: { id: emailRecord.id },
//         data: {
//           status: EmailStatus.SENT,
//         },
//       });
//     } else {
//       await db.email.update({
//         where: { id: emailRecord.id },
//         data: {
//           status: EmailStatus.FAILED,
//         },
//       });
//     }

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
import { EmailStatus, NotificationEmailType } from '@prisma/client';
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
  integrationId?: string;  // optional if needed
  campaignId?: string;     // optional if needed
}

/**
 * Notify subscribers about a new published blog post using NotificationEmail
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

    // 2. Create a new notification email record for tracking
    const notificationEmail = await db.notificationEmail.create({
      data: {
        title: `New Post: ${post.title}`,
        content: '',
        status: EmailStatus.PENDING,
        newsLetterOwnerId: post.authorId,
        userId: post.authorId,
        emailType: NotificationEmailType.NEW_BLOG_POST,
        trackOpens: true,
        trackClicks: true,
        enableUnsubscribe: true,
        integrationId: integrationId,
      },
    });

    // 3. Build email content using template
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

    // 4. Send email via notification email sender
    const result = await sendNotificationEmail({
      userEmail: userEmails,
      subject: `New Post: ${post.title}`,
      content: content,
      emailId: notificationEmail.id,
      newsLetterOwnerId: post.authorId,
      contentJson: JSON.stringify({ content }),
      adminEmail: adminEmail,
      fromApplication: fromApplication,
      trackOpens: true,
      trackClicks: true,
      enableUnsubscribe: true
    });

    console.log('[NOTIFY_SUBSCRIBERS_RESULT]', result);

    // 5. Update notification email status based on result
    await db.notificationEmail.update({
      where: { id: notificationEmail.id },
      data: {
        status: result.success ? 'SENT' : 'FAILED',
        sentAt: new Date(),
        recipients: result.success ? userEmails.length : 0,
        ...(result.messageId && { messageId: result.messageId })
      },
    });

    return result;
  } catch (error) {
    console.error('[NOTIFY_SUBSCRIBERS_ERROR]', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to notify subscribers',
    };
  }
}