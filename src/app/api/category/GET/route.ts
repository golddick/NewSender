// // src/app/api/categories/GET/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { connectDb } from "@/shared/libs/db";
// import { verifyApiKey } from "@/lib/sharedApi/auth"; // Assuming API key validation utility
// import NewsLetterCategory from "@/models/newsLetterCategory.model";

// export async function GET(req: NextRequest) {
//   try {
//     // ✅ Verify API key
//     const apiKey = req.headers.get("TheNews-api-key");
//     const { userId, error } = await verifyApiKey(apiKey);

//     // If API key is invalid
//     if (error) {
//       return NextResponse.json({ error }, { status: 403 });
//     }

//     // ✅ Connect to DB
//     await connectDb();

//     // ✅ Fetch categories created by the user
//     const categories = await NewsLetterCategory.find({ newsLetterOwnerId: userId });

//     console.log("Fetched categories:", categories);

//     // ✅ Return success response
//     return NextResponse.json({ data: categories }, { status: 200 });

//   } catch (error) {
//     console.error("Error fetching categories:", error);
//     return NextResponse.json({ error: "An error occurred while fetching categories." }, { status: 500 });
//   }
// }







import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/shared/libs/db";
import { verifyApiKey } from "@/lib/sharedApi/auth";
import NewsLetterCategory from "@/models/newsLetterCategory.model";
import NewsLetterCampaign from "@/models/newsLetterCampaign.model"; // ⬅️ Ensure this exists

export async function GET(req: NextRequest) {
  try {
    const apiKey = req.headers.get("TheNews-api-key");
    const { userId, error } = await verifyApiKey(apiKey);

    if (error) {
      return NextResponse.json({ error }, { status: 403 });
    }

    await connectDb();

    const categories = await NewsLetterCategory.find({ newsLetterOwnerId: userId });

    console.log("Fetched categories:", categories);

    const categoriesWithCampaigns = await Promise.all(
      categories.map(async (category) => {
        const campaigns = await NewsLetterCampaign.find({ category: category._id });
        console.log("Fetched campaigns for category:", category.name, campaigns);

        const enrichedCampaigns = campaigns.map((campaign) => ({
          _id: campaign._id,
          name: campaign.name,
          description: campaign.description,
          status: campaign.status,
          startDate: campaign.startDate,
          endDate: campaign.endDate,
          emailsSent: campaign.emailsSent,
          subscriberCount: campaign.subscriberIds?.length || 0, // 💡 Real-time count
        }));

        return {
          ...category.toObject(),
          campaigns: enrichedCampaigns,
        };
      })
    );

    return NextResponse.json({ data: categoriesWithCampaigns }, { status: 200 });
  } catch (error) {
    console.error("Error fetching categories with campaigns:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching categories and campaigns." },
      { status: 500 }
    );
  }
}
