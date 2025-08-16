"use server";

import { decrementCampaignUsage } from "@/lib/checkAndUpdateUsage";
import { db } from "@/shared/libs/database";
import {  currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function deleteCampaign(id: string) {
 const user = await currentUser();
  if (!user) {
    return { success: false, error: "You must be logged in to delete a blog post" };
    
  }

  const userId = user.id;

//   const month = getCurrentMonthKey();

  try {
    // Delete the campaign
    await db.campaign.delete({
      where: { id, userId: userId },
    });

    // Decrement campaign usage for the user
    await decrementCampaignUsage(userId, 1);

        // Revalidate affected paths
        revalidatePath("/dashboard/campaigns");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete campaign:", error);
    throw new Error("Could not delete campaign");
  }
}
