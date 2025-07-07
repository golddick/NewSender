

// import { Document, Model } from "mongoose";

import { db } from "../libs/database";



// interface StatusCount {
//   Subscribed: number;
//   Unsubscribed: number;
// }

// interface MonthData {
//   month: string;
//   counts: StatusCount;
// }

// export async function generateAnalyticsData<T extends Document>(
//   model: Model<T>,
//   ownerId: string
// ): Promise<{ last7Months: MonthData[] }> {
//   const last7Months: MonthData[] = [];
//   const currentDate = new Date();
//   currentDate.setDate(currentDate.getDate() + 1);

//   for (let i = 6; i >= 0; i--) {
//     const endDate = new Date(
//       currentDate.getFullYear(),
//       currentDate.getMonth(),
//       currentDate.getDate() - i * 28
//     );

//     const startDate = new Date(
//       endDate.getFullYear(),
//       endDate.getMonth(),
//       endDate.getDate() - 28
//     );

//     const monthLabel = endDate.toLocaleString("default", {
//       month: "short",
//       year: "numeric",
//     });

//     // Use regular queries instead of aggregation
//     const subscribedCount = await model.countDocuments({
//       newsLetterOwnerId: ownerId,
//       status: "Subscribed",
//       createdAt: { $gte: startDate, $lt: endDate }
//     });

//     const unsubscribedCount = await model.countDocuments({
//       newsLetterOwnerId: ownerId,
//       status: "Unsubscribed",
//       createdAt: { $gte: startDate, $lt: endDate }
//     });

//     last7Months.push({
//       month: monthLabel,
//       counts: {
//         Subscribed: subscribedCount,
//         Unsubscribed: unsubscribedCount
//       }
//     });
//   }

//   return { last7Months };
// }





interface StatusCount {
  Subscribed: number;
  Unsubscribed: number;
}

interface MonthData {
  month: string;
  counts: StatusCount;
}

export async function generateAnalyticsData(
  ownerId: string
): Promise<{ last7Months: MonthData[] }> {
  const last7Months: MonthData[] = [];
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 1);

  for (let i = 6; i >= 0; i--) {
    const endDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() - i * 28
    );

    const startDate = new Date(
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate() - 28
    );

    const monthLabel = endDate.toLocaleString("default", {
      month: "short",
      year: "numeric",
    });

    // Get subscribed count
    const subscribedCount = await db.subscriber.count({
      where: {
        newsLetterOwnerId: ownerId,
        status: "Subscribed",
        createdAt: {
          gte: startDate,
          lt: endDate,
        },
      },
    });

    console.log(subscribedCount, 'Subscribed count'  );

    // Get unsubscribed count
    const unsubscribedCount = await db.subscriber.count({
      where: {
        newsLetterOwnerId: ownerId,
        status: "Unsubscribed",
        createdAt: {
          gte: startDate,
          lt: endDate,
        },
      },
    });


    last7Months.push({
      month: monthLabel,
      counts: {
        Subscribed: subscribedCount,
        Unsubscribed: unsubscribedCount,
      },
    });
  }

  return { last7Months };
}