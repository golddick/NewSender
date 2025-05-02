"use server";

import Subscriber from "@/models/subscriber.model";
import { generateAnalyticsData } from "@/shared/utils/analytics.generator";
import { currentUser } from "@clerk/nextjs/server";

export const subscribersAnalytics = async () => {
  try {
     const user = await currentUser();

     if (!user) {
        throw new Error("User not found");
      }
      
    const userId = user.id;

    const subscribers = await generateAnalyticsData(Subscriber, userId );
    return subscribers;
  } catch (error) {
    console.log(error);
  }
};
