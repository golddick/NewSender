// // app/actions/addCampaign.ts
// 'use server';

// import { db } from '@/shared/libs/database';
// import { currentUser } from '@clerk/nextjs/server'; // or your auth logic

// export async function addCampaign({
//   name,
//   description,
//   type,
// }: {
//   name: string;
//   description?: string;
//   type?: string;
// }) {
//   const user = await currentUser();
//   if (!user) {
//     throw new Error('Unauthorized');
//   }

//   try {
//     const campaign = await db.campaign.create({
//       data: {
//         name,
//         description,
//         type,
//         userId: user.id,
//       },
//     });

//     return campaign;
//   } catch (error) {
//     console.error('Failed to add campaign:', error);
//     throw new Error('Failed to create campaign');
//   }
// }




// app/actions/addCampaign.ts
'use server';

import { db } from '@/shared/libs/database';
import { currentUser } from '@clerk/nextjs/server';
import { checkUsageLimit, incrementUsage } from '@/lib/checkAndUpdateUsage'; // ✅ Import usage tracking

interface AddCampaignProps {
  name: string;
  description?: string;
  type?: string;
}

export async function addCampaign({ name, description, type }: AddCampaignProps) {
  const user = await currentUser();
  if (!user) {
    throw new Error('Unauthorized');
  }

  // ✅ Step 1: Check campaign creation limit
  const limitCheck = await checkUsageLimit(user.id, 'campaignsCreated');
  if (!limitCheck.success) {
    throw new Error(limitCheck.message || 'Campaign creation limit reached');
  }

  try {
    // ✅ Step 2: Create campaign
    const campaign = await db.campaign.create({
      data: {
        name,
        description,
        type,
        userId: user.id,
      },
    });

    // ✅ Step 3: Increment campaign usage count
    await incrementUsage(user.id, 'campaignsCreated');

    return campaign;
  } catch (error) {
    console.error('Failed to add campaign:', error);
    throw new Error('Failed to create campaign');
  }
}
