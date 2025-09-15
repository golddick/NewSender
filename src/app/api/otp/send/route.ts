// app/api/otp/send/route.ts
import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/shared/libs/database";
import { verifyApiKey } from "@/lib/sharedApi/auth";
import { sendEmail } from "@/actions/email/sendOTPmail";
import { withCors, corsOptions } from "@/lib/cors";

const schema = z.object({
  email: z.string().email("Invalid email"),
  appName: z.string().default("TheNews"),
});

function generateOtp(length = 6): string {
  return Math.floor(100000 + Math.random() * 900000).toString().slice(0, length);
}

export async function OPTIONS() {
  return corsOptions();
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = req.headers.get("xypher-api-key");
    if (!apiKey) return withCors({ error: "Missing API key", code: "NO_API_KEY" }, 401);

    const { userId, error } = await verifyApiKey(apiKey);
    if (error || !userId) return withCors({ error: error || "Unauthorized", code: "INVALID_API_KEY" }, 403);

    
    const safeUserId = userId ?? undefined;

    const membership = await db.membership.findUnique({ where: { userId: safeUserId } });
    if (!membership || membership.subscriptionStatus !== "active") {
      return withCors({ error: "User does not have an active subscription", code: "SUBSCRIPTION_INVALID" }, 403);
    }

    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return withCors({ error: parsed.error.format(), code: "VALIDATION_ERROR" }, 400);

    const { email, appName } = parsed.data;
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await db.thirdPartyOTP.upsert({
      where: { email },
      update: { code: otp, expiresAt, createdBy: userId, createdAt: new Date() },
      create: { email, code: otp, expiresAt, createdBy: userId },
    });

    const html = `
      <div style="text-align:center;font-family:Arial, sans-serif;padding:20px;">
        <h2 style="text-transform: capitalize;">${appName} Verification Code</h2>
        <h1 style="font-size:24px;letter-spacing:3px;margin:20px 0;">${otp}</h1>
        <p>This code will expire in 10 minutes.</p>
        <div style="text-align:center;margin-top:20px;font-size:12px;color:#666;">
          <p>
            © 2025 <a href="https://thenews.africa" style="color:#666;text-decoration:underline;" target="_blank">Xypher Lt</a>.
            All rights reserved.
          </p>
        </div>
      </div>
    `;

    const result = await sendEmail(email, "Your Verification Code", html, appName);
    if (!result.success) return withCors({ error: "Failed to send email", code: "EMAIL_FAILED" }, 500);

    return withCors({ success: true, email, expiresAt }, 201);
  } catch (err: any) {
    console.error("[OTP_SEND_ERROR]", err);
    return withCors({ error: "Internal server error", code: "SERVER_ERROR" }, 500);
  }
}
