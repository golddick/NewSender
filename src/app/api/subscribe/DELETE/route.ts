import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/shared/libs/db";
import Subscriber from "@/models/subscriber.model";
import Membership from "@/models/membership.model";
import { verifyApiKey } from "@/lib/sharedApi/auth";

export async function DELETE(req: NextRequest) {
  try {
    const apiKey = req.headers.get("TheNews-api-key");
    const { userId, error } = await verifyApiKey(apiKey);
    if (error) return error;

    await connectDb();

    const membership = await Membership.findOne({ userId });
    if (!membership || membership.subscriptionStatus !== "active") {
      return NextResponse.json(
        { error: "Access denied. Active subscription required.", code: "SUBSCRIPTION_REQUIRED" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const subscriberId = searchParams.get("subscriberId");

    if (!subscriberId) {
      return NextResponse.json(
        { error: "Missing subscriber ID.", code: "MISSING_SUBSCRIBER_ID" },
        { status: 400 }
      );
    }

    const deleted = await Subscriber.findOneAndDelete({
      _id: subscriberId,
      newsLetterOwnerId: userId,
    });

    if (!deleted) {
      return NextResponse.json(
        { error: "Subscriber not found.", code: "SUBSCRIBER_NOT_FOUND" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Subscriber deleted successfully." },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Delete Subscriber Error:", err);
    return NextResponse.json(
      {
        error: err.message || "Failed to delete subscriber.",
        code: err.code || "DELETE_ERROR",
      },
      { status: 500 }
    );
  }
}
