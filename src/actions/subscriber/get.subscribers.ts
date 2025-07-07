'use server'

import { db } from '@/shared/libs/database'
import { currentUser } from '@clerk/nextjs/server'

export const getSubscribersByIntegration = async ({
  integrationId,
  ownerId,
  campaign

}: {
  integrationId: string
  ownerId: string
  campaign: string
}) => {
  try {
    if (!integrationId || !ownerId || !campaign) {
      return { error: 'Missing integration or owner ID' }
    }

    const subscribers = await db.subscriber.findMany({
      where: {
        integrationId,
        newsLetterOwnerId: ownerId,
        status: 'Subscribed',
        campaignId: campaign,
      },
      select: {
        email: true,
        name: true,
        createdAt: true,
        campaign: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    console.log(subscribers, 'Subscribers fetched by integration')

    return { success: true, subscribers }
  } catch (err: any) {
    console.error('[GET_SUBSCRIBERS_BY_INTEGRATION]', err)
    return {
      success: false,
      error: err.message || 'Failed to load subscribers',
    }
  }
}




export const getSubscribers = async () => {
  try {
    const user = await currentUser()
    if (!user) {
      return { error: 'Unauthorized', subscribers: null }
    }

    const subscribers = await db.subscriber.findMany({
      where: {
        newsLetterOwnerId: user.id,
      },
      include: {
        campaign: {
          select: {
            id: true,
            name: true,
            trigger: true,
          },
        },
        integration: {
          select: {
            id: true,
            name: true,
            logo: true,
            url: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return { subscribers, error: null }
  } catch (error) {
    console.error('[GET_SUBSCRIBERS_ERROR]', error)
    return { 
      error: error instanceof Error ? error.message : 'Failed to fetch subscribers',
      subscribers: null 
    }
  }
}