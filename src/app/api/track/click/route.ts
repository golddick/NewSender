import { NextRequest, NextResponse } from 'next/server';
import { recordClick } from '@/lib/trackingService';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const emailId = searchParams.get('emailId');
  const rawUrl = searchParams.get('url');
  const email = searchParams.get('email');
  const trackingId = searchParams.get("tid"); 

  if (!emailId || !rawUrl || !email || !trackingId) { 
    return new NextResponse("Missing parameters", { status: 400 });
  }

  let redirectUrl: string;
  try {
    redirectUrl = decodeURIComponent(rawUrl);
  } catch (err) {
    console.error("Invalid redirect URL", err);
    return new NextResponse("Invalid redirect URL", { status: 400 });
  }

  try {
    await recordClick(emailId, redirectUrl, email);
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("Error processing click:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
