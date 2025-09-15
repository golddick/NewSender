

import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/shared/libs/database";
import { createApiKey, getApiKey, regenerateApiKey } from "@/shared/libs/key/apiKey";


export async function GET(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const regenerate = searchParams.get("regenerate") === "true";

    let apiKeyRecord;

    if (regenerate) {
      // 🔄 Always regenerate (delete old, create new, return new key)
      apiKeyRecord = await regenerateApiKey();
    } else {
      // 🗝️ Check if a key exists
      const existing = await db.apiKey.findFirst({
        where: { userId: user.id },
      });

      if (existing) {
        // 🔓 Decrypt and return existing key
        apiKeyRecord = await getApiKey();
      } else {
        // ➕ Create new key
        apiKeyRecord = await createApiKey();
      }
    }

    return NextResponse.json(apiKeyRecord, { status: 200 });
  } catch (err: any) {
    console.error("API Key Error:", err);
    return NextResponse.json({ error: "Failed to generate key" }, { status: 500 });
  }
}
