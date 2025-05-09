// src/app/api/categories/PUT/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/shared/libs/db";
import { verifyApiKey } from "@/lib/sharedApi/auth";
import NewsLetterCategory from "@/models/newsLetterCategory.model";

export async function PUT(req: NextRequest) {
  try {
    // ✅ Verify API key
    const apiKey = req.headers.get("TheNews-api-key");
    const { userId, error } = await verifyApiKey(apiKey);

    if (error) {
      return NextResponse.json({ error }, { status: 403 });
    }

    // ✅ Parse request body
    const { categoryId, name, description } = await req.json();

    if (!categoryId || !name) {
      return NextResponse.json(
        { error: "Category ID and name are required." },
        { status: 400 }
      );
    }

    // ✅ Connect to DB
    await connectDb();

    // ✅ Find and update the category
    const updatedCategory = await NewsLetterCategory.findOneAndUpdate(
      { _id: categoryId, newsLetterOwnerId: userId },
      { name, description },
      { new: true }
    );

    if (!updatedCategory) {
      return NextResponse.json(
        { error: "Category not found or you do not have permission to update it." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedCategory }, { status: 200 });
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "An error occurred while updating the category." },
      { status: 500 }
    );
  }
}
