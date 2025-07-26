import { NextRequest, NextResponse } from "next/server";
import { db } from "@/shared/libs/database";
import { verifyApiKey } from "@/lib/sharedApi/auth";
import { checkUsageLimit, incrementUsage } from "@/lib/checkAndUpdateUsage";

export async function POST(req: NextRequest) {
  try {
    const apiKey = req.headers.get("TheNews-api-key");
    const { userId, error } = await verifyApiKey(apiKey);

    if (error) {
      return NextResponse.json({ error }, { status: 403 });
    }

    const { name, description, integrationId, trigger = "manual" } = await req.json();

    // ✅ Validate required fields
    if (!name || !integrationId || !trigger) {
      return NextResponse.json(
        { error: "Name, integrationId, and trigger are required." },
        { status: 400 }
      );
    }

    // ✅ Check usage limit
    const usageCheck = await checkUsageLimit(userId, "campaignsCreated");
    if (!usageCheck.success) {
      return NextResponse.json(
        { error: usageCheck.message, code: "USAGE_LIMIT_EXCEEDED" },
        { status: 429 }
      );
    }

    // ✅ Check if integration exists and belongs to the user
    const integration = await db.integration.findFirst({
      where: {
        id: integrationId,
        userId,
      },
    });

    if (!integration) {
      return NextResponse.json(
        { error: "Invalid or unauthorized integration." },
        { status: 403 }
      );
    }

    // ✅ Create campaign
    const campaign = await db.campaign.create({
      data: {
        name,
        description,
        integrationId,
        userId,
        trigger,
        status: 'ACTIVE', // default, but explicit for clarity
        recipients: 0,
        emailsSent: 0,
      },
    });

    // ✅ Update usage count
    await incrementUsage(userId, "campaignsCreated");

    return NextResponse.json({ data: campaign }, { status: 201 });

  } catch (error: any) {
    console.error("Error creating campaign:", error);
    return NextResponse.json(
      { error: error.message || "An error occurred while creating the campaign." },
      { status: 500 }
    );
  }
}
