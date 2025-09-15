// app/api/otp/verify/route.ts
import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/shared/libs/database";
import { verifyApiKey } from "@/lib/sharedApi/auth";
import { rateLimiter } from "@/lib/rateLimiter";
import { withCors, corsOptions } from "@/lib/cors";

const schema = z.object({
  email: z.string().email("Invalid email"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export async function OPTIONS(req: NextRequest) {
  return corsOptions(req);
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = req.headers.get("xypher-api-key");
    if (!apiKey) return withCors({ error: "Missing API key", code: "NO_API_KEY" },req, 401);

    const { userId, error } = await verifyApiKey(apiKey);
    if (error || !userId) return withCors({ error: error || "Unauthorized", code: "INVALID_API_KEY" },req, 403);

    
    const safeUserId = userId ?? undefined;

    const membership = await db.membership.findUnique({ where: { userId: safeUserId } });
    if (!membership || membership.subscriptionStatus !== "active") {
      return withCors({ error: "User does not have an active subscription", code: "SUBSCRIPTION_INVALID" },req, 403);
    }

    const { success, limit, remaining, reset } = await rateLimiter.limit(apiKey);
    if (!success) {
      const res = withCors({ error: "Rate limit exceeded", code: "RATE_LIMITED" },req, 429);
      res.headers.set("X-RateLimit-Limit", limit.toString());
      res.headers.set("X-RateLimit-Remaining", remaining.toString());
      res.headers.set("X-RateLimit-Reset", reset.toString());
      return res;
    }

    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return withCors({ error: parsed.error.format(), code: "VALIDATION_ERROR" },req, 400);

    const { email, otp } = parsed.data;
    const record = await db.thirdPartyOTP.findUnique({ where: { email } });
    if (!record) return withCors({ error: "No OTP found", code: "OTP_NOT_FOUND" },req, 404);

    if (record.expiresAt < new Date()) return withCors({ error: "OTP expired", code: "OTP_EXPIRED" },req, 400);
    if (record.code !== otp) return withCors({ error: "Invalid OTP", code: "INVALID_OTP" }, req, 400);

    await db.thirdPartyOTP.delete({ where: { email } });

    const res = withCors({ success: true, message: "OTP verified successfully" }, req, 200);
    res.headers.set("X-RateLimit-Limit", limit.toString());
    res.headers.set("X-RateLimit-Remaining", remaining.toString());
    res.headers.set("X-RateLimit-Reset", reset.toString());
    return res;
  } catch (err: any) {
    console.error("[OTP_VERIFY_ERROR]", err);
    return withCors({ error: "Internal server error", code: "SERVER_ERROR" }, req, 500);
  }
}
