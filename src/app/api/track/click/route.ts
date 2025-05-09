// // File: app/api/track/click/route.ts

// import { NextRequest, NextResponse } from "next/server";

// export async function GET(req: NextRequest) {
//   const { searchParams } = new URL(req.url);
//   const emailId = searchParams.get("emailId");
//   const url = searchParams.get("url");

//   if (!emailId || !url) {
//     return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
//   }

//   // Log the click here (to DB, analytics, etc.)
//   console.log(`Click tracked for emailId: ${emailId}, redirecting to: ${url}`);

//   // Then redirect the user
//   return NextResponse.redirect(url);
// }


// src/app/api/track/click/route.ts

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const emailId = searchParams.get("emailId");
  const url = searchParams.get("url");

  if (!emailId || !url) {
    return NextResponse.json({ error: "Missing emailId or url" }, { status: 400 });
  }

  // Log the click (optional: save to DB)
  console.log(`Email clicked - ID: ${emailId}, URL: ${url}`);

  // Redirect to the target URL
  return NextResponse.redirect(url, { status: 302 });
}

