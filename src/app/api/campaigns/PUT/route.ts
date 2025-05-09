// src/app/api/campaigns/PUT/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/shared/libs/db";
import { verifyApiKey } from "@/lib/sharedApi/auth"; // Assuming you have an API key verification utility
import Campaign from "@/models/newsLetterCampaign.model";

export async function PUT(req: NextRequest) {
  try {
    // Verify API key
    const apiKey = req.headers.get("TheNews-api-key");
    const { userId, error } = await verifyApiKey(apiKey);
    if (error) return NextResponse.json({ error }, { status: 403 });

    // Parse request data
    const { campaignId, title, description, startDate, endDate, status } = await req.json();

    if (!campaignId || !title || !description) {
      return NextResponse.json({ error: "Campaign ID, title, and description are required." }, { status: 400 });
    }

    // Connect to the DB
    await connectDb();

    // Find the campaign
    const campaign = await Campaign.findOne({ _id: campaignId, createdBy: userId });
    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found or you do not have permission to update it." }, { status: 404 });
    }

    // Update the campaign
    campaign.title = title;
    campaign.description = description;
    campaign.startDate = startDate;
    campaign.endDate = endDate;
    campaign.status = status || campaign.status;

    await campaign.save();

    return NextResponse.json({ data: campaign }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred while updating the campaign." }, { status: 500 });
  }
}
