import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/shared/libs/db";
import { verifyApiKey } from "@/lib/sharedApi/auth";
import Campaign from "@/models/newsLetterCampaign.model"; // Assuming you have this model

export async function DELETE(req: NextRequest) {
  try {
    // ✅ Verify API key
    const apiKey = req.headers.get("TheNews-api-key");
    const { userId, error } = await verifyApiKey(apiKey);

    // If there is an error with API key validation
    if (error) return NextResponse.json({ error }, { status: 403 });

    // Extract campaignId from the request body
    const { campaignId } = await req.json();

    // ✅ Validate that campaignId is provided
    if (!campaignId) {
      return NextResponse.json({ error: "Campaign ID is required." }, { status: 400 });
    }

    // ✅ Connect to the database
    await connectDb();

    // ✅ Find the campaign that belongs to the user and delete it
    const campaign = await Campaign.findOneAndDelete({ _id: campaignId, newsLetterOwnerId: userId });

    // If the campaign is not found or user doesn't have permission
    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found or you do not have permission to delete it." }, { status: 404 });
    }

    // ✅ Return a success response
    return NextResponse.json({ success: true, message: "Campaign deleted successfully." }, { status: 200 });

  } catch (error) {
    console.error("Error deleting campaign:", error);
    return NextResponse.json({ error: "An error occurred while deleting the campaign." }, { status: 500 });
  }
}
