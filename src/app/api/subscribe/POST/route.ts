
import { NextRequest, NextResponse } from "next/server";
import { verifyApiKey } from "@/lib/sharedApi/auth";
import { SubscriptionStatus } from "@prisma/client";
import { addSubscriber } from "@/actions/subscriber/add.subscriber";


export async function POST(req: NextRequest) {
  try {
    const apiKey = req.headers.get("TheNews-api-key");
    const { userId, error } = await verifyApiKey(apiKey);

    if (error || !userId) {
      return NextResponse.json(
        { error: error || "Unauthorized", code: "INVALID_API_KEY" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      email,
      name,
      integrationId,
      campaignId,
      source = "API",
      pageUrl,
    } = body;

    if (!email || !integrationId) {
      return NextResponse.json(
        { error: "Email and integrationId are required", code: "MISSING_FIELDS" },
        { status: 400 }
      );
    }

    const result = await addSubscriber({
      email,
      name,
      campaignId,
      source,
      status: SubscriptionStatus.Subscribed,
      pageUrl,
    });

    if (result.error) {
      return NextResponse.json(
        { error: result.error, code: "SUBSCRIBE_FAILED" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: true, subscriber: result.subscriber },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("[SUBSCRIBER_API_ERROR]", err);
    return NextResponse.json(
      {
        error: err?.message || "An unexpected error occurred.",
        code: "SERVER_ERROR",
      },
      { status: 500 }
    );
  }
}
