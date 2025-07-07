import { NextRequest, NextResponse } from "next/server";
import { verifyApiKey } from "@/lib/sharedApi/auth";
import { db } from "@/shared/libs/database"; // Your Prisma instance

export async function GET(req: NextRequest) {
  try {
    // 1. Verify API Key
    const apiKey = req.headers.get("TheNews-api-key");
    const { userId, error } = await verifyApiKey(apiKey);
    if (error) {
      return NextResponse.json({ error }, { status: 403 });
    }

    // 2. Fetch campaigns where the user is the newsletter owner
    const campaigns = await db.campaign.findMany({
      where: {
        userId, // Adjust to 'newsLetterOwnerId' if that’s your field name
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ success: true, data: campaigns }, { status: 200 });

  } catch (error) {
    console.error("Campaign fetch error:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching campaigns." },
      { status: 500 }
    );
  }
}
