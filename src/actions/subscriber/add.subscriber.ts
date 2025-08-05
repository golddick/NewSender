'use server'

import { db } from '@/shared/libs/database'
import { sendCampaignConfirmationEmail } from '../email/sendCampaignConfirmation'
import { validateEmail } from '@/shared/utils/ZeroBounceApi'
import { checkUsageLimit, incrementUsage } from '@/lib/checkAndUpdateUsage'
import { currentUser } from '@clerk/nextjs/server'
import {
  SubscriptionStatus,
  NewsletterOwnerNotificationCategory,
  NotificationPriority,
  NotificationType,
  NotificationStatus,
  SystemNotificationCategory,
} from '@prisma/client'
import { getWelcomeTemplate } from '@/shared/libs/email-templates/new-subscriber'

export const addSubscriber = async ({
  email,
  name,
  integrationId,
  campaignId,
  source,
  status,
  pageUrl,
}: {
  email: string
  name?: string
  integrationId?: string | null
  campaignId?: string | null
  source: string
  status: SubscriptionStatus
  pageUrl?: string
}) => {
  try {
    const user = await currentUser()
    if (!user) return { error: 'Unauthorized' }

    const ownerId = user.id
    const adminEmail = user.emailAddresses[0]?.emailAddress || ''

    // 1. Validate email format
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return { error: 'Invalid email address' }
    }

    // 2. Check if subscriber already exists
    const existing = await db.subscriber.findFirst({
      where: {
        email,
        newsLetterOwnerId: ownerId,
        ...(integrationId ? { integrationId } : {}),
      },
    })
    if (existing) return { error: 'Subscriber already exists' }

    // 3. Get platform name and URL
    const owner = await db.membership.findUnique({ where: { userId: ownerId } })
    const platformName = owner?.organization || owner?.userName || 'TheNews'
    const platformUrl = owner?.organizationUrl || 'https://thenews.africa/'

    // 4. Validate email with ZeroBounce
    const validation = await validateEmail({ email })
    if (validation.status === 'invalid') {
      return { error: 'Invalid email address' }
    }

    // 5. Check usage limits
    const usageCheck = await checkUsageLimit(ownerId, 'subscribersAdded')
    if (!usageCheck.success) return { error: usageCheck.message }

    // 6. Create new subscriber
    const subscriber = await db.subscriber.create({
      data: {
        email,
        name,
        status,
        source,
        pageUrl,
        newsLetterOwnerId: ownerId,
        ...(integrationId ? { integrationId } : {}),
        ...(campaignId ? { campaignId } : {}),
      },
    })

    // 7. Update integration subscriber count if integration exists
    let integration = null
    if (integrationId) {
      integration = await db.integration.update({
        where: { id: integrationId },
        data: { subscribers: { increment: 1 } },
      })
    }

    // 8. Fetch campaign if exists
    const campaign = campaignId
      ? await db.campaign.findUnique({ where: { id: campaignId } })
      : null

    // 9. Increment usage count
    await incrementUsage(ownerId, 'subscribersAdded')

    // 10. Get user template or system template
    let userTemplate = await db.newsletterOwnerNotification.findFirst({
      where: {
        userId: ownerId,
        category: NewsletterOwnerNotificationCategory.NEWSLETTER,
        type: NotificationType.EMAIL,
      },
    })

    let systemTemplate = !userTemplate
      ? await db.systemNotification.findFirst({
          where: {
            category: SystemNotificationCategory.NEWSLETTER,
            type: NotificationType.EMAIL,
          },
        })
      : null

    // 11. Create a default template if none exists
    if (!userTemplate && !systemTemplate) {
      const defaultTemplate = getWelcomeTemplate({
        name: '[Name]',
        email: '[Email]',
        platformName: '[Platform]',
        platformUrl,
      })

      systemTemplate = await db.systemNotification.create({
        data: {
          type: NotificationType.EMAIL,
          category: SystemNotificationCategory.NEWSLETTER,
          priority: NotificationPriority.LOW,
          title: defaultTemplate.title,
          content: defaultTemplate.content,
          status: NotificationStatus.DRAFT,
          textContent: defaultTemplate.content.text,
          htmlContent: defaultTemplate.content.html,
        },
      })

      userTemplate = await db.newsletterOwnerNotification.create({
        data: {
          userId: ownerId,
          type: NotificationType.EMAIL,
          category: NewsletterOwnerNotificationCategory.NEWSLETTER,
          priority: NotificationPriority.LOW,
          title: defaultTemplate.title,
          content: defaultTemplate.content,
          status: NotificationStatus.DRAFT,
          textContent: defaultTemplate.content.text,
          htmlContent: defaultTemplate.content.html,
          recipients: 0,
        },
      })
    }

    const activeTemplate = userTemplate || systemTemplate
    if (!activeTemplate) throw new Error('No email template available')

    // 12. Personalize content dynamically (DO NOT overwrite template in DB)
    const templateContent = {
      subject: activeTemplate.title,
      html: activeTemplate.htmlContent,
      text: activeTemplate.textContent,
    }

    const personalizedContent = {
      ...templateContent,
      html: templateContent.html
        ?.replace(/\[Name\]/g, name || '')
        .replace(/\[Email\]/g, email)
        .replace(/\[Platform\]/g, platformName),
      text: templateContent.text
        ?.replace(/\[Name\]/g, name || '')
        .replace(/\[Email\]/g, email)
        .replace(/\[Platform\]/g, platformName),
      subject: templateContent.subject
        ?.replace(/\[Name\]/g, name || '')
        .replace(/\[Platform\]/g, platformName),
    }

    // 13. Increment recipient count for the template
    await db.newsletterOwnerNotification.update({
      where: { id: activeTemplate.id },
      data: {
        metadata: {
          subscriberId: subscriber.id,
          subscriberEmail: subscriber.email,
          subscriberName: subscriber.name,
        },
      },
    })

    // 14. Send personalized confirmation email (no DB overwrite)
    await sendCampaignConfirmationEmail({
      userEmail: email,
      userName: name || '',
      campaign: campaign?.name || '',
      integration: integration?.name || '',
      newsLetterOwnerId: ownerId,
      emailTemplateId: activeTemplate.id,
      notificationTemplateContent: personalizedContent,
      adminEmail,
      fromApplication: platformName,
    })

    return { success: true, subscriber }
  } catch (error) {
    console.error('[ADD_SUBSCRIBER_ERROR]', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to add subscriber',
    }
  }
}













