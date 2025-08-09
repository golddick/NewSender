// app/actions/getCampaigns.ts
'use server';

import { db } from '@/shared/libs/database';
import { currentUser } from '@clerk/nextjs/server'; // or your auth logic

export async function getLogUserCampaigns() {
  const user = await currentUser();
  if (!user) {
    throw new Error('Unauthorized');
  }

  try {
    const campaigns = await db.campaign.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        emails: true,
      },
    });

    return campaigns;
  } catch (error) {
    console.error('Failed to get campaigns:', error);
    throw new Error('Failed to fetch campaigns');
  }
}















export async function getCampaignById(campaignId: string) {
  const user = await currentUser();
  if (!user) {
    throw new Error('Unauthorized');
  }

  try {
    const campaign = await db.campaign.findFirst({
      where: {
        id: campaignId,
        userId: user.id, // make sure it's the logged-in user's campaign
      },
      include: {
        emails: true, // include related emails if needed
      },
    });

    if (!campaign) {
      throw new Error('Campaign not found');
    }

    return campaign;
  } catch (error) {
    console.error('Failed to get campaign:', error);
    throw new Error('Failed to fetch campaign');
  }
}
