// app/actions/addCampaign.ts
'use server';

import { db } from '@/shared/libs/database';
import { currentUser } from '@clerk/nextjs/server'; // or your auth logic

export async function addCampaign({
  name,
  description,
  type,
}: {
  name: string;
  description?: string;
  type?: string;
}) {
  const user = await currentUser();
  if (!user) {
    throw new Error('Unauthorized');
  }

  try {
    const campaign = await db.campaign.create({
      data: {
        name,
        description,
        type,
        userId: user.id,
      },
    });

    return campaign;
  } catch (error) {
    console.error('Failed to add campaign:', error);
    throw new Error('Failed to create campaign');
  }
}
