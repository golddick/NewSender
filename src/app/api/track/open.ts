// This will just load the pixel and update the DB
import { NextRequest, NextResponse } from "next/server";
import Email from "@/models/email.model";
import { connectDb } from "@/shared/libs/db";


export async function GET(req: NextRequest) {
  try {
    await connectDb();

    const emailId = req.nextUrl.searchParams.get("emailId");
    if (emailId) {
      await Email.findByIdAndUpdate(emailId, { $set: { opened: true } });
    }

    const pixel = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII=",
      "base64"
    );

    return new NextResponse(pixel, {
      headers: {
        "Content-Type": "image/png",
        "Content-Length": pixel.length.toString(),
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (err) {
    return NextResponse.json({ error: "Error tracking open" }, { status: 500 });
  }
}
