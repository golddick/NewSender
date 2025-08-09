// src/app/api/campaigns/PUT/route.ts

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/shared/libs/database";
import { verifyApiKey } from "@/lib/sharedApi/auth";

export async function PUT(req: NextRequest) {
  try {
    // ✅ Verify API key
    const apiKey = req.headers.get("TheNews-api-key");
    const { userId, error } = await verifyApiKey(apiKey);

    if (error) {
      return NextResponse.json({ error }, { status: 403 });
    }

    // ✅ Parse request body
    const { campaignId, name, description, startDate, endDate, status } = await req.json();

    // ✅ Validate required fields
    if (!campaignId || !name ) {
      return NextResponse.json(
        { error: "campaignId and name are required." },
        { status: 400 }
      );
    }

    // ✅ Find and validate the campaign belongs to the user
    const campaign = await db.campaign.findFirst({
      where: {
        id: campaignId,
        userId: userId,
      },
    });

    if (!campaign) {
      return NextResponse.json(
        { error: "Campaign not found or you do not have permission to update it." },
        { status: 404 }
      );
    }

    // ✅ Update the campaign using Prisma
    const updatedCampaign = await db.campaign.update({
      where: { id: campaignId },
      data: {
        name,
        description,
        status: status ?? campaign.status,
        updatedAt: new Date(),
        // If startDate or endDate is optional:
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate && { endDate: new Date(endDate) }),
      },
    });

    return NextResponse.json({ data: updatedCampaign }, { status: 200 });

  } catch (error: any) {
    console.error("Campaign update error:", error);
    return NextResponse.json(
      { error: error.message || "An error occurred while updating the campaign." },
      { status: 500 }
    );
  }
}
