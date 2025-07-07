import { NextRequest, NextResponse } from "next/server";
import { db } from "@/shared/libs/database";
import { verifyApiKey } from "@/lib/sharedApi/auth";

interface ErrorResponse {
  error: string;
  code: string;
  details?: string;
}

export async function DELETE(req: NextRequest): Promise<NextResponse> {
  try {
    // ✅ API Key Verification
    const apiKey = req.headers.get("TheNews-api-key");
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key required", code: "MISSING_API_KEY" },
        { status: 401 }
      );
    }

    const { userId, error: authError } = await verifyApiKey(apiKey);
    if (authError) {
      return authError;
    }

    // ✅ Subscription Check
    const membership = await db.membership.findUnique({
      where: { userId },
      select: { subscriptionStatus: true }
    });

    if (!membership || membership.subscriptionStatus !== "active") {
      return NextResponse.json(
        { 
          error: "Active subscription required", 
          code: "SUBSCRIPTION_REQUIRED",
          details: "Upgrade your plan to access this feature"
        },
        { status: 403 }
      );
    }

    // ✅ Subscriber ID Validation
    const { searchParams } = new URL(req.url);
    const subscriberId = searchParams.get("subscriberId");
    
    if (!subscriberId) {
      return NextResponse.json(
        { error: "Subscriber ID required", code: "MISSING_SUBSCRIBER_ID" },
        { status: 400 }
      );
    }

    // ✅ Subscriber Deletion with Ownership Check
    const deleteResult = await db.subscriber.deleteMany({
      where: {
        id: subscriberId,
        newsLetterOwnerId: userId,
      },
    });

    if (deleteResult.count === 0) {
      return NextResponse.json(
        { 
          error: "Subscriber not found or not owned by user",
          code: "SUBSCRIBER_NOT_FOUND"
        },
        { status: 404 }
      );
    }

    // ✅ Success Response
    return NextResponse.json(
      { 
        success: true,
        message: "Subscriber deleted successfully",
        data: { subscriberId }
      },
      { status: 200 }
    );

  } catch (error: unknown) {
    console.error("Subscriber deletion error:", error);
    
    // ✅ Type-safe error handling
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    const errorCode = error instanceof Error && "code" in error ? error.code : "INTERNAL_SERVER_ERROR";

    return NextResponse.json(
      {
        error: "Failed to delete subscriber",
        code: errorCode,
        details: errorMessage
      },
      { status: 500 }
    );
  }
}