// 'use server';

// import { db } from '@/shared/libs/database';
// import { newPostNotificationTemplate } from '@/shared/libs/email-templates/new-post';
// import { sendNotificationEmail } from '@/shared/utils/notificationEmail.sender';
// import {
//   NewsletterOwnerNotificationCategory,
//   NotificationType,
//   NotificationPriority,
//   NotificationStatus,
//   SystemNotificationCategory,
// } from '@prisma/client';

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
//       return { success: true, message: 'No subscribers found.' };
//     }

//     const userEmails = subscribers.map((s) => s.email);

//     // 2. Try to get user's custom notification template
//     let userTemplate = await db.newsletterOwnerNotification.findFirst({
//       where: {
//         userId: post.authorId,
//         category: NewsletterOwnerNotificationCategory.NEW_BLOG,
//         type: NotificationType.EMAIL,
//       },
//       orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
//     });

//     // 3. If no user template, check for system template
//     let systemTemplate = !userTemplate
//       ? await db.systemNotification.findFirst({
//           where: {
//             category: SystemNotificationCategory.NEW_BLOG,
//             type: NotificationType.EMAIL,
//           },
//         })
//       : null;

//     // 4. If no template exists, create system and user templates
//     if (!userTemplate && !systemTemplate) {
//       const defaultHtml = newPostNotificationTemplate({
//         author: '[Author]',
//         title: '[Title]',
//         subtitle: '[Subtitle]',
//         excerpt: '[Excerpt]',
//         featuredImage: '[FeaturedImage]',
//         url: '[Url]',
//         platform: '[Platform]',
//         HostPlatformUrl: '[HostPlatformUrl]',
//         HostPlatform: '[HostPlatform]',
//       });

//       systemTemplate = await db.systemNotification.create({
//         data: {
//           type: NotificationType.EMAIL,
//           category: SystemNotificationCategory.NEW_BLOG,
//           priority: NotificationPriority.LOW,
//           title: 'New Blog Post: [Title]',
//           content: {
//             subject: 'New Post: [Title]',
//             html: defaultHtml,
//             text: 'A new blog post is live: [Title] by [Author]',
//           },
//           htmlContent: defaultHtml,
//           textContent: 'A new blog post is live: [Title] by [Author]',
//           status: NotificationStatus.DRAFT,
//         },
//       });

//       userTemplate = await db.newsletterOwnerNotification.create({
//         data: {
//           userId: post.authorId,
//           type: NotificationType.EMAIL,
//           category: NewsletterOwnerNotificationCategory.NEW_BLOG,
//           priority: NotificationPriority.LOW,
//           title: systemTemplate.title,
//           content: systemTemplate.content || defaultHtml,
//           status: NotificationStatus.DRAFT,
//           textContent: systemTemplate.textContent,
//           htmlContent: systemTemplate.htmlContent,
//         },
//       });
//     }

//     // 5. Determine the active template
//     const activeTemplate = userTemplate || systemTemplate;
//     if (!activeTemplate) throw new Error('No notification template available');

//     const templateContent = {
//       subject: activeTemplate.title,
//       html: activeTemplate.htmlContent,
//       text: activeTemplate.textContent,
//     };

//     // 6. Personalize template content
//     const personalizedContent = {
//       ...templateContent,
//       html: (templateContent.html || '')
//         .replace(/\[Author\]/g, post.author)
//         .replace(/\[Title\]/g, post.title)
//         .replace(/\[Subtitle\]/g, post.subtitle || '')
//         .replace(/\[Excerpt\]/g, post.excerpt || '')
//         .replace(/\[FeaturedImage\]/g, post.featuredImage || '')
//         .replace(/\[Url\]/g, `${process.env.NEXT_PUBLIC_WEBSITE_URL}/blog/${post.slug}`)
//         .replace(/\[Platform\]/g, fromApplication)
//         .replace(/\[HostPlatformUrl\]/g, `${process.env.NEXT_PUBLIC_WEBSITE_URL}/blog`)
//         .replace(/\[HostPlatform\]/g, `${process.env.NEXT_PUBLIC_SOURCE}`),
//       text: (templateContent.text || '')
//         .replace(/\[Author\]/g, post.author)
//         .replace(/\[Title\]/g, post.title),
//       subject: (templateContent.subject || `New Blog Post: ${post.title}`).replace(/\[Title\]/g, post.title),
//     };

//     // 7. Find or create a SINGLE notification record
//     let notification = await db.newsletterOwnerNotification.findFirst({
//       where: {
//         userId: post.authorId,
//         category: NewsletterOwnerNotificationCategory.NEW_BLOG,
//         type: NotificationType.EMAIL,
//         priority: NotificationPriority.LOW,
//       },
//     });

