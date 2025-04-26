// src/actions/get.email.trends.ts
"use server";
import Email from "@/models/email.model";
import { connectDb } from "@/shared/libs/db";

interface TrendItem {
  date: string;
  total: number;
  opened: number;
  clicked: number;
}

export const getEmailTrendsByDate = async (): Promise<TrendItem[]> => {
  await connectDb();

  const last30Days = new Date();
  last30Days.setDate(last30Days.getDate() - 30);

  const emails = await Email.find({
    createdAt: { $gte: last30Days },
  }).lean();

  // Group emails by date (e.g., "21/04/2025")
  const trendsMap = new Map<string, TrendItem>();

  for (const email of emails) {
    const createdAt = new Date(email.createdAt);
    const dateKey = `${createdAt.getDate()}/${createdAt.getMonth() + 1}/${createdAt.getFullYear()}`;

    if (!trendsMap.has(dateKey)) {
      trendsMap.set(dateKey, {
        date: dateKey,
        total: 0,
        opened: 0,
        clicked: 0,
      });
    }

    const entry = trendsMap.get(dateKey)!;
    entry.total += 1;
    if (email.isOpened) entry.opened += 1;
    if (email.isClicked) entry.clicked += 1;
  }

  return Array.from(trendsMap.values()).sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
};
