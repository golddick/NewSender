import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET_KEY as string;
if (!JWT_SECRET) {
  throw new Error("Missing JWT_SECRET_KEY in environment");
}

export async function verifyApiKey(apiKey: string | null) {
  if (!apiKey) {
    return {
      error: NextResponse.json({ error: "Missing API Key" }, { status: 400 }),
      userId: null, 
    };
  }

  try {
    const decoded = jwt.verify(apiKey, JWT_SECRET) as any;

    return {
      userId: decoded.id || decoded.user?.id || null,
      payload: decoded,
      error: null,
    };
  } catch (err) {
    return {
      error: NextResponse.json(
        { error: "Invalid API Key", details: err instanceof Error ? err.message : "Verification failed" },
        { status: 401 }
      ),
      userId: null,
    };
  }
}
