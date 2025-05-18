import MembershipUsage from "@/models/membershipUsage.model";
import Membership from "@/models/membership.model";
import dayjs from "dayjs";
import mongoose from "mongoose";

// Define the action keys that match the membership limits
type ActionKey = 
  | "emailsSent"
  | "subscribersAdded"
  | "campaignsCreated"
  | "categoriesCreated";

// Map action keys to membership limit fields
interface IMembership {
  emailLimit?: number;
  subscriberLimit?: number;
  campaignLimit?: number;
  categoryLimit?: number;
}

const ACTION_TO_LIMIT_MAP: Record<ActionKey, keyof IMembership> = {
  emailsSent: "emailLimit",
  subscribersAdded: "subscriberLimit",
  campaignsCreated: "campaignLimit",
  categoriesCreated: "categoryLimit"
};

/**
 * Checks whether a user can perform a given action this month.
 * Does NOT increment usage.
 */
export async function checkUsageLimit(userId: string, action: ActionKey) {
  const currentMonth = dayjs().format("YYYY-MM");

  try {
    const membership = await Membership.findOne({ userId });
    if (!membership) {
      return {
        success: false,
        message: "No active membership found for this user."
      };
    }

    const limitField = ACTION_TO_LIMIT_MAP[action];
    const limitValue = membership[limitField];

    if (limitValue == null) {
      return { success: true }; // No limit for this action
    }

    let usage = await MembershipUsage.findOne({ userId, month: currentMonth });
    if (!usage) {
      usage = await MembershipUsage.create({
        userId,
        month: currentMonth,
        emailsSent: 0,
        subscribersAdded: 0,
        campaignsCreated: 0,
        categoriesCreated: 0,
      });
    }

    const currentCount = usage[action] ?? 0;

    if (currentCount >= limitValue) {
      return {
        success: false,
        message: `You have reached your monthly limit of ${limitValue} ${action.replace(/([A-Z])/g, ' $1').toLowerCase()}.`
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Error checking usage limit:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to check usage limit."
    };
  }
}

/**
 * Increments the usage count for a specific action after successful operation.
 * Now supports optional incrementBy parameter with proper TypeScript typing.
 */
export async function incrementUsage(
  userId: string, 
  action: ActionKey,
  incrementBy: number = 1
) {
  const currentMonth = dayjs().format("YYYY-MM");

  try {
    let usage = await MembershipUsage.findOne({ userId, month: currentMonth });
    if (!usage) {
      usage = await MembershipUsage.create({
        userId,
        month: currentMonth,
        emailsSent: 0,
        subscribersAdded: 0,
        campaignsCreated: 0,
        categoriesCreated: 0,
      });
    }

    usage[action] = (usage[action] ?? 0) + incrementBy;
    await usage.save();

    return { 
      success: true,
      newCount: usage[action]
    };
  } catch (error) {
    console.error("Error incrementing usage:", {
      error: error instanceof Error ? error.message : "Unknown error",
      userId,
      action,
      incrementBy,
      timestamp: new Date().toISOString()
    });
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to increment usage."
    };
  }
}

// Update the sendEmail function call to use the new signature:
// await incrementUsage(formData.newsLetterOwnerId, "emailsSent", formData.userEmail.length);