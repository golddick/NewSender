




// app/api/subscriber/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyApiKey } from "@/lib/sharedApi/auth";
import { SubscriptionStatus } from "@prisma/client";
import { addSubscriber } from "@/actions/subscriber/add.subscriber";
import { db } from "@/shared/libs/database";
import { z } from "zod";
import { rateLimiter } from "@/lib/rateLimiter";

// ✅ Input validation schema
const subscriberSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().optional(),
  campaignId: z.string().uuid("Invalid campaign ID").optional(),
  source: z.string().default("API"),
  pageUrl: z.string().url("Invalid URL").optional(),
});

export async function POST(req: NextRequest) {
  try {
    // ✅ Validate API key
    const apiKey = req.headers.get("TheNews-api-key");
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing API key", code: "NO_API_KEY" },
        { status: 401 }
      );
    }

    const { userId, error } = await verifyApiKey(apiKey);
    if (error || !userId) {
      return NextResponse.json(
        { error: error || "Unauthorized", code: "INVALID_API_KEY" },
        { status: 403 }
      );
    }

    // ✅ Call shared rate limiter
    const { success, limit, remaining, reset } = await rateLimiter.limit(apiKey);

    if (!success) {
      const res = NextResponse.json(
        {
          error: "Rate limit exceeded",
          code: "RATE_LIMITED",
        },
        { status: 429 }
      );

      // ✅ Add standard headers
      res.headers.set("X-RateLimit-Limit", limit.toString());
      res.headers.set("X-RateLimit-Remaining", remaining.toString());
      res.headers.set("X-RateLimit-Reset", reset.toString());

      return res;
    }

    // ✅ Check subscription validity
    const membership = await db.membership.findUnique({
      where: { userId },
      select: { plan: true, currentPeriodEnd: true },
    });

    if (!membership) {
      return NextResponse.json(
        { error: "No active subscription found", code: "NO_SUBSCRIPTION" },
        { status: 403 }
      );
    }

    if (
      membership.plan === "FREE" ||
      (membership.currentPeriodEnd && membership.currentPeriodEnd < new Date())
    ) {
      return NextResponse.json(
        {
          error: "Subscription expired or plan restricted",
          code: "SUBSCRIPTION_INVALID",
        },
        { status: 403 }
      );
    }

    // ✅ Parse and validate request body
    const body = await req.json();
    const parsed = subscriberSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.format(), code: "VALIDATION_ERROR" },
        { status: 400 }
      );
    }

    const { email, name, campaignId, source, pageUrl } = parsed.data;

    // ✅ Add subscriber
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

    // ✅ Success response with rate-limit headers
    const res = NextResponse.json(
      { success: true, subscriber: result.subscriber },
      { status: 201 }
    );
    res.headers.set("X-RateLimit-Limit", limit.toString());
    res.headers.set("X-RateLimit-Remaining", remaining.toString());
    res.headers.set("X-RateLimit-Reset", reset.toString());

    return res;
  } catch (err: any) {
    if (process.env.NODE_ENV === "development") {
      console.error("[SUBSCRIBER_API_ERROR]", err);
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        details:
          process.env.NODE_ENV === "development" ? err.message : undefined,
        code: "SERVER_ERROR",
      },
      { status: 500 }
    );
  }
}
