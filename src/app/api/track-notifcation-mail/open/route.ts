// src/app/api/track/open/route.ts
import { recordOpen } from "@/lib/trackingService-notiication-email";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const emailId = searchParams.get("emailId");
  const email = searchParams.get("email"); // capture the recipient email

  if (!emailId || !email) {
    return new NextResponse("Missing emailId or email", { status: 400 });
  }

  try {
    const recorded = await recordOpen(emailId, email);

    // Return a 1x1 transparent pixel 
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


// // src/app/api/track/open/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { recordOpen } from "@/lib/trackingService";
// import { getClientIp } from "@/lib/getClientIp";


// export async function GET(req: NextRequest) {
//   const { searchParams } = new URL(req.url);
//   const emailId = searchParams.get("emailId");

//   if (!emailId) {
//     return new NextResponse("Missing emailId", { status: 400 });
//   }

//   // Get IP address (via custom util or direct header access)
//   const ip = getClientIp(req) || "unknown";

//   try {
//     const recorded = await recordOpen(emailId, ip);

//     // Return a 1x1 pixel transparent gif
//     const pixel = Buffer.from(
//       "R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==",
//       "base64"
//     );

//     return new NextResponse(pixel, {
//       status: 200,
//       headers: {
//         "Content-Type": "image/gif",
//         "Cache-Control": "no-cache, no-store, must-revalidate",
//         Pragma: "no-cache",
//         Expires: "0",
//       },
//     });
//   } catch (error) {
//     console.error("Open tracking error:", error);
//     return new NextResponse("Failed to track open", { status: 500 });
//   }
// }
