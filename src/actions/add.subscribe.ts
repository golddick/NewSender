"use server";

import Subscriber from "@/models/subscriber.model";
import NewsLetterCategory from "@/models/newsLetterCategory.model";
import Campaign from "@/models/newsLetterCampaign.model";
import { connectDb } from "@/shared/libs/db";
import { validateEmail } from "@/shared/utils/ZeroBounceApi";
import { clerkClient } from "@clerk/nextjs/server";
import { checkUsageLimit, incrementUsage } from "@/lib/checkAndUpdateUsage";

export const subscribe = async ({
  email,
  username,
  categoryId,
  campaign,
}: {
  email: string;
  username: string;
  categoryId: string;
  campaign: string;
}) => {
  try {
    await connectDb();

    // Get user details from Clerk
    const client = await clerkClient();
    const allUsers = (await client.users.getUserList()).data;
    const newsletterOwner = allUsers.find((u) => u.username === username);
    if (!newsletterOwner) return { error: "Invalid username." };
    const ownerId = newsletterOwner.id;

    // 1. Check if the subscriber already exists
    const exists = await Subscriber.findOne({ email, newsLetterOwnerId: ownerId });
    if (exists) return { error: "Email already subscribed." };

    // 2. Validate email
    const validation = await validateEmail({ email });
    if (validation.status === "invalid") return { error: "Invalid email." };

    // 3. Validate category
    const category = await NewsLetterCategory.findOne({
      _id: categoryId,
      newsLetterOwnerId: ownerId,
    });
    if (!category) return { error: "Invalid or unauthorized category." };

    // 4. Check usage limit
    const usageCheck = await checkUsageLimit(ownerId, "subscribersAdded");
    if (!usageCheck.success) {
      return { error: usageCheck.message };
    }

    // 5. Create the subscriber
    const subscriber = await Subscriber.create({
      email,
      newsLetterOwnerId: ownerId,
      source: "By TheNews website",
      status: "Subscribed",
      category: categoryId,
      metadata: {
        campaign: campaign || "TheNews website general campaign",
        pageUrl: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/subscribe?username=${username}`,
        formId: "TheNews website general sub page",
      },
    });

    // 6. Update campaign subscriber count if campaign exists
    if (campaign) {
      await Campaign.findOneAndUpdate(
        { name: campaign, newsLetterOwnerId: ownerId },
        { 
          $inc: { subscribers: 1 },
          $push: { subscriberIds: subscriber._id },
        }
      );
    }

    // 7. Increment usage
    await incrementUsage(ownerId, "subscribersAdded");

    return {
      _id: subscriber._id.toString(),
      email: subscriber.email,
      status: subscriber.status,
      source: subscriber.source,
      createdAt: subscriber.createdAt,
    };
  } catch (err: any) {
    console.error("Subscribe error:", err);
    return { error: err.message || "Subscription failed." };
  }
};
