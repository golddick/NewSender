


// // src/actions/get.email.trends.ts
// "use server";
// import { connectDb } from "@/shared/libs/db";
// import Campaign from "@/models/newsLetterCampaign.model";

// interface TrendItem {
//   date: string;
//   total: number;
//   opened: number;
//   clicked: number;
// }

// export const getEmailTrendsByDate = async (newsLetterOwnerId: string): Promise<TrendItem[]> => {

//   if (!newsLetterOwnerId) {
//     throw new Error("Missing newsletter owner ID");
//   }

//   await connectDb();

//   const last30Days = new Date();
//   last30Days.setDate(last30Days.getDate() - 30);

//   const campaigns = await Campaign.find({
//     createdAt: { $gte: last30Days },
//     newsLetterOwnerId,
//   }).lean();

//   const trendsMap = new Map<string, TrendItem>();

//   for (const campaign of campaigns) {
//     const createdAt = new Date(campaign.createdAt);
//     const dateKey = `${createdAt.getDate()}/${createdAt.getMonth() + 1}/${createdAt.getFullYear()}`;

//     if (!trendsMap.has(dateKey)) {
//       trendsMap.set(dateKey, {
//         date: dateKey,
//         total: 0,
//         opened: 0,
//         clicked: 0,
//       });
//     }

//     const entry = trendsMap.get(dateKey)!;
//     entry.total += campaign.emailsSent ?? 0;
//     entry.opened += campaign.emailsOpened ?? 0;
//     entry.clicked += campaign.emailsClicked ?? 0;
//   }

//   return Array.from(trendsMap.values()).sort((a, b) =>
//     new Date(a.date).getTime() - new Date(b.date).getTime()
//   );
// };



// src/actions/get.email.trends.ts
"use server";

import { db } from "@/shared/libs/database";
import { subDays, format } from "date-fns";

interface TrendItem {
  date: string;
  total: number;
  opened: number;
  clicked: number;
}

export const getEmailTrendsByDate = async (newsLetterOwnerId: string): Promise<TrendItem[]> => {
  if (!newsLetterOwnerId) throw new Error("Missing newsletter owner ID");

  const last30Days = subDays(new Date(), 30);

  // Get all emails sent by user in last 30 days
  const emails = await db.email.findMany({
    where: {
      newsLetterOwnerId,
      sentAt: { gte: last30Days },
    },
    select: {
      sentAt: true,
      openCount: true,
      clickCount: true,
    },
  });

  const trendsMap = new Map<string, TrendItem>();

  for (const email of emails) {
    const dateKey = format(email.sentAt!, "yyyy-MM-dd");

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
    entry.opened += email.openCount;
    entry.clicked += email.clickCount;
  }

  return Array.from(trendsMap.values()).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
};
