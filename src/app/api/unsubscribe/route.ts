// import { NextRequest, NextResponse } from "next/server";
// import { db } from "@/shared/libs/database";
// import { decrementSubscriberUsage } from "@/lib/checkAndUpdateUsage";

// export async function GET(req: NextRequest) {
//   try {
//     const { searchParams } = new URL(req.url);

//     const email = searchParams.get("email");
//     const newsLetterOwnerId = searchParams.get("ownerId");
//     const integrationID = searchParams.get("integrationID");
//     const campaignId = searchParams.get("campaignID");

//     // ✅ Validate required parameters
//     if (!email || !newsLetterOwnerId) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Missing required parameters: email or ownerId.",
//         },
//         { status: 400 }
//       );
//     }


//     // ✅ Build subscriber filter
//     const whereClause: any = { email, newsLetterOwnerId };
//     if (campaignId) whereClause.campaignId = campaignId;

//     // ✅ Update subscriber status
//     const updateResult = await db.subscriber.updateMany({
//       where: whereClause,
//       data: { status: "Unsubscribed" },
//     });

//     const unsubscribedCount = updateResult.count;
//     if (unsubscribedCount === 0) {
//       return NextResponse.json(
//         { success: false, message: "Subscriber not found." },
//         { status: 404 }
//       );
//     }


//     // ✅ Adjust usage tracking
//     await decrementSubscriberUsage(newsLetterOwnerId, unsubscribedCount);

//     return NextResponse.json({
//       success: true,
//       message: `You have successfully  unsubscribed .`,
//     });
//   } catch (error) {
//     console.error("Unsubscribe error:", error);
//     return NextResponse.json(
//       {
//         success: false,
//         message: "Server error occurred while processing your request.",
//       },
//       { status: 500 }
//     );
//   }
// }







// app/api/unsubscribe/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/shared/libs/database";
import { decrementSubscriberUsage } from "@/lib/checkAndUpdateUsage";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const email = searchParams.get("email");
    const newsLetterOwnerId = searchParams.get("ownerId");
    const campaignId = searchParams.get("campaignID");

    if (!email || !newsLetterOwnerId) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required parameters: email or ownerId.",
        },
        { status: 400 }
      );
    }

    const whereClause: any = { email, newsLetterOwnerId };
    if (campaignId) whereClause.campaignId = campaignId;

    const updateResult = await db.subscriber.updateMany({
      where: whereClause,
      data: { status: "Unsubscribed" },
    });

    const unsubscribedCount = updateResult.count;
    if (unsubscribedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Subscriber not found." },
        { status: 404 }
      );
    }

    await decrementSubscriberUsage(newsLetterOwnerId, unsubscribedCount);

    // ✅ Redirect to a success page
    return NextResponse.redirect(
      new URL("/unsubscribe/success", req.url)
    );
  } catch (error) {
    console.error("Unsubscribe error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error occurred while processing your request.",
      },
      { status: 500 }
    );
  }
}
