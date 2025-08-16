// src/app/api/api-key/route.ts
import { generateApiKey, regenerateApiKey } from "@/shared/utils/token.generator";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const regenerate = searchParams.get("regenerate") === "true";

  try {
    const key = regenerate
      ? await regenerateApiKey()
      : await generateApiKey();

    return NextResponse.json({ apiKey: key });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to generate key" },
      { status: 500 }
    );
  }
}

