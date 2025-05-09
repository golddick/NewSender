"use server";

import { connectDb } from "@/shared/libs/db";
import Campaign from "@/models/newsLetterCampaign.model";
import NewsLetterCategory from "@/models/newsLetterCategory.model";
import { clerkClient } from "@clerk/nextjs/server";
import { checkUsageLimit, incrementUsage } from "@/lib/checkAndUpdateUsage";

export const createCampaign = async ({
  name,
  description,
  startDate,
  endDate,
  status,
  username,
  category,
}: {
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  username: string;
  category: string;
}) => {
  try {
    await connectDb();

    if (!category) {
      return { error: "Category ID is required." };
    }

    const categoryData = await NewsLetterCategory.findById(category);
    if (!categoryData) {
      return { error: "Category not found." };
    }

    const client = await clerkClient();
    const allUsersResponse = await client.users.getUserList();
    const allUsers = allUsersResponse.data;
    const newsletterOwner = allUsers.find((user) => user.username === username);

    if (!newsletterOwner) {
      return { error: "Invalid username." };
    }

    // ✅ 1. Check campaign creation limit 
    const usageCheck = await checkUsageLimit(newsletterOwner.id, "campaignsCreated");
    if (!usageCheck.success) {
      return { error: usageCheck.message };
    }

    // ✅ 2. Create campaign
    const newCampaign = await Campaign.create({
      name,
      description: description || "No description provided.",
      newsLetterOwnerId: newsletterOwner.id,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      status: status || "Active",
      emails: [],
      category: category,
    });

    // ✅ 3. Increment usage
    await incrementUsage(newsletterOwner.id, "campaignsCreated");

    return {
      success: true,
      message: "Campaign created successfully.",
      data: {
        _id: newCampaign._id.toString(),
        name: newCampaign.name,
        description: newCampaign.description,
        startDate: newCampaign.startDate,
        endDate: newCampaign.endDate,
        status: newCampaign.status,
        emailsSent: newCampaign.emails?.length || 0,
        category: newCampaign.category.toString(),
        subscribers: [], // can be populated elsewhere
      },
    };
  } catch (error: any) {
    console.error("Error creating campaign:", error);
    return {
      error: error.message || "An error occurred while creating the campaign.",
    };
  }
};
