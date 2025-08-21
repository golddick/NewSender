// "use server";

// import { db } from "@/shared/libs/database"; 
// import { currentUser } from "@clerk/nextjs/server";

// export async function getOverviewStats() {
//   const user = await currentUser();
//     if (!user) throw new Error("You must be logged in to access newsletter stats");
  
//     const userId = user.id;
  
//     // Check super admin role
//     const userInfo = await db.membership.findUnique({
//       where: { userId },
//       select: { role: true },
//     });
  
//   //   if (!userInfo || userInfo.role !== "THENEWSADMIN") {
//   //     throw new Error("Unauthorized: You must be a super admin");
//   //   }
  

//   // Fetch counts
//   const [totalUsers, activeNewsletters, totalKycApplications, totalBlogs, monthlyRevenue] =
//     await Promise.all([
//       db.membership.count(),
//       db.membership.count({ where: { role: "NEWSLETTEROWNER" } }),
//       db.kYC.count(), // Adjust model name if different
//       db.blogPost.count(),
//       db.invoice.aggregate({
//         _sum: { amount: true },
//         where: {
//           date: {
//             gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1), // Current month
//           },
//         },
//       }),
//     ]);

//   // Uptime - static or from monitoring service (for now hardcode 99.98)
//   const systemUptime = 99.98;

//   return {
//     totalUsers,
//     activeNewsletters,
//     totalKycApplications,
//     totalBlogs,
//     monthlyRevenue: monthlyRevenue._sum.amount || 0,
//     systemUptime,
//   };
// }


"use server";

import { db } from "@/shared/libs/database"; 
import { currentUser } from "@clerk/nextjs/server";

export async function getOverviewStats() {
  const user = await currentUser();
  if (!user) throw new Error("You must be logged in");

  const userId = user.id;

  const userInfo = await db.membership.findUnique({
    where: { userId },
    select: { role: true },
  });

  const [totalUsers, activeNewsletters, totalKycApplications, totalBlogs, monthlyRevenue] =
    await Promise.all([
      db.membership.count(),
      db.membership.count({ where: { role: "NEWSLETTEROWNER" } }),
      db.kYC.count(),
      db.blogPost.count(),
      db.invoice.aggregate({
        _sum: { amount: true },
        where: {
          date: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
    ]);

    console.log("Overview Stats:", {
        totalUsers,
        activeNewsletters,
        totalKycApplications,
        totalBlogs,
        monthlyRevenue: monthlyRevenue._sum.amount || 0,
    })

  return {
    totalUsers,
    activeNewsletters,
    totalKycApplications,
    totalBlogs,
    monthlyRevenue: monthlyRevenue._sum.amount || 0,
    systemUptime: 99.98,
  };
}
