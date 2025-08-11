'use server'

import { SubscriberWithCampaign } from '@/app/configs/types';
import { db } from '@/shared/libs/database'
import { currentUser } from '@clerk/nextjs/server'






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