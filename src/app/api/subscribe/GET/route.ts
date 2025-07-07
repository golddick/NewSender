import { NextRequest, NextResponse } from "next/server";
import { db } from "@/shared/libs/database"; // Prisma client
import { verifyApiKey } from "@/lib/sharedApi/auth";

export async function GET(req: NextRequest) {
  const apiKey = req.headers.get("TheNews-api-key");
  const { userId, error } = await verifyApiKey(apiKey);
  if (error) return error;

  // ✅ Check for active membership subscription
  const membership = await db.membership.findUnique({
    where: { userId },
  });

  if (!membership || membership.subscriptionStatus !== "active") {
    return NextResponse.json(
      { error: "User does not have an active subscription." },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(Math.max(parseInt(searchParams.get("limit") || "20", 10), 1), 100);
  const status = searchParams.get("status");
  const search = searchParams.get("search");

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
}