// 'use server'

// import { db } from '@/shared/libs/database'
// import { sendCampaignConfirmationEmail } from '../email/sendCampaignConfirmation'
// import { validateEmail } from '@/shared/utils/ZeroBounceApi'
// import { checkUsageLimit, incrementUsage } from '@/lib/checkAndUpdateUsage'
// import { currentUser } from '@clerk/nextjs/server'
// import {
//   SubscriptionStatus,
//   NewsletterOwnerNotificationCategory,
//   NotificationPriority,
//   NotificationType,
//   NotificationStatus,
//   SystemNotificationCategory,
// } from '@prisma/client'
// import { getWelcomeTemplate } from '@/shared/libs/email-templates/new-subscriber'

// export const addSubscriber = async ({
//   email,
//   name,
//   integrationId,
//   campaignId,
//   source,
//   status,
//   pageUrl,
// }: {
//   email: string
//   name?: string
//   integrationId?: string | null
//   campaignId?: string | null
//   source: string
//   status: SubscriptionStatus
//   pageUrl?: string
// }) => {
//   try {
//     const user = await currentUser()
//     if (!user) return { error: 'Unauthorized' }

//     const ownerId = user.id
//     const adminEmail = user.emailAddresses[0]?.emailAddress || ''

//     // 1. Validate email format
//     if (!email || !/\S+@\S+\.\S+/.test(email)) {
//       return { error: 'Invalid email address' }
//     }

//     // 2. Check if subscriber already exists
//     const existing = await db.subscriber.findFirst({
//       where: {
//         email,
//         newsLetterOwnerId: ownerId,
//         ...(integrationId ? { integrationId } : {}),
//       },
//     })
//     if (existing) return { error: 'Subscriber already exists' }

//     // 3. Get platform name and URL
//     const owner = await db.membership.findUnique({ where: { userId: ownerId } })
//     const platformName = owner?.organization || owner?.userName || 'TheNews'
//     const platformUrl = owner?.organizationUrl || 'https://thenews.africa/'

//     // 4. Validate email with ZeroBounce
//     const validation = await validateEmail({ email })
//     if (validation.status === 'invalid') {
//       return { error: 'Invalid email address' }
//     }

//     // 5. Check usage limits
//     const usageCheck = await checkUsageLimit(ownerId, 'subscribersAdded')
//     if (!usageCheck.success) return { error: usageCheck.message }

//     // 6. Create new subscriber
//     const subscriber = await db.subscriber.create({
//       data: {
//         email,
//         name,
//         status,
//         source,
//         pageUrl,
//         newsLetterOwnerId: ownerId,
//         ...(integrationId ? { integrationId } : {}),
//         ...(campaignId ? { campaignId } : {}),
//       },
//     })

//     // 7. Update integration subscriber count if integration exists
//     let integration = null
//     if (integrationId) {
//       integration = await db.integration.update({
//         where: { id: integrationId },
//         data: { subscribers: { increment: 1 } },
//       })
//     }

//     // 8. Fetch campaign if exists
//     const campaign = campaignId
//       ? await db.campaign.findUnique({ where: { id: campaignId } })
//       : null

//     // 9. Increment usage count
//     await incrementUsage(ownerId, 'subscribersAdded')

//     // 10. Get user custom notification template
//     let userTemplate = await db.newsletterOwnerNotification.findFirst({
//       where: {
//         userId: ownerId,
//         category: NewsletterOwnerNotificationCategory.NEWSLETTER,
//         type: NotificationType.EMAIL,
//         //  priority:NotificationPriority.HIGH
//       },
//       orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
//     })

