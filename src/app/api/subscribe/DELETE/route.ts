import { NextRequest, NextResponse } from "next/server";
import { db } from "@/shared/libs/database"; // Prisma client
import { verifyApiKey } from "@/lib/sharedApi/auth";

export async function DELETE(req: NextRequest) {
  try {
    const apiKey = req.headers.get("TheNews-api-key");
    const { userId, error } = await verifyApiKey(apiKey);
    if (error) return error;

    // ✅ Check active subscription
    const membership = await db.membership.findUnique({
      where: { userId },
    });

    if (!membership || membership.subscriptionStatus !== "active") {
      return NextResponse.json(
        { error: "Access denied. Active subscription required.", code: "SUBSCRIPTION_REQUIRED" },
        { status: 403 }
      );
    }

    // ✅ Extract subscriberId from query params
    const { searchParams } = new URL(req.url);
    const subscriberId = searchParams.get("subscriberId");

    if (!subscriberId) {
      return NextResponse.json(
        { error: "Missing subscriber ID.", code: "MISSING_SUBSCRIBER_ID" },
        { status: 400 }
      );
    }

    // ✅ Ensure the subscriber belongs to the user before deletion
    const deleted = await db.subscriber.deleteMany({
      where: {
        id: subscriberId,
        newsLetterOwnerId: userId,
      },
    });

    if (deleted.count === 0) {
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
