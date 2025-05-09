// src/app/api/categories/POST/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/shared/libs/db";
import { verifyApiKey } from "@/lib/sharedApi/auth"; // Assuming API key validation utility
import NewsLetterCategory from "@/models/newsLetterCategory.model";

export async function POST(req: NextRequest) {
  try {
    // ✅ Verify API key
    const apiKey = req.headers.get("TheNews-api-key");
    const { userId, error } = await verifyApiKey(apiKey);

    // If API key is invalid
    if (error) {
      return NextResponse.json({ error }, { status: 403 });
    }

    // Parse request data
    const { name, description } = await req.json();

    // ✅ Validate input
    if (!name) {
      return NextResponse.json({ error: "Category name is required." }, { status: 400 });
    }

    // ✅ Connect to DB
    await connectDb();

    // ✅ Create new category
    const category = new NewsLetterCategory({
      name,
      description: description || "No description provided.",
      newsLetterOwnerId: userId, // Use userId from the API key
    });

    // ✅ Save the category to DB
    await category.save();

    // ✅ Return success response
    return NextResponse.json({ data: category }, { status: 201 });

  } catch (error) {
    console.error("Error creating category:", error);
    const errorMessage = error instanceof Error ? error.message : "An error occurred while creating the category.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
