import { NextRequest, NextResponse } from "next/server";
import Subscriber from "@/models/subscriber.model";
import { connectDb } from "@/shared/libs/db";

// GET /api/unsubscribe?email=user@example.com&ownerId=abc123
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const newsLetterOwnerId = searchParams.get("ownerId");
    const category = searchParams.get("category");

    if (!email || !newsLetterOwnerId) {
      return NextResponse.json({ success: false, message: "Missing email or owner ID" }, { status: 400 });
    }

    await connectDb();

    const subscriber = await Subscriber.findOneAndUpdate(
      { email, newsLetterOwnerId },
      { status: "Unsubscribed" },
      { new: true }
    );

    if (!subscriber) {
      return NextResponse.json({ success: false, message: "Subscriber not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `You have been unsubscribed from ${category} Newsletter`,
    });
  } catch (error) {
    console.error("Unsubscribe error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
