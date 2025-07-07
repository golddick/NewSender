import { NextRequest, NextResponse } from "next/server";
import { checkUsageLimit, incrementUsage } from "@/lib/checkAndUpdateUsage";
import { db } from "@/shared/libs/database";

interface ImportSubscriber {
  email: string;
  name?: string | null;
  newsLetterOwnerId: string;
  integrationId: string;
  campaignId: string; // made required
  source?: string;
  status?: "Subscribed" | "Unsubscribed";
  pageUrl?: string | null;
}

export async function POST(req: NextRequest) {
  try {
    const { subscribers } = await req.json() as { subscribers: ImportSubscriber[] };

    if (!Array.isArray(subscribers) || subscribers.length === 0) {
      return NextResponse.json({
        success: false,
        message: "Subscribers must be a non-empty array",
        duplicateEmails: [],
        existingEmails: [],
        invalidEntries: []
      }, { status: 400 });
    }

    // Validate required fields including campaignId
    const invalidSubscribers = subscribers.filter(
      sub => !sub.email || !sub.newsLetterOwnerId || !sub.integrationId || !sub.campaignId
    );

    if (invalidSubscribers.length > 0) {
      return NextResponse.json({
        success: false,
        message: "Email, newsletterOwnerId, integrationId, and campaignId are required",
        duplicateEmails: [],
        existingEmails: [],
        invalidEntries: invalidSubscribers.map(s => s.email)
      }, { status: 400 });
    }

    // Normalize
    const normalizedSubscribers = subscribers.map(sub => ({
      email: sub.email.toLowerCase().trim(),
      name: sub.name || null,
      newsLetterOwnerId: sub.newsLetterOwnerId,
      integrationId: sub.integrationId,
      campaignId: sub.campaignId,
      source: sub.source || "CSV Import",
      status: sub.status || "Subscribed",
      pageUrl: sub.pageUrl || null
    }));

    // Validate integration is active
    const integration = await db.integration.findUnique({
      where: { id: normalizedSubscribers[0].integrationId },
      select: { id: true, status: true }
    });

    if (!integration || integration.status !== "active") {
      return NextResponse.json({
        success: false,
        message: "The integration is inactive or does not exist",
        duplicateEmails: [],
        existingEmails: [],
        invalidEntries: []
      }, { status: 400 });
    }

    // Validate campaign is active
    const campaign = await db.campaign.findUnique({
      where: { id: normalizedSubscribers[0].campaignId },
      select: { id: true, status: true }
    });

    if (!campaign || campaign.status !== "active") {
      return NextResponse.json({
        success: false,
        message: "The campaign is inactive or does not exist",
        duplicateEmails: [],
        existingEmails: [],
        invalidEntries: []
      }, { status: 400 });
    }

    // Detect duplicates in CSV
    const seen = new Set();
    const internalDuplicates = normalizedSubscribers.filter(sub => {
      const key = `${sub.email}:${sub.newsLetterOwnerId}:${sub.integrationId}`;
      if (seen.has(key)) return true;
      seen.add(key);
      return false;
    });

    if (internalDuplicates.length > 0) {
      return NextResponse.json({
        success: false,
        message: "Duplicate emails found in uploaded file",
        duplicateEmails: internalDuplicates.map(d => d.email),
        existingEmails: [],
        invalidEntries: [],
        duplicateCount: internalDuplicates.length
      }, { status: 200 });
    }

    // Check if subscriber already exists in DB
    const existingSubscribers = await db.subscriber.findMany({
      where: {
        OR: normalizedSubscribers.map(sub => ({
          email: sub.email,
          newsLetterOwnerId: sub.newsLetterOwnerId,
          integrationId: sub.integrationId
        }))
      },
      select: {
        email: true
      }
    });

    if (existingSubscribers.length > 0) {
      return NextResponse.json({
        success: false,
        message: "Some subscribers already exist",
        duplicateEmails: [],
        existingEmails: existingSubscribers.map(e => e.email),
        invalidEntries: [],
        duplicateCount: existingSubscribers.length
      }, { status: 200 });
    }

    // Check usage limits
    const groupedByUser: Record<string, ImportSubscriber[]> = {};
    for (const sub of normalizedSubscribers) {
      if (!groupedByUser[sub.newsLetterOwnerId]) {
        groupedByUser[sub.newsLetterOwnerId] = [];
      }
      groupedByUser[sub.newsLetterOwnerId].push(sub);
    }

    for (const userId of Object.keys(groupedByUser)) {
      const totalToAdd = groupedByUser[userId].length;
      for (let i = 0; i < totalToAdd; i++) {
        const check = await checkUsageLimit(userId, "subscribersAdded");
        if (!check.success) {
          return NextResponse.json({
            success: false,
            message: check.message,
            duplicateEmails: [],
            existingEmails: [],
            invalidEntries: [],
            count: 0
          }, { status: 429 });
        }
      }
    }

    // Insert subscribers
    const inserted = await db.subscriber.createMany({
      data: normalizedSubscribers,
      skipDuplicates: true
    });

    // Update integration subscriber count
    await db.integration.update({
      where: { id: normalizedSubscribers[0].integrationId },
      data: {
        subscribers: { increment: inserted.count }
      }
    });

    // Update usage counters
    for (const userId of Object.keys(groupedByUser)) {
      const count = groupedByUser[userId].length;
      for (let i = 0; i < count; i++) {
        await incrementUsage(userId, "subscribersAdded");
      }
    }

    return NextResponse.json({
      success: true,
      message: "Subscribers imported successfully",
      count: inserted.count,
      duplicateCount: normalizedSubscribers.length - inserted.count,
      duplicateEmails: [],
      existingEmails: [],
      invalidEntries: []
    });

  } catch (err: any) {
    if (err.code === "P2002") {
      return NextResponse.json({
        success: false,
        message: "One or more subscribers already exist with the same email, owner, and integration",
        duplicateEmails: [],
        existingEmails: [],
        invalidEntries: []
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      message: "An unexpected error occurred",
      duplicateEmails: [],
      existingEmails: [],
      invalidEntries: [],
      count: 0,
      details: process.env.NODE_ENV === "development" ? err.message : undefined
    }, { status: 500 });
  }
}
