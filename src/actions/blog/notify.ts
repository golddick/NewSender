'use server';

import { db } from '@/shared/libs/database';
import { newPostNotificationTemplate } from '@/shared/libs/email-templates/new-post';
import { sendNotificationEmail } from '@/shared/utils/notificationEmail.sender';
import { NewsletterOwnerNotificationCategory, NotificationType, NotificationPriority, SystemNotificationCategory } from '@prisma/client';

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
      return { success: true, message: 'No subscribers found.' };
    }

    const userEmails = subscribers.map((s) => s.email);

    // 2. Check for custom notification template
    let userTemplate = await db.newsletterOwnerNotification.findFirst({
      where: {
        userId: post.authorId,
        category: NewsletterOwnerNotificationCategory.NEW_BLOG,
        type: NotificationType.EMAIL,
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    // 3. Check system notification template if no custom one
    let systemTemplate = !userTemplate
      ? await db.systemNotification.findFirst({
          where: {
            category: SystemNotificationCategory.NEW_BLOG,
            type: NotificationType.EMAIL,
          },
        })
      : null;

    // 4. If no template exists, create a default system template
    if (!userTemplate && !systemTemplate) {
      const defaultHtml = newPostNotificationTemplate({
        author: '[Author]',
        title: '[Title]',
        subtitle: '[Subtitle]',
        excerpt: '[Excerpt]',
        featuredImage: '',
        url: '[Url]',
        platform: '[Platform]',
        HostPlatformUrl: '[HostPlatformUrl]',
        HostPlatform: '[HostPlatform]',
      });

      systemTemplate = await db.systemNotification.create({
        data: {
          type: NotificationType.EMAIL,
          category: SystemNotificationCategory.NEW_BLOG,
          priority: NotificationPriority.MEDIUM,
          title: 'New Blog Post: [Title]',
          content: {
            subject: 'New Post: [Title]',
            html: defaultHtml,
            text: 'A new blog post is live: [Title] by [Author]',
          },
          htmlContent: defaultHtml,
          textContent: 'A new blog post is live: [Title] by [Author]',
          status: 'DRAFT',
        },
      });
    }

    const activeTemplate = userTemplate || systemTemplate;
    if (!activeTemplate) {
      throw new Error('No notification template available for blog posts');
    }

    const templateContent: any = userTemplate ? userTemplate.content : {
      subject: `New Post: ${post.title}`,
      html: systemTemplate!.htmlContent,
      text: systemTemplate!.textContent,
    };

    // 5. Personalize template content
    const personalizedContent = {
      ...templateContent,
      html: templateContent.html
        ?.replace(/\[Author\]/g, post.author)
        .replace(/\[Title\]/g, post.title)
        .replace(/\[Subtitle\]/g, post.subtitle || '')
        .replace(/\[Excerpt\]/g, post.excerpt || '')
        .replace(/\[Url\]/g, `${process.env.NEXT_PUBLIC_WEBSITE_URL}/blog/${post.slug}`)
        .replace(/\[Platform\]/g, fromApplication)
        .replace(/\[HostPlatformUrl\]/g, `${process.env.NEXT_PUBLIC_WEBSITE_URL}/blog`)
        .replace(/\[HostPlatform\]/g, `${process.env.NEXT_PUBLIC_SOURCE}`),

      text: templateContent.text
        ?.replace(/\[Author\]/g, post.author)
        .replace(/\[Title\]/g, post.title),

      subject: templateContent.subject?.replace(/\[Title\]/g, post.title),
    };

    // 6. Create a notification record
    const notification = await db.newsletterOwnerNotification.create({
      data: {
        type: 'EMAIL',
        category: NewsletterOwnerNotificationCategory.NEW_BLOG,
        title: personalizedContent.subject,
        content: personalizedContent,
        textContent: personalizedContent.text,
        htmlContent: personalizedContent.html,
        status: 'DRAFT',
        priority: 'LOW',
        userId: post.authorId,
        recipient: 0,
        metadata: {
          postId: post.id,
          postSlug: post.slug,
          postTitle: post.title,
          campaignId,
          totalRecipients: userEmails.length,
        },
        integrationId,
        emailsSent: 0,
      },
    });

    // 7. Send bulk email
    const result = await sendNotificationEmail({
      userEmail: userEmails,
      subject: personalizedContent.subject,
      content: personalizedContent.html,
      emailId: notification.id,
      newsLetterOwnerId: post.authorId,
      contentJson: JSON.stringify(personalizedContent),
      adminEmail,
      fromApplication,
      trackOpens: true,
      trackClicks: true,
      enableUnsubscribe: true,
      isBulk: true,
    });

    // 8. Update notification status
    await db.newsletterOwnerNotification.update({
  where: { id: notification.id },
  data: {
    status: result.success ? 'SENT' : 'FAILED',
    sentAt: new Date(),
    emailsSent: result.success ? userEmails.length : 0,
    ...(result.messageId && {
      metadata: {
        ...(typeof notification.metadata === 'object' && notification.metadata !== null
          ? (notification.metadata as Record<string, any>)
          : {}),
        messageId: result.messageId,
      },
    }),
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




// 'use server';

// import { db } from '@/shared/libs/database';
// import { newPostNotificationTemplate } from '@/shared/libs/email-templates/new-post';
// import { sendNotificationEmail } from '@/shared/utils/notificationEmail.sender';
// import { NotificationType, NotificationStatus, NewsletterOwnerNotificationCategory } from '@prisma/client';
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
//   integrationId?: string;
//   campaignId?: string;
// }

// /**
//  * Notify subscribers about a new published blog post using the new Notification model
//  * Creates a single notification that will be sent to all subscribers
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

//     // 2. Build email content using template
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

//     // 3. Create a single notification record for all subscribers
//     const notification = await db.newsletterOwnerNotification.create({
//       data: {
//         type: 'EMAIL',
//         category: NewsletterOwnerNotificationCategory.NEW_BLOG,
//         title: `New Post: ${post.title}`,
//         content: content,
//         textContent: post.excerpt || post.subtitle || post.title,
//         status: 'DRAFT',
//         priority: 'MEDIUM',
//         userId: post.authorId,
//         recipient: 0, // Store admin email as primary recipient
//         metadata: {
//           postId: post.id,
//           postSlug: post.slug,
//           postTitle: post.title,
//           campaignId: campaignId,
//           totalRecipients: userEmails.length,
//         },
//         integrationId: integrationId,
//         emailsSent: 0, // Will be updated after sending
//       },
//     });

//     // 4. Send bulk email via notification email sender
//     const result = await sendNotificationEmail({
//       userEmail: userEmails,
//       subject: `New Post: ${post.title}`,
//       content: content,
//       emailId: notification.id, // Use the notification ID for tracking
//       newsLetterOwnerId: post.authorId,
//       contentJson: JSON.stringify({ content }),
//       adminEmail: adminEmail,
//       fromApplication: fromApplication,
//       trackOpens: true,
//       trackClicks: true,
//       enableUnsubscribe: true,
//       isBulk: true // Indicate this is a bulk send
//     });

//     console.log('[NOTIFY_SUBSCRIBERS_RESULT]', result);

//     // 5. Update notification status based on result
//     await db.newsletterOwnerNotification.update({
//       where: { id: notification.id },
//       data: {
//         status: result.success ? 'SENT' : 'FAILED',
//         sentAt: new Date(),
//         emailsSent: result.success ? userEmails.length : 0,
//         ...(result.messageId && { 
//           metadata: {
//             messageId: result.messageId
//           }
//         })
//       },
//     });

//     return result;
//   } catch (error) {
//     console.error('[NOTIFY_SUBSCRIBERS_ERROR]', error);

//     // Update notification to failed status if error occurs
//     await db.newsletterOwnerNotification.updateMany({
//       where: {
//         metadata: { path: ['postId'], equals: post.id }
//       },
//       data: {
//         status: 'FAILED'
//       },
//     });

//     return {
//       success: false,
//       error: error instanceof Error ? error.message : 'Failed to notify subscribers',
//     };
//   }
// }