//     if (notification) {
//       // Update the single notification with the latest post content and increment recipients
//       notification = await db.newsletterOwnerNotification.update({
//         where: { id: notification.id },
//         data: {
//           title: personalizedContent.subject,
//           content: personalizedContent,
//           textContent: personalizedContent.text,
//           htmlContent: personalizedContent.html,
//           status: NotificationStatus.DRAFT,
//           priority: NotificationPriority.LOW,
//           metadata: {
//             postId: post.id,
//             postSlug: post.slug,
//             postTitle: post.title,
//             campaignId,
//             totalRecipients: userEmails.length,
//           },
//           integrationId,
//           recipient: { increment: userEmails.length }, // ✅ Increment recipients count
//         },
//       });
//     } else {
//       // Create the notification record the first time
//       notification = await db.newsletterOwnerNotification.create({
//         data: {
//           type: NotificationType.EMAIL,
//           category: NewsletterOwnerNotificationCategory.NEW_BLOG,
//           title: personalizedContent.subject,
//           content: personalizedContent,
//           textContent: personalizedContent.text,
//           htmlContent: personalizedContent.html,
//           status: NotificationStatus.DRAFT,
//           priority: NotificationPriority.LOW,
//           userId: post.authorId,
//           recipient: userEmails.length,
//           metadata: {
//             postId: post.id,
//             postSlug: post.slug,
//             postTitle: post.title,
//             campaignId,
//             totalRecipients: userEmails.length,
//           },
//           integrationId,
//           emailsSent: 0,
//         },
//       });
//     }

//     // 8. Send bulk email
//     const result = await sendNotificationEmail({
//       userEmail: userEmails,
//       subject: personalizedContent.subject,
//       content: personalizedContent.html,
//       emailId: notification.id,
//       newsLetterOwnerId: post.authorId,
//       contentJson: JSON.stringify(personalizedContent),
//       adminEmail,
//       fromApplication,
//       trackOpens: true,
//       trackClicks: true,
//       enableUnsubscribe: true,
//       isBulk: true,
//     });

