// import { db } from "@/shared/libs/database"
// import dayjs from "dayjs"

// type ActionKey = 
//   | "emailsSent"
//   | "subscribersAdded"
//   | "campaignsCreated"
//   | "appIntegrated"

// interface UsageResult {
//   success: boolean
//   message?: string
//   newCount?: number
// }

// export async function checkUsageLimit(userId: string, action: ActionKey): Promise<UsageResult> {
//   const currentMonth = dayjs().format("YYYY-MM")

//   try {
//     const membership = await db.membership.findUnique({
//       where: { userId }
//     })

//     if (!membership) {
//       return {
//         success: false,
//         message: "No active membership found"
//       }
//     }

//     const limitFieldMap: Record<ActionKey, keyof typeof membership> = {
//       emailsSent: "emailLimit",
//       subscribersAdded: "subscriberLimit",
//       campaignsCreated: "campaignLimit",
//       appIntegrated: "appIntegratedLimit"
//     }

//     const limitField = limitFieldMap[action]
//     const limit = membership[limitField]

//     if (limit === null || limit === undefined) {
//       return { success: true } // Unlimited
//     }

//     let usage = await db.membershipUsage.findUnique({
//       where: {
//         userId_month: {
//           userId,
//           month: currentMonth
//         }
//       }
//     })

//     if (!usage) {
//       usage = await db.membershipUsage.create({
//         data: {
//           userId,
//           month: currentMonth,
//           emailsSent: 0,
//           subscribersAdded: 0,
//           campaignsCreated: 0,
//           appIntegrated: 0
//         }
//       })
//     }

//     const currentCount = usage[action] || 0

//     const numericLimit = typeof limit === "number" ? limit : Number(limit)
//     if (currentCount >= numericLimit) {
//       return {
//         success: false,
//         message: `You've reached your monthly limit of ${numericLimit} for ${action}.`
//       }
//     }

//     return { success: true }

//   } catch (error) {
//     console.error("Usage check failed:", error)
//     return {
//       success: false,
//       message: "Failed to check usage limits"
//     }
//   }
// }

// export async function incrementUsage(
//   userId: string,
//   action: ActionKey,
//   incrementBy: number = 1
// ): Promise<UsageResult> {
//   const currentMonth = dayjs().format("YYYY-MM")

//   try {
//     let usage = await db.membershipUsage.findUnique({
//       where: {
//         userId_month: {
//           userId,
//           month: currentMonth
//         }
//       }
//     })

//     if (!usage) {
//       usage = await db.membershipUsage.create({
//         data: {
//           userId,
//           month: currentMonth,
//           emailsSent: 0,
//           subscribersAdded: 0,
//           campaignsCreated: 0,
//           appIntegrated: 0
//         }
//       })
//     }

//     const updatedUsage = await db.membershipUsage.update({
//       where: { id: usage.id },
//       data: {
//         [action]: (usage[action] || 0) + incrementBy
//       }
//     })

//     return {
//       success: true,
//       newCount: updatedUsage[action]
//     }
//   } catch (error) {
//     console.error("Failed to increment usage:", error)
//     return {
//       success: false,
//       message: "Failed to track usage"
//     }
//   }
// }




import { db } from "@/shared/libs/database";
import dayjs from "dayjs";

// 👇 Action keys match your MembershipUsage schema
type ActionKey = 
  | "emailsSent"
  | "subscribersAdded"
  | "campaignsCreated"
  | "appIntegrated";

interface UsageResult {
  success: boolean;
  message?: string;
  newCount?: number;
}

// ✅ Helper to generate current month key (e.g. "2025-07")
function getCurrentMonthKey(): string {
  return dayjs().format("YYYY-MM");
}

// ✅ Check if user is within limit
export async function checkUsageLimit(userId: string, action: ActionKey): Promise<UsageResult> {
  const currentMonth = getCurrentMonthKey();

  try {
    const membership = await db.membership.findUnique({
      where: { userId }
    });

    if (!membership) {
      return {
        success: false,
        message: "No active membership found"
      };
    }

    const limitFieldMap: Record<ActionKey, keyof typeof membership> = {
      emailsSent: "emailLimit",
      subscribersAdded: "subscriberLimit",
      campaignsCreated: "campaignLimit",
      appIntegrated: "appIntegratedLimit"
    };

    const limitField = limitFieldMap[action];
    const limit = membership[limitField];

    if (limit === null || limit === undefined) {
      return { success: true }; // Unlimited
    }

    let usage = await db.membershipUsage.findUnique({
      where: {
        userId_month: {
          userId,
          month: currentMonth
        }
      }
    });

    if (!usage) {
      usage = await db.membershipUsage.create({
        data: {
          userId,
          month: currentMonth,
          emailsSent: 0,
          subscribersAdded: 0,
          campaignsCreated: 0,
          appIntegrated: 0
        }
      });
    }

    const currentCount = usage[action] || 0;
    const numericLimit = typeof limit === "number" ? limit : Number(limit);

    if (currentCount >= numericLimit) {
      return {
        success: false,
        message: `You've reached your monthly limit of ${numericLimit} for ${action}.`
      };
    }

    return { success: true };

  } catch (error) {
    console.error("Usage check failed:", error);
    return {
      success: false,
      message: "Failed to check usage limits"
    };
  }
}

// ✅ Increment user usage by 1 (or custom)
export async function incrementUsage(
  userId: string,
  action: ActionKey,
  incrementBy: number = 1
): Promise<UsageResult> {
  const currentMonth = getCurrentMonthKey();

  try {
    let usage = await db.membershipUsage.findUnique({
      where: {
        userId_month: {
          userId,
          month: currentMonth
        }
      }
    });

    if (!usage) {
      usage = await db.membershipUsage.create({
        data: {
          userId,
          month: currentMonth,
          emailsSent: 0,
          subscribersAdded: 0,
          campaignsCreated: 0,
          appIntegrated: 0
        }
      });
    }

    const updatedUsage = await db.membershipUsage.update({
      where: { id: usage.id },
      data: {
        [action]: (usage[action] || 0) + incrementBy
      }
    });

    return {
      success: true,
      newCount: updatedUsage[action]
    };
  } catch (error) {
    console.error("Failed to increment usage:", error);
    return {
      success: false,
      message: "Failed to track usage"
    };
  }
}

// ✅ Decrement subscriber count when user unsubscribes
export async function decrementSubscriberUsage(userId: string, count: number = 1) {
  const month = getCurrentMonthKey();

  try {
    await db.membershipUsage.updateMany({
      where: {
        userId,
        month
      },
      data: {
        subscribersAdded: {
          decrement: count
        }
      }
    });
  } catch (error) {
    console.error("Failed to decrement subscriber usage:", error);
  }
}
