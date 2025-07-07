// import { NextRequest, NextResponse } from 'next/server';
// import { recordClick } from '@/lib/trackingService';

// export async function GET(req: NextRequest) {
//   const { searchParams } = new URL(req.url);
//   const emailId = searchParams.get('emailId');
//   const url = searchParams.get('url');

//   if (!emailId || !url) {
//     return new NextResponse("Missing parameters", { status: 400 });
//   }

//   const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";

//   try {
//     await recordClick(emailId, url, ip);
//     return NextResponse.redirect(url);
//   } catch (error) {
//     console.error("Error processing click:", error);
//     return new NextResponse("Internal Server Error", { status: 500 });
//   }
// }



import { NextRequest, NextResponse } from 'next/server';
import { getClientIp } from '@/lib/getClientIp'; // Make sure this is updated as per earlier fix
import { recordClick } from '@/lib/trackingService';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const emailId = searchParams.get('emailId');
  const rawUrl = searchParams.get('url');

  if (!emailId || !rawUrl) {
    return new NextResponse("Missing parameters", { status: 400 });
  }

  // Decode the URL safely
  let redirectUrl: string;
  try {
    redirectUrl = decodeURIComponent(rawUrl);
  } catch (err) {
    console.error("Invalid redirect URL", err);
    return new NextResponse("Invalid redirect URL", { status: 400 });
  }

  const ip = getClientIp(req) || "unknown";

  try {
    await recordClick(emailId, redirectUrl, ip);
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("Error processing click:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
