"use server";

import { connectDb } from "@/shared/libs/db";
import NewsLetterCategory from "@/models/newsLetterCategory.model";
import { clerkClient } from "@clerk/nextjs/server";
import { checkUsageLimit, incrementUsage } from "@/lib/checkAndUpdateUsage";

export const createCategory = async ({
  name,
  description,
  username,
}: {
  name: string;
  description?: string;
  username: string;
}) => {
  try {
    await connectDb();

    // Get user via Clerk
    const client = await clerkClient();
    const allUsersResponse = await client.users.getUserList();
    const allUsers = allUsersResponse.data;

    const newsletterOwner = allUsers.find((user) => user.username === username);
    if (!newsletterOwner) {
      return { error: "Invalid username." };
    }

    // ✅ 1. Check category creation limit
    const usageCheck = await checkUsageLimit(newsletterOwner.id, "categoriesCreated");
    if (!usageCheck.success) {
      return { error: usageCheck.message };
    }

    // ✅ 2. Create the category
    const newCategory = await NewsLetterCategory.create({
      name,
      description: description || "No description provided.",
      newsLetterOwnerId: newsletterOwner.id,
    });

    // ✅ 3. Increment usage only after successful creation
    await incrementUsage(newsletterOwner.id, "categoriesCreated");

    return {
      success: true,
      message: "Category created successfully.",
      data: {
        _id: newCategory._id.toString(),
        name: newCategory.name,
        description: newCategory.description,
      },
    };

  } catch (err: any) {
    console.error("Error creating category:", err);
    return {
      error: err.message || "An error occurred while creating the category.",
    };
  }
};
