



import { NextRequest, NextResponse } from "next/server";
import Subscriber from "@/models/subscriber.model";
import { connectDb } from "@/shared/libs/db";

interface ImportSubscriber {
  email: string;
  newsLetterOwnerId: string;
  source?: string;
  status?: string;
}

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    
    const { subscribers } = await req.json() as { subscribers: ImportSubscriber[] };

    // Validate input
    if (!Array.isArray(subscribers)) {
      return NextResponse.json({ 
        error: "Invalid data format",
        message: "Subscribers must be provided as an array"
      }, { status: 400 });
    }

    if (subscribers.length === 0) {
      return NextResponse.json({ 
        error: "Empty import",
        message: "No subscribers provided in the CSV file"
      }, { status: 400 });
    }

    // Normalize and validate emails
    const normalizedSubscribers = subscribers.map(sub => ({
      ...sub,
      email: sub.email.toLowerCase().trim(),
      source: sub.source || "CSV Import",
      status: sub.status || "Subscribed"
    }));

    // Check for duplicates in the request itself
    const emailSet = new Set();
    const requestDuplicates = normalizedSubscribers.filter(sub => {
      const key = `${sub.email}:${sub.newsLetterOwnerId}`;
      if (emailSet.has(key)) return true;
      emailSet.add(key);
      return false;
    });

    if (requestDuplicates.length > 0) {
      return NextResponse.json(
        { 
          error: "Duplicate emails",
          message: "CSV contains duplicate email addresses",
          duplicates: requestDuplicates.map(d => d.email),
          duplicateCount: requestDuplicates.length,
          type: "csv_duplicates"
        }, 
        { status: 400 }
      );
    }

    // Check against existing subscribers in database
    const existingSubscribers = await Subscriber.find({
      $or: normalizedSubscribers.map(sub => ({
        email: sub.email,
        newsLetterOwnerId: sub.newsLetterOwnerId
      }))
    });

    if (existingSubscribers.length > 0) {
      return NextResponse.json(
        { 
          error: "Existing subscribers",
          message: "Some emails already exist in the database",
          duplicates: existingSubscribers.map(s => s.email),
          duplicateCount: existingSubscribers.length,
          type: "db_duplicates"
        }, 
        { status: 409 }
      );
    }

    // Insert new subscribers
    const inserted = await Subscriber.insertMany(normalizedSubscribers, { 
      ordered: false,
      rawResult: true 
    });
    
    return NextResponse.json({ 
      success: true, 
      message: "Subscribers imported successfully",
      count: inserted.insertedCount,
      inserted: inserted.insertedIds 
    });
  } catch (err: any) {
    // Handle duplicate key errors (fallback check)
    if (err.code === 11000) {
      const duplicateEmails = err.writeErrors?.map((error: any) => 
        error.err.op.email
      ) || [];
      
      return NextResponse.json(
        { 
          error: "Duplicate emails",
          message: "Some emails already exist in the database",
          duplicates: duplicateEmails,
          duplicateCount: duplicateEmails.length,
          type: "db_conflict"
        }, 
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        error: "Import failed",
        message: "Failed to process the CSV file",
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
      }, 
      { status: 500 }
    );
  }
}