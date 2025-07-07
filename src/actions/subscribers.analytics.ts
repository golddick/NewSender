'use server';

import { generateAnalyticsData } from '@/shared/utils/analytics.generator';
import { currentUser } from '@clerk/nextjs/server';

export const subscribersAnalytics = async () => {
  try {
    const user = await currentUser();

    if (!user) {
      throw new Error('User not found');
    }

    const userId = user.id;

    // Generate analytics using Prisma (no need to pass model)
    const subscribers = await generateAnalyticsData(userId);


    return subscribers;
  } catch (error) {
    console.error('Subscribers analytics error:', error);
    throw new Error('Failed to fetch subscriber analytics');
  }
};