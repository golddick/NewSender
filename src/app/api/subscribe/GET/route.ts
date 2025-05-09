import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/shared/libs/db";
import Subscriber from "@/models/subscriber.model";
import Membership from "@/models/membership.model";
import { verifyApiKey } from "@/lib/sharedApi/auth";

export async function GET(req: NextRequest) {
  const apiKey = req.headers.get("TheNews-api-key");
  const { userId, error } = await verifyApiKey(apiKey);
  if (error) return error;

  await connectDb();

  // Check if the user has an active subscription
  const membership = await Membership.findOne({ userId });
  if (!membership || membership.subscriptionStatus !== "active") {
    return NextResponse.json(
      { error: "User does not have an active subscription." },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(req.url);

  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(Math.max(parseInt(searchParams.get("limit") || "20", 10), 1), 100);
  const status = searchParams.get("status");
  const search = searchParams.get("search");

  const query: Record<string, any> = {
    newsLetterOwnerId: userId,
  };

  if (status) query.status = status;

  if (search) {
    const regex = { $regex: search, $options: "i" };
    query.$or = [{ email: regex }, { source: regex }];
  }

  const [total, subscribers] = await Promise.all([
    Subscriber.countDocuments(query),
    Subscriber.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select("-newsLetterOwnerId -__v"),
  ]);

  return NextResponse.json({
    success: true,
    data: subscribers,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
}
