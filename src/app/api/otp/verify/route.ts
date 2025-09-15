import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/shared/libs/database";

const verifySchema = z.object({
  email: z.string().email("Invalid email"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = verifySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.format(), code: "VALIDATION_ERROR" },
        { status: 400 }
      );
    }

    const { email, otp } = parsed.data;

    // 🔎 Lookup stored OTP
    const record = await db.thirdPartyOTP.findUnique({
      where: { email },
    });

    if (!record) {
      return NextResponse.json(
        { error: "No OTP found for this email", code: "OTP_NOT_FOUND" },
        { status: 404 }
      );
    }

    // 🕒 Expiry check (assume 10 minutes)
    if (record.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "OTP expired", code: "OTP_EXPIRED" },
        { status: 400 }
      );
    }

    // ✅ Match check
    if (record.code !== otp) {
      return NextResponse.json(
        { error: "Invalid OTP", code: "INVALID_OTP" },
        { status: 400 }
      );
    }

    // 🎉 Success → delete OTP after verification
    await db.thirdPartyOTP.delete({ where: { email } });

    return NextResponse.json(
      { success: true, message: "OTP verified successfully" },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("[OTP_VERIFY_ERROR]", err);
    return NextResponse.json(
      { error: "Internal server error", code: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}
