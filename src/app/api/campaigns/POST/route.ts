import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/shared/libs/db";
import { verifyApiKey } from "@/lib/sharedApi/auth";
import Campaign from "@/models/newsLetterCampaign.model";
import NewsLetterCategory from "@/models/newsLetterCategory.model"; // For category validation
import { checkUsageLimit, incrementUsage } from "@/lib/checkAndUpdateUsage"; // Custom functions to check and increment usage

export async function POST(req: NextRequest) {
  try {
    // ✅ Verify API key
    const apiKey = req.headers.get("TheNews-api-key");
    const { userId, error } = await verifyApiKey(apiKey);
    if (error) {
      return NextResponse.json({ error }, { status: 403 });
    }

    const { title, description, startDate, endDate, categoryId } = await req.json();

    // ✅ Validate input data
    if (!title || !description || !startDate || !categoryId) {
      return NextResponse.json(
        { error: "Title, description, startDate, endDate, and categoryId are required." },
        { status: 400 }
      );
    }

    // ✅ Connect to the DB
    await connectDb();

    // ✅ Check if category exists and belongs to the user
    const category = await NewsLetterCategory.findOne({
      _id: categoryId,
      newsLetterOwnerId: userId,
    });

    if (!category) {
      return NextResponse.json(
        { error: "Invalid or unauthorized category.", code: "INVALID_CATEGORY" },
        { status: 403 }
      );
    }

    // ✅ Check the user's monthly campaign limit before proceeding
    const usageCheck = await checkUsageLimit(userId, "campaignsCreated");
    if (!usageCheck.success) {
      return NextResponse.json(
        { error: usageCheck.message, code: "USAGE_LIMIT_EXCEEDED" },
        { status: 429 } // Too many requests
      );
    }

    // ✅ Create and save the campaign
    const campaign = await Campaign.create({
      name: title,
      description,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : undefined,
      newsLetterOwnerId: userId,
      status: "Active",
      emails: [], // Initially no emails added
      category: categoryId,
      subscribers: 0, // Set the initial subscriber count to 0
      emailsSent: 0, // Initially, no emails sent
    });

    // ✅ Increment the user's usage after successfully creating the campaign
    await incrementUsage(userId, "campaignsCreated");

    // ✅ Return the created campaign as a response
    return NextResponse.json({ data: campaign }, { status: 201 });

  } catch (error: any) {
    console.error("Error creating campaign:", error);
    return NextResponse.json(
      { error: error.message || "An error occurred while creating the campaign." },
      { status: 500 }
    );
  }
}
