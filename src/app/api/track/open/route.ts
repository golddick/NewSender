// app/api/track/open/route.ts
import { NextResponse } from 'next/server';
import { recordOpen } from '@/lib/trackingService';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const emailId = searchParams.get("emailId");

  if (!emailId) {
    return new NextResponse("Missing emailId parameter", { status: 400 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";

  try {
    await recordOpen(emailId, ip);

    return new NextResponse(
      Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
        "base64"
      ),
      {
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("Error processing open:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}









// https://yourdomain.com/api/track/open?emailId=YOUR_VALID_ID testing
