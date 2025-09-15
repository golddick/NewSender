// src/app/api/otp/regenerate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/shared/libs/database";
import { verifyApiKey } from "@/lib/sharedApi/auth";
import { sendEmail } from "@/actions/email/sendOTPmail";

const schema = z.object({
  email: z.string().email("Invalid email"),
  appName: z.string().default("TheNews"),
});

function generateOtp(length = 6): string {
  return Math.floor(100000 + Math.random() * 900000)
    .toString()
    .slice(0, length);
}

export async function POST(req: NextRequest) {
  try {
    // 🔑 Verify API key
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

    // ✅ Validate input
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.format(), code: "VALIDATION_ERROR" },
        { status: 400 }
      );
    }

    const { email, appName } = parsed.data;

    // 🔑 Generate new OTP
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // 💾 Upsert OTP in DB (create or update)
    await db.thirdPartyOTP.upsert({
      where: { email },
      update: { code: otp, expiresAt, createdBy: userId, createdAt: new Date() },
      create: { email, code: otp, expiresAt, createdBy: userId },
    });

    // 📩 Send email with new OTP
     const html = `
  <div style="text-align:center;font-family:Arial, sans-serif;padding:20px;">
    <h2 style="text-transform: capitalize;">${appName} Verification Code</h2>
    <p>Use this OTP to verify your email:</p>
    <h1 style="font-size:24px;letter-spacing:3px;margin:20px 0;">${otp}</h1>
    <p>This code will expire in 10 minutes.</p>

    <div style="text-align:center;margin-top:20px;font-size:12px;color:#666;">
      <p>
        © 2025 <a href="https://thenews.africa" 
                  style="color:#666;text-decoration:underline;"
                  target="_blank">Xypher Lt</a>. 
        All rights reserved.
      </p>
    </div>
  </div>
`;

    const result = await sendEmail(email, "Your Verification Code", html, appName);
    if (!result.success) {
      return NextResponse.json(
        { error: "Failed to send email", code: "EMAIL_FAILED" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, email, otp, expiresAt, message: "OTP regenerated and sent successfully." },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("[OTP_REGENERATE_ERROR]", err);
    return NextResponse.json(
      { error: "Internal server error", code: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}
