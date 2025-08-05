
import { NotificationEmailrecordOpen } from "@/lib/trackingService-notiication-email";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const notificationId = searchParams.get("notificationId");
  const email = searchParams.get("email");
  const trackingId = searchParams.get("tid"); // ✅ Added tracking ID

  if (!notificationId || !email || !trackingId) {
    return new NextResponse("Missing notificationId or email", { status: 400 });
  }

  try {
    // Record the open event with trackingId support
    await NotificationEmailrecordOpen(notificationId, email, trackingId);

    // Return a 1x1 transparent pixel for tracking
    const pixel = Buffer.from(
      "R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==",
      "base64"
    );

    return new NextResponse(pixel, {
      status: 200,
      headers: {
        "Content-Type": "image/gif",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.error("Open tracking error:", error);
    return new NextResponse("Failed to track open", { status: 500 });
  }
}
