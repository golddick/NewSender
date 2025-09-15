// app/api/subscriber/route.ts
import { NextRequest } from "next/server";
import { db } from "@/shared/libs/database";
import { verifyApiKey } from "@/lib/sharedApi/auth";
import { withCors, corsOptions } from "@/lib/cors";

export async function OPTIONS() {
  return corsOptions();
}

export async function GET(req: NextRequest) {
  try {
    const apiKey = req.headers.get("xypher-api-key");
    if (!apiKey) return withCors({ error: "Missing API key" }, 401);

    const { userId, error } = await verifyApiKey(apiKey);
    if (error || !userId) return withCors({ error: error || "Unauthorized", code: "INVALID_API_KEY" }, 403);

    const safeUserId = userId ?? undefined;

    const membership = await db.membership.findUnique({ where: { userId: safeUserId } });
    if (!membership || membership.subscriptionStatus !== "active") {
      return withCors({ error: "User does not have an active subscription", code: "SUBSCRIPTION_INVALID" }, 403);
    }

    const { searchParams } = new URL(req.url);

    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(Math.max(parseInt(searchParams.get("limit") || "20", 10), 1), 100);
    const status = searchParams.get("status") || undefined;
    const search = searchParams.get("search") || undefined;

    const where: any = {
      newsLetterOwnerId: userId,
      ...(status && { status }),
      ...(search && {
        OR: [
          { email: { contains: search, mode: "insensitive" } },
          { source: { contains: search, mode: "insensitive" } },
        ],
      }),
    };

    const [total, subscribers] = await Promise.all([
      db.subscriber.count({ where }),
      db.subscriber.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        select: { id: true, email: true, name: true, source: true, status: true, createdAt: true, pageUrl: true },
      }),
    ]);

    return withCors({
      success: true,
      data: subscribers,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err: any) {
    console.error("GET /subscribers error:", err);
    return withCors({ error: "Internal Server Error", code: "SERVER_ERROR" }, 500);
  }
}
