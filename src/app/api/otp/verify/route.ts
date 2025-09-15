

// app/api/otp/verify/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/shared/libs/database";
import { verifyApiKey } from "@/lib/sharedApi/auth";
import { rateLimiter } from "@/lib/rateLimiter";

const verifySchema = z.object({
  email: z.string().email("Invalid email"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export async function POST(req: NextRequest) {
  try {
    // ✅ 1. API key check
    const apiKey = req.headers.get("xypher-api-key");
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

    // ✅ 2. Rate limit
    const { success, limit, remaining, reset } = await rateLimiter.limit(apiKey);
    if (!success) {
      const res = NextResponse.json(
        { error: "Rate limit exceeded", code: "RATE_LIMITED" },
        { status: 429 }
      );
      res.headers.set("X-RateLimit-Limit", limit.toString());
      res.headers.set("X-RateLimit-Remaining", remaining.toString());
      res.headers.set("X-RateLimit-Reset", reset.toString());
      return res;
    }

    // ✅ 3. Validate input
    const body = await req.json();
    const parsed = verifySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.format(), code: "VALIDATION_ERROR" },
        { status: 400 }
      );
    }

    const { email, otp } = parsed.data;

    // ✅ 4. Lookup OTP
    const record = await db.thirdPartyOTP.findUnique({ where: { email } });
    if (!record) {
      return NextResponse.json(
        { error: "No OTP found for this email", code: "OTP_NOT_FOUND" },
        { status: 404 }
      );
    }

    // ✅ 5. Expiry check
    if (record.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "OTP expired", code: "OTP_EXPIRED" },
        { status: 400 }
      );
    }

    // ✅ 6. Match check
    if (record.code !== otp) {
      return NextResponse.json(
        { error: "Invalid OTP", code: "INVALID_OTP" },
        { status: 400 }
      );
    }

    // ✅ 7. Success → delete OTP
    await db.thirdPartyOTP.delete({ where: { email } });

    // ✅ 8. Response with rate limit headers
    const res = NextResponse.json(
      { success: true, message: "OTP verified successfully" },
      { status: 200 }
    );
    res.headers.set("X-RateLimit-Limit", limit.toString());
    res.headers.set("X-RateLimit-Remaining", remaining.toString());
    res.headers.set("X-RateLimit-Reset", reset.toString());

    return res;
  } catch (err: any) {
    console.error("[OTP_VERIFY_ERROR]", err);
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
