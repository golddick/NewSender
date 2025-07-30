"use server"

import { PLAN_CONFIG, planDetails } from "@/lib/planLimit";
import { db } from "@/shared/libs/database";
import { currentUser } from "@clerk/nextjs/server";
import { Plan, PlanSubscriptionStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

// Get current user's subscription details
export async function getCurrentSubscription() {
  const user = await currentUser();
  if (!user) {
    return { success: false, error: "You must be logged in to view subscription" };
  }

  const membership = await db.membership.findUnique({
    where: { userId: user.id },
    select: {
      plan: true,
      subscriptionStatus: true,
      currentPeriodEnd: true,
      nextPaymentDate: true,
      amount: true,
      currency: true,
      subscriberLimit: true,
      emailLimit: true,
      campaignLimit: true,
      appIntegratedLimit: true,
      blogPostLimit: true,
      aiGenerationLimit: true,
    },
  });

  if (!membership) {
    return { success: false, error: "No subscription found" };
  }

  return membership;
}

// Get current usage statistics
export async function getUsageStats() {
  const user = await currentUser();
  if (!user) {
    return { success: false, error: "You must be logged in to view usage" };
  }

  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format

  return await db.membershipUsage.findFirst({
    where: { userId: user.id, month: currentMonth },
    select: {
      emailsSent: true,
      subscribersAdded: true,
      campaignsCreated: true,
      appIntegrated: true,
      blogPostsCreated: true,
      aiGenerationsUsed: true,
    },
  });
}

// Change subscription plan (Paystack integrated)
// export async function changePlan(planId: keyof typeof PLAN_CONFIG) {
//   const user = await currentUser();
//   if (!user) {
//     return { success: false, error: "You must be logged in to change your plan" };
//   }

//   const selectedPlan = PLAN_CONFIG[planId];
//   if (!selectedPlan) {
//     return { success: false, error: "Invalid plan selected" };
//   }

//   const planName = selectedPlan.name as Plan;
//   const planInfo = planDetails[planName];

//   if (!planInfo) {
//     return { success: false, error: "Plan configuration not found" };
//   }

//   // Update membership with selected plan details
//   await db.membership.update({
//     where: { userId: user.id },
//     data: {
//       plan: planId, // ✅ store Paystack planId instead of object
//       amount: planInfo.amount,
//       subscriberLimit: planInfo.subscriberLimit,
//       emailLimit: planInfo.emailLimit,
//       campaignLimit: planInfo.campaignLimit,
//       appIntegratedLimit: planInfo.appIntegratedLimit,
//       blogPostLimit: planInfo.blogPostLimit,
//       aiGenerationLimit: planInfo.aiGenerationLimit,
//     },
//   });

//   revalidatePath("/dashboard/settings/");
//   return { success: true };
// }



// Downgrade to Free plan

export async function downgradeToFreePlan(userId: string) {
  try {
    await db.membership.update({
      where: { userId },
      data: {
        plan: "FREE",
        subscriptionStatus: "inactive",
        amount: 0,
        subscriberLimit: 500,
        emailLimit: 2,
        campaignLimit: 1,
        appIntegratedLimit: 0,
        blogPostLimit: 0,
        aiGenerationLimit: 0,
        nextPaymentDate: null,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to downgrade:", error);
    return { success: false, error: "Unable to downgrade to Free plan" };
  }
}


// Cancel subscription
export async function cancelSubscription() {
  const user = await currentUser();
  if (!user) {
    return { success: false, error: "You must be logged in to cancel subscription" };
  }

  await db.membership.update({
    where: { userId: user.id },
    data: {
      subscriptionStatus: "cancelled",
      nextPaymentDate: null,
    },
  });

  revalidatePath("/dashboard/settings");
  return { success: true };
}

// Toggle auto-renewal
export async function toggleAutoRenew(autoRenew: boolean) {
  const user = await currentUser();
  if (!user) {
    return { success: false, error: "You must be logged in to change auto-renew" };
  }

  await db.membership.update({
    where: { userId: user.id },
    data: {
      subscriptionStatus: autoRenew ? "active" : "inactive",
    },
  });

  revalidatePath("/dashboard/settings");
  return { success: true };
}

// Get billing history
export async function getBillingHistory() {
  const user = await currentUser();
  if (!user) {
    return { success: false, error: "You must be logged in to view billing history" };
  }

  const invoices = await db.invoice.findMany({
    where: { userId: user.id },
    orderBy: { date: "desc" },
  });

  return invoices.map((invoice) => ({
    id: invoice.id,
    date: invoice.date.toISOString(),
    amount: invoice.amount,
    status: invoice.status,
    description: invoice.description,
    invoiceUrl: invoice.invoiceUrl,
  }));
}
