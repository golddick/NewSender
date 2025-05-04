import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDb } from "@/shared/libs/db";
import Subscriber from "@/models/subscriber.model";
import Membership from "@/models/membership.model";
import MembershipUsage from "@/models/membershipUsage.model";
import { validateEmail } from "@/shared/utils/ZeroBounceApi";

const PLAN_LIMITS: Record<string, number> = {
  FREE: 10,
  LUNCH: 100,
  SCALE: 1000,
};

export async function POST(req: NextRequest) {
  try {
    const apiKey = req.headers.get("TheNews-api-key");
    if (!apiKey) {
      return NextResponse.json({ error: "Missing API Key header" }, { status: 400 });
    }

    const { email, source = "By API" } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    const decoded: any = jwt.verify(apiKey, process.env.JWT_SECRET_KEY!);
    const userId = decoded?.user?.id;

    await connectDb();

    const membership = await Membership.findOne({ userId });
    if (!membership) {
      return NextResponse.json({ error: "Membership not found" }, { status: 404 });
    }

    // Check hourly limit
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const hourlyLimit = PLAN_LIMITS[membership.plan?.toUpperCase()] || 10;

    const hourlySubscribers = await Subscriber.countDocuments({
      newsLetterOwnerId: userId,
      createdAt: { $gte: oneHourAgo },
    });

    if (hourlySubscribers >= hourlyLimit) {
      return NextResponse.json(
        { error: `Hourly limit exceeded for your plan (${membership.plan}).` },
        { status: 429 }
      );
    }

    // Monthly usage check
    const currentMonth = new Date().toISOString().slice(0, 7);
    const usage = await MembershipUsage.findOneAndUpdate(
      { userId, month: currentMonth },
      { $setOnInsert: { subscribersAdded: 0, emailsSent: 0 } },
      { upsert: true, new: true }
    );

    if (usage.subscribersAdded >= (membership.subscriberLimit || 500)) {
      return NextResponse.json(
        { error: `Monthly subscriber limit reached for your plan (${membership.plan}).` },
        { status: 403 }
      );
    }

    const existingSubscriber = await Subscriber.findOne({ email, newsLetterOwnerId: userId });
    if (existingSubscriber) {
      return NextResponse.json({ error: "Email already exists!" }, { status: 409 });
    }

    const validation = await validateEmail({ email });
    if (validation.status === "invalid") {
      return NextResponse.json({ error: "Email not valid!" }, { status: 400 });
    }

    const newSubscriber = await Subscriber.create({
      email,
      newsLetterOwnerId: userId,
      source: `By API - ${source}`,
      status: "Subscribed",
    });

    await MembershipUsage.updateOne(
      { userId, month: currentMonth },
      { $inc: { subscribersAdded: 1 } }
    );

    return NextResponse.json(newSubscriber, { status: 200 });
  } catch (err: any) {
    console.error("Error in subscribe API:", err);
    if (err.name === "JsonWebTokenError") {
      return NextResponse.json({ error: "Invalid API Key" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

