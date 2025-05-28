// src/app/api/subscribers/POST/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/shared/libs/db";
import Subscriber from "@/models/subscriber.model";
import Campaign from "@/models/newsLetterCampaign.model";
import { validateEmail } from "@/shared/utils/ZeroBounceApi";
import { verifyApiKey } from "@/lib/sharedApi/auth";
import { checkUsageLimit, incrementUsage } from "@/lib/checkAndUpdateUsage";

export async function POST(req: NextRequest) {
  try {
    const apiKey = req.headers.get("TheNews-api-key");
    const { userId, error } = await verifyApiKey(apiKey);
    if (error) {
      return NextResponse.json({ error, code: "INVALID_API_KEY" }, { status: 403 });
    }

    const { email, source = "API", metadata, categoryId } = await req.json();

    if (!email || !categoryId) {
      return NextResponse.json(
        { error: "Email and categoryId are required.", code: "MISSING_FIELDS" },
        { status: 400 }
      );
    }

    await connectDb();

    // Check if subscriber already exists
    const existing = await Subscriber.findOne({ email, newsLetterOwnerId: userId, category: categoryId });
    if (existing) {
      return NextResponse.json(
        { error: "Subscriber already exists", code: "DUPLICATE_SUBSCRIBER" },
        { status: 409 }
      );
    }

    // Validate email
    const validation = await validateEmail({ email });
    if (validation.status === "invalid") {
      return NextResponse.json(
        { error: "Invalid email address", code: "INVALID_EMAIL" },
        { status: 422 }
      );
    }

    // Check usage limit
    const usageCheck = await checkUsageLimit(userId, "subscribersAdded");
    if (!usageCheck.success) {
      return NextResponse.json(
        { error: usageCheck.message, code: "USAGE_LIMIT_EXCEEDED" },
        { status: 429 }
      );
    }

    // Create subscriber
    const subscriber = await Subscriber.create({
      email,
      newsLetterOwnerId: userId,
      category: categoryId,
      source: `API - ${source}`,
      status: "Subscribed",
      metadata: {
        campaign: metadata?.campaign || null,
        pageUrl: metadata?.pageUrl || null,
        formId: metadata?.formId || null,
      },
    });

    // Update campaign subscriber count if campaign name was passed
    if (metadata?.campaign) {
      await Campaign.findOneAndUpdate(
        { name: metadata.campaign, newsLetterOwnerId: userId },
        {
          $inc: { subscribers: 1 },
          // Optionally store subscriber references:
          $addToSet: { subscriberIds: subscriber._id } // if you have this field
        }
      );
    }

    // Increment usage
    await incrementUsage(userId, "subscribersAdded");

    return NextResponse.json({ success: true, data: subscriber }, { status: 200 });
  } catch (err: any) { 
    console.error("Subscription Error:", err);
    return NextResponse.json(
      {
        error: err.message || "An error occurred while subscribing.",
        code: err.code || "SUBSCRIBE_ERROR",
      },
      { status: 500 }
    );
  }
}
