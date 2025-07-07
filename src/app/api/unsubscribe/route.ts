// import { NextRequest, NextResponse } from "next/server";
// import Subscriber from "@/models/subscriber.model";
// import { connectDb } from "@/shared/libs/db";

// // GET /api/unsubscribe?email=user@example.com&ownerId=abc123
// export async function GET(req: NextRequest) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const email = searchParams.get("email");
//     const newsLetterOwnerId = searchParams.get("ownerId");
//     const category = searchParams.get("category");

//     if (!email || !newsLetterOwnerId) {
//       return NextResponse.json({ success: false, message: "Missing email or owner ID" }, { status: 400 });
//     }

//     await connectDb();

//     const subscriber = await Subscriber.findOneAndUpdate(
//       { email, newsLetterOwnerId },
//       { status: "Unsubscribed" },
//       { new: true }
//     );

//     if (!subscriber) {
//       return NextResponse.json({ success: false, message: "Subscriber not found" }, { status: 404 });
//     }

//     return NextResponse.json({
//       success: true,
//       message: `You have been unsubscribed from ${category} Newsletter`,
//     });
//   } catch (error) {
//     console.error("Unsubscribe error:", error);
//     return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
//   }
// }



// src/app/api/unsubscribe/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/shared/libs/database"; // Prisma client
import { decrementSubscriberUsage } from "@/lib/checkAndUpdateUsage";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const email = searchParams.get("email");
    const newsLetterOwnerId = searchParams.get("ownerId");
    const integrationName = searchParams.get("integration");
    const campaignId = searchParams.get("campaignId");

    // ✅ Validate query parameters
    if (!email || !newsLetterOwnerId || !integrationName) {
      return NextResponse.json({
        success: false,
        message: "Missing required parameters: email, ownerId, or integration",
      }, { status: 400 });
    }

    // ✅ Find integration by name and user ID (owner)
    const integration = await db.integration.findFirst({
      where: {
        name: integrationName,
        userId: newsLetterOwnerId,
      },
    });

    if (!integration) {
      return NextResponse.json({
        success: false,
        message: "Integration not found.",
      }, { status: 404 });
    }

    // ✅ Build subscriber filter
    const whereClause: any = {
      email,
      newsLetterOwnerId,
      integrationId: integration.id,
    };

    if (campaignId) {
      whereClause.campaignId = campaignId;
    }

    // ✅ Update subscriber status
    const updateResult = await db.subscriber.updateMany({
      where: whereClause,
      data: { status: "Unsubscribed" },
    });

    const unsubscribedCount = updateResult.count;

    if (unsubscribedCount === 0) {
      return NextResponse.json({
        success: false,
        message: "Subscriber not found.",
      }, { status: 404 });
    }

    await db.integration.update({
      where: { id: integration.id },
      data: { subscribers: { decrement: unsubscribedCount } },
    })

    // ✅ Adjust usage tracking
    await decrementSubscriberUsage(newsLetterOwnerId, unsubscribedCount);

    return NextResponse.json({
      success: true,
      message: `You have been unsubscribed from ${integrationName} newsletter.`,
    });

  } catch (error) {
    console.error("Unsubscribe error:", error);
    return NextResponse.json({
      success: false,
      message: "Server error occurred while processing your request.",
    }, { status: 500 });
  }
}
