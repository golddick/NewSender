'use server'

import { SubscriberWithCampaign } from '@/app/configs/types';
import { db } from '@/shared/libs/database'
import { currentUser } from '@clerk/nextjs/server'


// export const getSubscribersByIntegration = async ({
//   integrationId,
//   ownerId,
//   campaign
// }: {
//   integrationId: string;
//   ownerId: string;
//   campaign?: string;
// }): Promise<{
//   success: boolean;
//   subscribers?: SubscriberWithCampaign[];
//   error?: string;
// }> => {
//   // Validate required parameters
//   if (!integrationId || !ownerId) {
//     return { 
//       success: false, 
//       error: 'Missing integration or owner ID' 
//     };
//   }

//   try {
//     // Build the where clause dynamically
//     const whereClause: any = {
//       integrationId,
//       newsLetterOwnerId: ownerId,
//       status: 'Subscribed'
//     };

//     // Only add campaignId to query if provided
//     if (campaign) {
//       whereClause.campaignId = campaign;
//     }

//     // Execute the query
//     const subscribers = await db.subscriber.findMany({
//       where: whereClause,
//       select: {
//         email: true,
//         name: true,
//         createdAt: true,
//         campaign: {
//           select: {
//             id: true,
//             name: true,
//           },
//         },
//       },
//       orderBy: {
//         createdAt: 'desc' // Most recent subscribers first
//       },
//     });

//     return { 
//       success: true, 
//       subscribers 
//     };
//   } catch (err) {
//     console.error('[GET_SUBSCRIBERS_BY_INTEGRATION]', err);
    
//     // Return more specific error messages based on error type
//     const errorMessage = err instanceof Error 
//       ? err.message 
//       : 'Failed to load subscribers';
    
//     return {
//       success: false,
//       error: errorMessage
//     };
//   }
// };

// types.ts





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