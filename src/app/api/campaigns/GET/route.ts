// src/app/api/campaigns/GET/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/shared/libs/db";
import { verifyApiKey } from "@/lib/sharedApi/auth";
import Campaign from "@/models/newsLetterCampaign.model";

export async function GET(req: NextRequest) {
  try {
    // 1. Verify API Key
    const apiKey = req.headers.get("TheNews-api-key");
    const { userId, error } = await verifyApiKey(apiKey);
    if (error) {
      return NextResponse.json({ error }, { status: 403 });
    }

    // 2. Connect to database
    await connectDb();

    // 3. Fetch campaigns for this newsletter owner
    const campaigns = await Campaign.find({ newsLetterOwnerId: userId }).select("-__v");

    return NextResponse.json({ success: true, data: campaigns }, { status: 200 });

  } catch (error: any) {
    console.error("Campaign fetch error:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching campaigns." },
      { status: 500 }
    );
  }
}
