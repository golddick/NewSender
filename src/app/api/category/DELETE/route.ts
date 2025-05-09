// src/app/api/categories/DELETE/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/shared/libs/db";
import { verifyApiKey } from "@/lib/sharedApi/auth";
import NewsLetterCategory from "@/models/newsLetterCategory.model";

export async function DELETE(req: NextRequest) {
  try {
    // ✅ Verify API key
    const apiKey = req.headers.get("TheNews-api-key");
    const { userId, error } = await verifyApiKey(apiKey);

    if (error || !userId) {
      return NextResponse.json({ error: "Unauthorized API key." }, { status: 403 });
    }

    // ✅ Parse and validate request body
    const body = await req.json();
    const { categoryId } = body;

    if (!categoryId) {
      return NextResponse.json({ error: "Category ID is required." }, { status: 400 });
    }

    // ✅ Connect to the database
    await connectDb();

    // ✅ Find and delete the category
    const deletedCategory = await NewsLetterCategory.findOneAndDelete({
      _id: categoryId,
      newsLetterOwnerId: userId,
    });

    if (!deletedCategory) {
      return NextResponse.json(
        { error: "Category not found or access denied." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Category deleted successfully." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      {
        error: error.message || "An internal error occurred.",
      },
      { status: 500 }
    );
  }
}
