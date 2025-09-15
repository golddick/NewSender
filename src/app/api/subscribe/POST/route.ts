// app/api/subscriber/route.ts
import { NextRequest } from "next/server";
import { verifyApiKey } from "@/lib/sharedApi/auth";
import { SubscriptionStatus } from "@prisma/client";
import { addSubscriber } from "@/actions/subscriber/add.subscriber";
import { db } from "@/shared/libs/database";
import { z } from "zod";
import { rateLimiter } from "@/lib/rateLimiter";
import { withCors, corsOptions } from "@/lib/cors";

const subscriberSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().optional(),
  campaignId: z.string().uuid("Invalid campaign ID").optional(),
  source: z.string().default("API"),
  pageUrl: z.string().url("Invalid URL").optional(),
});

export async function OPTIONS() {
  return corsOptions();
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = req.headers.get("xypher-api-key");
    if (!apiKey) return withCors({ error: "Missing API key", code: "NO_API_KEY" }, 401);

    const { userId, error } = await verifyApiKey(apiKey);
    if (error || !userId) return withCors({ error: error || "Unauthorized", code: "INVALID_API_KEY" }, 403);

    // Rate limiting
    const { success, limit, remaining, reset } = await rateLimiter.limit(apiKey);
    if (!success) {
      const res = withCors({ error: "Rate limit exceeded", code: "RATE_LIMITED" }, 429);
      res.headers.set("X-RateLimit-Limit", limit.toString());
      res.headers.set("X-RateLimit-Remaining", remaining.toString());
      res.headers.set("X-RateLimit-Reset", reset.toString());
      return res;
    }

    // Check subscription
    const membership = await db.membership.findUnique({ where: { userId } });
    if (!membership || membership.subscriptionStatus !== "active") {
      return withCors({ error: "No active subscription", code: "SUBSCRIPTION_INVALID" }, 403);
    }

    // Validate request body
    const body = await req.json();
    const parsed = subscriberSchema.safeParse(body);
    if (!parsed.success) return withCors({ error: parsed.error.format(), code: "VALIDATION_ERROR" }, 400);

    const { email, name, campaignId, source, pageUrl } = parsed.data;

    const result = await addSubscriber({
      email,
      name,
      campaignId,
      source,
      status: SubscriptionStatus.Subscribed,
      pageUrl,
    });

    if (result.error) return withCors({ error: result.error, code: "SUBSCRIBE_FAILED" }, 400);

    const res = withCors({ success: true, subscriber: result.subscriber }, 201);
    res.headers.set("X-RateLimit-Limit", limit.toString());
    res.headers.set("X-RateLimit-Remaining", remaining.toString());
    res.headers.set("X-RateLimit-Reset", reset.toString());
    return res;
  } catch (err: any) {
    console.error("[SUBSCRIBER_API_ERROR]", err);
    return withCors({ error: "Internal server error", code: "SERVER_ERROR" }, 500);
  }
}
