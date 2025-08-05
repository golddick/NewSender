
import { NotificationEmailrecordClick } from "@/lib/trackingService-notiication-email";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const notificationId = searchParams.get("notificationId");
  const email = searchParams.get("email");
  const url = searchParams.get("url");
  const trackingId = searchParams.get("tid"); // ✅ Required tracking ID

  if (!notificationId || !email || !url || !trackingId) {
    return new NextResponse("Missing notificationId, email, url, or trackingId", { status: 400 });
  }

  try {
    // Record the click with trackingId
    await NotificationEmailrecordClick(notificationId, url, email, trackingId);

    // ✅ Ensure safe redirect
    const decodedUrl = decodeURIComponent(url);

    // Redirect to the actual link (fixes 404 issue caused by encoded URL)
    return NextResponse.redirect(decodedUrl, 302);
  } catch (error) {
    console.error("Click tracking error:", error);
    return new NextResponse("Failed to track click", { status: 500 });
  }
}
