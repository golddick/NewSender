// app/actions/subscriber/add-subscriber.ts
'use server'

import { db } from '@/shared/libs/database'
import { sendCampaignConfirmationEmail } from '../email/sendCampaignConfirmation'
import { validateEmail } from '@/shared/utils/ZeroBounceApi'
import { checkUsageLimit, incrementUsage } from '@/lib/checkAndUpdateUsage'
import { currentUser } from '@clerk/nextjs/server'
import { SubscriptionStatus } from '@prisma/client'


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
  integrationId: string
  campaignId?: string
  source: string
  status: SubscriptionStatus
  pageUrl?: string
}) => {
  try {
    const user = await currentUser()
    if (!user) return { error: 'Unauthorized' }
    const ownerId = user.id

    // Validate email format
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return { error: 'Invalid email address' }
    }

    // Check for existing subscriber
    const existing = await db.subscriber.findFirst({
      where: {
        email,
        newsLetterOwnerId: ownerId,
        integrationId,
      },
    })
    if (existing) return { error: 'Subscriber already exists' }

    // Validate email with ZeroBounce
    const validation = await validateEmail({ email })
    if (validation.status === 'invalid') {
      return { error: 'Invalid email address' }
    }

    // Check usage limits
    const usageCheck = await checkUsageLimit(ownerId, 'subscribersAdded')
    if (!usageCheck.success) return { error: usageCheck.message }

    // Get campaign and integration
    const [campaign, integration] = await Promise.all([
      db.campaign.findUnique({ where: { id: campaignId } }),
      db.integration.findUnique({ where: { id: integrationId } }),
    ])

    if (!campaign || !integration) {
      return { error: 'Campaign or integration not found' }
    }

    // Create subscriber
    const subscriber = await db.subscriber.create({
      data: {
        email,
        name,
        status,
        source,
        pageUrl,
        newsLetterOwnerId: ownerId,
        campaignId,
        integrationId,
      },
    })

    // Update stats
    // await db.campaign.update({
    //   where: { id: campaignId },
    //   data: { emailsSent: { increment: 1 } },
    // })

    await db.integration.update({
      where: { id: integrationId },
      data: { subscribers: { increment: 1 } },
    })

    await incrementUsage(ownerId, 'subscribersAdded')

    // Find welcome email template
    const emailTemplate = await db.email.findFirst({
      where: {
        campaignId,
        integrationId,
        emailType: 'automated',
      },
      orderBy: { updatedAt: 'desc' },
    })

    // if (!emailTemplate) {
    //       return { error: 'Campaign or integration not found' }
    // }

    // Send confirmation email if template exists
    if (emailTemplate) {
      await sendCampaignConfirmationEmail({
        userEmail: email,
        campaign: campaign.name,
        integration: integration.name,
        newsLetterOwnerId: ownerId,
        emailTemplateId: emailTemplate.id,
        adminEmail: user.emailAddresses[0]?.emailAddress || '',
        fromApplication: integration.name,
      })
    }

    return { success: true, subscriber }
  } catch (error) {
    console.error('[ADD_SUBSCRIBER_ERROR]', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to add subscriber',
    }
  }
}