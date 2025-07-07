// src/app/api/campaign/route.ts

import { NextRequest, NextResponse } from "next/server";
import { verifyApiKey } from "@/lib/sharedApi/auth";
import { db } from "@/shared/libs/database"; // Prisma instance

export async function DELETE(req: NextRequest) {
  try {
    // ✅ Step 1: Verify API key
    const apiKey = req.headers.get("TheNews-api-key");
    const { userId, error } = await verifyApiKey(apiKey);
    if (error) {
      return NextResponse.json({ error }, { status: 403 });
    }

    // ✅ Step 2: Get campaignId from request body
    const { campaignId } = await req.json();
    if (!campaignId) {
      return NextResponse.json({ error: "Campaign ID is required." }, { status: 400 });
    }

    // ✅ Step 3: Check if campaign exists and belongs to user
    const campaign = await db.campaign.findFirst({
      where: {
        id: campaignId,
        userId,
      },
    });

    if (!campaign) {
      return NextResponse.json(
        { error: "Campaign not found or you do not have permission to delete it." },
        { status: 404 }
      );
    }

    // ✅ Step 4: Delete the campaign
    await db.campaign.delete({
      where: { id: campaignId },
    });

    // ✅ Step 5: Return success response
    return NextResponse.json(
      { success: true, message: "Campaign deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting campaign:", error);
    return NextResponse.json(
      { error: "An error occurred while deleting the campaign." },
      { status: 500 }
    );
  }
}