//     // 9. Update notification status
//     await db.newsletterOwnerNotification.update({
//       where: { id: notification.id },
//       data: {
//         status: result.success ? NotificationStatus.SENT : NotificationStatus.FAILED,
//         sentAt: new Date(),
//         recipients: result.success ? userEmails.length : 0,
//         ...(result.messageId && {
//           metadata: {
//             ...(typeof notification.metadata === 'object' && notification.metadata !== null
//               ? notification.metadata
//               : {}),
//             messageId: result.messageId,
//           },
//         }),
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
import {
  NewsletterOwnerNotificationCategory,
  NotificationType,
  NotificationPriority,
  NotificationStatus,
  SystemNotificationCategory,
} from '@prisma/client';

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

    // 2. Get or create one template notification for NEW_BLOG
    let notificationTemplate = await db.newsletterOwnerNotification.findFirst({
      where: {
        userId: post.authorId,
        category: NewsletterOwnerNotificationCategory.NEW_BLOG,
        type: NotificationType.EMAIL,
      },
    });

    if (!notificationTemplate) {
      const defaultHtml = newPostNotificationTemplate({
        author: '[Author]',
        title: '[Title]',
        subtitle: '[Subtitle]',
        excerpt: '[Excerpt]',
        featuredImage: '[FeaturedImage]',
        url: '[Url]',
        platform: '[Platform]',
        HostPlatformUrl: '[HostPlatformUrl]',
        HostPlatform: '[HostPlatform]',
      });

      notificationTemplate = await db.newsletterOwnerNotification.create({
        data: {
          userId: post.authorId,
          type: NotificationType.EMAIL,
          category: NewsletterOwnerNotificationCategory.NEW_BLOG,
          priority: NotificationPriority.LOW,
          title: 'New Blog Post: [Title]',
          content: {
            subject: 'New Post: [Title]',
            html: defaultHtml,
            text: 'A new blog post is live: [Title] by [Author]',
          },
          textContent: 'A new blog post is live: [Title] by [Author]',
          htmlContent: defaultHtml,
          status: NotificationStatus.DRAFT,
          integrationId,
        },
      });
    }

    // 3. Use the template to create personalized content (but do NOT overwrite template content in DB)
    const templateContent = {
      subject: notificationTemplate.title,
      html: notificationTemplate.htmlContent,
      text: notificationTemplate.textContent,
    };

    const personalizedContent = {
      ...templateContent,
      html: (templateContent.html || '')
        .replace(/\[Author\]/g, post.author)
        .replace(/\[Title\]/g, post.title)
        .replace(/\[Subtitle\]/g, post.subtitle || '')
        .replace(/\[Excerpt\]/g, post.excerpt || '')
        .replace(/\[FeaturedImage\]/g, post.featuredImage || '')
        .replace(/\[Url\]/g, `${process.env.NEXT_PUBLIC_WEBSITE_URL}/blog/${post.slug}`)
        .replace(/\[Platform\]/g, fromApplication)
        .replace(/\[HostPlatformUrl\]/g, `${process.env.NEXT_PUBLIC_WEBSITE_URL}/blog`)
        .replace(/\[HostPlatform\]/g, `${process.env.NEXT_PUBLIC_SOURCE}`),
      text: (templateContent.text || '')
        .replace(/\[Author\]/g, post.author)
        .replace(/\[Title\]/g, post.title),
      subject: (templateContent.subject || `New Blog Post: ${post.title}`).replace(/\[Title\]/g, post.title),
    };

    // 4. Update template metadata (increment recipients, update last sent info, but don't overwrite content)
    await db.newsletterOwnerNotification.update({
      where: { id: notificationTemplate.id },
      data: {
        metadata: {
          lastSentPostId: post.id,
          lastSentPostTitle: post.title,
          campaignId,
          totalRecipients: userEmails.length,
        },
      },
    });

    // 5. Send bulk email using the personalized content (but template in DB stays generic)
    const result = await sendNotificationEmail({
      userEmail: userEmails,
      subject: personalizedContent.subject,
      content: personalizedContent.html,
      emailId: notificationTemplate.id,
      newsLetterOwnerId: post.authorId,
      contentJson: JSON.stringify(personalizedContent),
      adminEmail,
      fromApplication,
      trackOpens: true,
      trackClicks: true,
      enableUnsubscribe: true,
      isBulk: true,
    });

    // 6. Update status
    await db.newsletterOwnerNotification.update({
      where: { id: notificationTemplate.id },
      data: {
        status: result.success ? NotificationStatus.SENT : NotificationStatus.FAILED,
        sentAt: new Date(),
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
// import {
//   NewsletterOwnerNotificationCategory,
//   NotificationType,
//   NotificationPriority,
//   NotificationStatus,
//   SystemNotificationCategory,
// } from '@prisma/client';

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
//       return { success: true, message: 'No subscribers found.' };
//     }

//     const userEmails = subscribers.map((s) => s.email);

//     // 2. Try to get user's custom notification template
//     let userTemplate = await db.newsletterOwnerNotification.findFirst({
//       where: {
//         userId: post.authorId,
//         category: NewsletterOwnerNotificationCategory.NEW_BLOG,
//         type: NotificationType.EMAIL,
//       },
//       orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
//     });

//     // 3. If no user template, check for system template
//     let systemTemplate = !userTemplate
//       ? await db.systemNotification.findFirst({
//           where: {
//             category: SystemNotificationCategory.NEW_BLOG,
//             type: NotificationType.EMAIL,
//           },
//         })
//       : null;

//     // 4. If no template exists, create system and user templates
//     if (!userTemplate && !systemTemplate) {
//       const defaultHtml = newPostNotificationTemplate({
//         author: '[Author]',
//         title: '[Title]',
//         subtitle: '[Subtitle]',
//         excerpt: '[Excerpt]',
//         featuredImage: '[FeaturedImage]',
//         url: '[Url]',
//         platform: '[Platform]', 
//         HostPlatformUrl: '[HostPlatformUrl]',
//         HostPlatform: '[HostPlatform]',
//       });

//       systemTemplate = await db.systemNotification.create({
//         data: {
//           type: NotificationType.EMAIL,
//           category: SystemNotificationCategory.NEW_BLOG,
//           priority: NotificationPriority.LOW,
//           title: 'New Blog Post: [Title]',
//           content: {
//             subject: 'New Post: [Title]',
//             html: defaultHtml,
//             text: 'A new blog post is live: [Title] by [Author]',
//           },
//           htmlContent: defaultHtml,
//           textContent: 'A new blog post is live: [Title] by [Author]',
//           status: NotificationStatus.DRAFT,
          
//         },
//       });

//       userTemplate = await db.newsletterOwnerNotification.create({
//         data: {
//           userId: post.authorId,
//           type: NotificationType.EMAIL,
//           category: NewsletterOwnerNotificationCategory.NEW_BLOG,
//           priority: NotificationPriority.LOW,
//           title: systemTemplate.title,
//           content: systemTemplate.content || defaultHtml,
//           status: NotificationStatus.DRAFT,
//           textContent: systemTemplate.textContent,
//           htmlContent: systemTemplate.htmlContent,
//         },
//       });
//     }

//     // 5. Determine the active template
//     const activeTemplate = userTemplate || systemTemplate;
//     if (!activeTemplate) throw new Error('No notification template available');

//     const templateContent = {
//       subject: activeTemplate.title,
//       html: activeTemplate.htmlContent,
//       text: activeTemplate.textContent,
//     };

//     // 6. Personalize template content
//     const personalizedContent = {
//       ...templateContent,
//       html: (templateContent.html || '')
//         .replace(/\[Author\]/g, post.author)
//         .replace(/\[Title\]/g, post.title)
//         .replace(/\[Subtitle\]/g, post.subtitle || '')
//         .replace(/\[Excerpt\]/g, post.excerpt || '')
//         .replace(/\[Url\]/g, `${process.env.NEXT_PUBLIC_WEBSITE_URL}/blog/${post.slug}`)
//         .replace(/\[Platform\]/g, fromApplication)
//         .replace(/\[HostPlatformUrl\]/g, `${process.env.NEXT_PUBLIC_WEBSITE_URL}/blog`)
//         .replace(/\[HostPlatform\]/g, `${process.env.NEXT_PUBLIC_SOURCE}`),

//       text: (templateContent.text || '')
//         .replace(/\[Author\]/g, post.author)
//         .replace(/\[Title\]/g, post.title),

//       subject: (templateContent.subject || `New Blog Post: ${post.title}`).replace(/\[Title\]/g, post.title),
//     };

//     // 7. Check if notification record already exists for this post & user to avoid duplicates
//     let notification = await db.newsletterOwnerNotification.findFirst({
//       where: {
//         userId: post.authorId,
//         category: NewsletterOwnerNotificationCategory.NEW_BLOG,
//         type: NotificationType.EMAIL,
//         priority: NotificationPriority.LOW,
//       },
//     });

//     if (notification) {
//       // Update existing notification with personalized content & reset status if needed
//       notification = await db.newsletterOwnerNotification.update({
//         where: { id: notification.id },
//         data: {
//           title: personalizedContent.subject,
//           content: personalizedContent,
//           textContent: personalizedContent.text,
//           htmlContent: personalizedContent.html,
//           status: NotificationStatus.DRAFT,
//           priority: NotificationPriority.LOW,
//           metadata: {
//             postId: post.id,
//             postSlug: post.slug,
//             postTitle: post.title,
//             campaignId,
//             totalRecipients: userEmails.length,
//           },
//           integrationId,

//         },
//       });
//     } else {
//       // Create notification if none exists
//       notification = await db.newsletterOwnerNotification.create({
//         data: {
//           type: NotificationType.EMAIL,
//           category: NewsletterOwnerNotificationCategory.NEW_BLOG,
//           title: personalizedContent.subject,
//           content: personalizedContent,
//           textContent: personalizedContent.text,
//           htmlContent: personalizedContent.html,
//           status: NotificationStatus.DRAFT,
//           priority: NotificationPriority.LOW,
//           userId: post.authorId,
//           recipient: 0,
//           metadata: {
//             postId: post.id,
//             postSlug: post.slug,
//             postTitle: post.title,
//             campaignId,
//             totalRecipients: userEmails.length,
//           },
//           integrationId,
//           emailsSent: 0,
          
//         },
//       });
//     }

//     // 8. Send bulk email
//     const result = await sendNotificationEmail({
//       userEmail: userEmails,
//       subject: personalizedContent.subject,
//       content: personalizedContent.html,
//       emailId: notification.id,
//       newsLetterOwnerId: post.authorId,
//       contentJson: JSON.stringify(personalizedContent),
//       adminEmail,
//       fromApplication,
//       trackOpens: true,
//       trackClicks: true,
//       enableUnsubscribe: true,
//       isBulk: true,
//     });

//     // 9. Update notification status
//     await db.newsletterOwnerNotification.update({
//       where: { id: notification.id },
//       data: {
//         status: result.success ? NotificationStatus.SENT : NotificationStatus.FAILED,
//         sentAt: new Date(),
//         recipients: result.success ? userEmails.length : 0,
        
//         ...(result.messageId && {
//           metadata: {
//             ...(typeof notification.metadata === 'object' && notification.metadata !== null
//               ? notification.metadata
//               : {}),
//             messageId: result.messageId,
//           },
//         }),
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
