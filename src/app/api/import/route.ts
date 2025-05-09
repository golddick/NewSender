import { NextRequest, NextResponse } from "next/server";
import Subscriber from "@/models/subscriber.model";
import { connectDb } from "@/shared/libs/db";
import { checkUsageLimit, incrementUsage } from "@/lib/checkAndUpdateUsage";

interface ImportSubscriber {
  email: string;
  newsLetterOwnerId: string;
  category: string;
  source?: string;
  status?: string;
  metadata?: {
    campaign?: string | null;
    pageUrl?: string;
    formId?: string;
  };
}

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    const { subscribers } = await req.json() as { subscribers: ImportSubscriber[] };

    if (!Array.isArray(subscribers) || subscribers.length === 0) {
      return NextResponse.json({
        error: "Invalid input",
        message: "Subscribers must be a non-empty array"
      }, { status: 400 });
    }

    // Normalize input
    const normalizedSubscribers = subscribers.map(sub => ({
      ...sub,
      email: sub.email.toLowerCase().trim(),
      source: sub.source || "CSV Import",
      status: sub.status || "Subscribed",
      category: sub.category,
      metadata: {
        campaign: sub.metadata?.campaign || null,
        pageUrl: sub.metadata?.pageUrl || "CSV Import",
        formId: sub.metadata?.formId || "csv_upload_form"
      }
    }));

    // In-request deduplication
    const seen = new Set();
    const internalDuplicates = normalizedSubscribers.filter(sub => {
      const key = `${sub.email}:${sub.newsLetterOwnerId}`;
      if (seen.has(key)) return true;
      seen.add(key);
      return false;
    });

    if (internalDuplicates.length > 0) {
      return NextResponse.json({
        error: "Duplicate emails in request",
        duplicates: internalDuplicates.map(d => d.email),
        duplicateCount: internalDuplicates.length,
        type: "csv_duplicates"
      }, { status: 400 });
    }

    // Check for existing subscribers in DB
    const existingSubscribers = await Subscriber.find({
      $or: normalizedSubscribers.map(sub => ({
        email: sub.email,
        newsLetterOwnerId: sub.newsLetterOwnerId
      }))
    });

    if (existingSubscribers.length > 0) {
      return NextResponse.json({
        error: "Existing subscribers",
        duplicates: existingSubscribers.map(s => s.email),
        duplicateCount: existingSubscribers.length,
        type: "db_duplicates"
      }, { status: 409 });
    }

    // Group by user for usage checks
    const groupedByUser: Record<string, ImportSubscriber[]> = {};
    for (const sub of normalizedSubscribers) {
      if (!groupedByUser[sub.newsLetterOwnerId]) {
        groupedByUser[sub.newsLetterOwnerId] = [];
      }
      groupedByUser[sub.newsLetterOwnerId].push(sub);
    }

    // ✅ 1. Check usage limits first for each user
    for (const userId of Object.keys(groupedByUser)) {
      const totalToAdd = groupedByUser[userId].length;
      for (let i = 0; i < totalToAdd; i++) {
        const check = await checkUsageLimit(userId, "subscribersAdded");
        if (!check.success) {
          return NextResponse.json({ error: check.message }, { status: 429 });
        }
      }
    }

    // ✅ 2. Insert into DB
    const inserted = await Subscriber.insertMany(normalizedSubscribers, {
      ordered: false,
      rawResult: true
    });

    // ✅ 3. Now increment usage counts only for successfully inserted records
    for (const userId of Object.keys(groupedByUser)) {
      const count = groupedByUser[userId].length;
      for (let i = 0; i < count; i++) {
        await incrementUsage(userId, "subscribersAdded");
      }
    }

    return NextResponse.json({
      success: true,
      message: "Subscribers imported successfully",
      count: inserted.insertedCount,
      inserted: inserted.insertedIds
    });

  } catch (err: any) {
    if (err.code === 11000) {
      const duplicates = err.writeErrors?.map((e: any) => e.err.op.email) || [];
      return NextResponse.json({
        error: "Duplicate key error",
        duplicates,
        duplicateCount: duplicates.length,
        type: "db_conflict"
      }, { status: 400 });
    }

    return NextResponse.json({
      error: "Server error",
      message: "An unexpected error occurred",
      details: process.env.NODE_ENV === "development" ? err.message : undefined
    }, { status: 500 });
  }
}