//     // 11. Get system template if user template not found
//     let systemTemplate = !userTemplate
//       ? await db.systemNotification.findFirst({
//           where: {
//             category: SystemNotificationCategory.NEWSLETTER,
//             type: NotificationType.EMAIL,
//             // priority:NotificationPriority.HIGH
//           },
//         })
//       : null

//     // 12. Create a default template if none exists
//     if (!userTemplate && !systemTemplate) {
//       const defaultTemplate = getWelcomeTemplate({
//         name: '[Name]',
//         email: '[Email]',
//         platformName: '[Platform]',
//         platformUrl: platformUrl,
//       })

//       systemTemplate = await db.systemNotification.create({
//         data: {
//           type: NotificationType.EMAIL,
//           category: SystemNotificationCategory.NEWSLETTER,
//           priority: NotificationPriority.LOW,
//           title: defaultTemplate.title,
//           content: defaultTemplate.content,
//           status: NotificationStatus.DRAFT,
//           textContent: defaultTemplate.content.text,
//           htmlContent: defaultTemplate.content.html,
//         },
//       })

//       userTemplate = await db.newsletterOwnerNotification.create({
//         data: {
//           userId: ownerId,
//           type: NotificationType.EMAIL,
//           category: NewsletterOwnerNotificationCategory.NEWSLETTER,
//           priority: NotificationPriority.LOW,
//           title: defaultTemplate.title,
//           content: defaultTemplate.content,
//           status: NotificationStatus.DRAFT,
//           textContent: defaultTemplate.content.text,
//           htmlContent: defaultTemplate.content.html,
//         },
//       })
//     }

//     // 13. Determine active template
//     const activeTemplate = userTemplate || systemTemplate
//     if (!activeTemplate) throw new Error('No email template available')

//     // 14. Prepare template content
//     const templateContent = userTemplate
//       ? {
//           subject: userTemplate.title,
//           html: userTemplate.htmlContent,
//           text: userTemplate.textContent,
//         }
//       : {
//           subject: systemTemplate!.title,
//           html: systemTemplate!.htmlContent,
//           text: systemTemplate!.textContent,
//         }

//     // 15. Personalize email content with name, email & platform
//     const personalizedContent = {
//       ...templateContent,
//       html: templateContent.html
//         ?.replace(/\[Name\]/g, name || '')
//         .replace(/\[Email\]/g, email)
//         .replace(/\[Platform\]/g, platformName),
//       text: templateContent.text
//         ?.replace(/\[Name\]/g, name || '')
//         .replace(/\[Email\]/g, email)
//         .replace(/\[Platform\]/g, platformName),
//       subject: templateContent.subject
//         ?.replace(/\[Name\]/g, name || '')
//         .replace(/\[Platform\]/g, platformName),
//     }

//     // 16. Check if a welcome notification already exists
//     let notification = await db.newsletterOwnerNotification.findFirst({
//       where: {
//         userId: ownerId,
//         category: NewsletterOwnerNotificationCategory.NEWSLETTER,
//         type: NotificationType.EMAIL,
//         priority: NotificationPriority.LOW,
//       },
//     })

//     if (notification) {
//       // Update existing notification with new subscriber data & increment recipients
//       notification = await db.newsletterOwnerNotification.update({
//         where: { id: notification.id },
//         data: {
//           title: personalizedContent.subject,
//           content: personalizedContent,
//           textContent: personalizedContent.text,
//           htmlContent: personalizedContent.html,
//           status: NotificationStatus.DRAFT,
//           priority: NotificationPriority.LOW,
//           recipient: { increment: 1 },
//           metadata: {
//             subscriberId: subscriber.id,
//             subscriberEmail: subscriber.email,
//             subscriberName: subscriber.name,
//           },
//           integrationId,
//           emailsSent: 0,
//         },
//       })
//     } else {
//       // Create a new notification if none exists
//       notification = await db.newsletterOwnerNotification.create({
//         data: {
//           type: NotificationType.EMAIL,
//           category: NewsletterOwnerNotificationCategory.NEWSLETTER,
//           title: personalizedContent.subject,
//           content: personalizedContent,
//           textContent: personalizedContent.text,
//           htmlContent: personalizedContent.html,
//           status: NotificationStatus.DRAFT,
//           priority: NotificationPriority.LOW,
//           userId: ownerId,
//           recipient: 1,
//           metadata: {
//             subscriberId: subscriber.id,
//             subscriberEmail: subscriber.email,
//             subscriberName: subscriber.name,
//           },
//           integrationId,
//           emailsSent: 0,
//         },
//       })
//     }

//     // 17. Send confirmation email
//     await sendCampaignConfirmationEmail({
//       userEmail: email,
//       userName: name || '',
//       campaign: campaign?.name || '',
//       integration: integration?.name || '',
//       newsLetterOwnerId: ownerId,
//       emailTemplateId: activeTemplate.id,
//       notificationTemplateContent: personalizedContent,
//       adminEmail,
//       fromApplication: platformName,
//     })

//     return { success: true, subscriber }
//   } catch (error) {
//     console.error('[ADD_SUBSCRIBER_ERROR]', error)
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : 'Failed to add subscriber',
//     }
//   }
// }
