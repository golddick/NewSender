// lib/sharedApi/auth.ts
import { db } from "@/shared/libs/database";
import { decryptKey } from "@/shared/libs/key/apiKey";


/**
 * Verify API key against database
 */
export const verifyApiKey = async (providedKey: string) => {
  try {
    // 1. Fetch all API keys (you can optimize with index if you hash key instead)
    const records = await db.apiKey.findMany();

    if (!records.length) {
      return { error: "No API keys found", userId: null };
    }

    // 2. Try to match decrypted stored key with provided one
    for (const record of records) {
      try {
        const rawKey = decryptKey(record.keyHash);

        if (rawKey === providedKey) {
          // 3. Expiration check
          if (record.expiresAt && record.expiresAt < new Date()) {
            return { error: "API key expired", userId: null };
          }

          return { error: null, userId: record.userId };
        }
      } catch (err) {
        // Skip corrupted key
        continue;
      }
    }

    return { error: "Invalid API key", userId: null };
  } catch (err) {
    console.error("[VERIFY_API_KEY_ERROR]", err);
    return { error: "Server error", userId: null };
  }
};
