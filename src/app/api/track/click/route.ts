import { NextRequest, NextResponse } from 'next/server';
import { recordClick } from '@/lib/trackingService';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const emailId = searchParams.get('emailId');
  const url = searchParams.get('url');

  if (!emailId || !url) {
    return new NextResponse("Missing parameters", { status: 400 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";

  try {
    await recordClick(emailId, url, ip);
    return NextResponse.redirect(url);
  } catch (error) {
    console.error("Error processing click:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
