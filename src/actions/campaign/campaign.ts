// actions/campaign.actions.ts
"use server";

import { db } from "@/shared/libs/database";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";


export async function updateCampaign(
  id: string,
  data: Partial<{ name: string; description: string; type: string }>
) {
 const user = await currentUser();
    if (!user) {
     return { success: false, error: "You must be logged in to update campaign" };
    }
    const userId = user.id;
  try {
    const updated = await db.campaign.update({
      where: { id, userId: userId  },
      data,
    });
    revalidatePath('/dashboard/campaigns')
    return { success: true, data: updated };
  } catch (error) {
    console.error("Error updating campaign:", error);
    return { success: false, error: "Failed to update campaign" };
  }
}


export async function updateCampaignStatus(
  id: string,
  status: "ACTIVE" | "INACTIVE"
) {
    const user = await currentUser();
    if (!user) {
     return { success: false, error: "You must be logged in to update campaign" };
    }
    const userId = user.id;
  try {
    const updated = await db.campaign.update({
      where: { id, userId: userId   },
      data: { status },
    });
    revalidatePath('/dashboard/campaigns')
    return { success: true, data: updated };
  } catch (error) {
    console.error("Error updating campaign status:", error);
    return { success: false, error: "Failed to update campaign status" };
  }
}
