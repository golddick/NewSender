import { NextRequest, NextResponse } from "next/server";
import { db } from "@/shared/libs/database"; // Prisma client
import { verifyApiKey } from "@/lib/sharedApi/auth";

export async function GET(req: NextRequest) {
  try {
    // ✅ 1. Verify API key
    const apiKey = req.headers.get("xypher-api-key");
    if (!apiKey) {
      return NextResponse.json({ error: "Missing API key." }, { status: 401 });
    }

    const { userId, error } = await verifyApiKey(apiKey);
    if (error) {
      return NextResponse.json(error, { status: 401 });
    }

    // Normalize userId for Prisma
const safeUserId = userId ?? undefined;


    // ✅ 2. Validate active subscription
   const membership = await db.membership.findUnique({
      where: { userId:safeUserId },
      // select: { plan: true, currentPeriodEnd: true },
    });

    if (!membership || membership.subscriptionStatus !== "active") {
      return NextResponse.json(
        { error: "User does not have an active subscription." },
        { status: 403 }
      );
    }

    // ✅ 3. Handle query params safely
    const { searchParams } = new URL(req.url);

    const page = Math.max(
      1,
      parseInt(searchParams.get("page") || "1", 10)
    );
    const limit = Math.min(
      Math.max(parseInt(searchParams.get("limit") || "20", 10), 1),
      100
    );
    const status = searchParams.get("status") || undefined;
    const search = searchParams.get("search") || undefined;

    // ✅ 4. Build Prisma where clause
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

    // ✅ 5. Query in parallel
    const [total, subscribers] = await Promise.all([
      db.subscriber.count({ where }),
      db.subscriber.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          email: true,
          name: true,
          source: true,
          status: true,
          createdAt: true,
          pageUrl: true,
        },
      }),
    ]);

    // ✅ 6. Return success response
    return NextResponse.json({
      success: true,
      data: subscribers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err: any) {
    console.error("GET /subscribers error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
