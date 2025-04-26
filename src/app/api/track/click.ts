import { NextRequest, NextResponse } from "next/server";
import Email from "@/models/email.model";
import { connectDb } from "@/shared/libs/db";

export async function GET(req: NextRequest) {
  try {
    await connectDb();

    const url = req.nextUrl.searchParams.get("url");
    const emailId = req.nextUrl.searchParams.get("emailId");

    if (emailId) {
      await Email.findByIdAndUpdate(emailId, { $set: { clicked: true } });
    }

    return NextResponse.redirect(url || "https://yourdomain.com");
  } catch (err) {
    return NextResponse.json({ error: "Click tracking failed" }, { status: 500 });
  }
}
