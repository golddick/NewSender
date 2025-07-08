'use server';

import { db } from "@/shared/libs/database";
import axios from "axios";

interface PaymentVerificationResult {
  success: boolean;
  message?: string;
  data?: {
    amount: number;
    currency: string;
    plan: string;
    subscriptionId?: string;
  };
}

interface PlanLimits {
  appIntegratedLimit: number;
  campaignLimit: number;
  emailLimit: number;
  subscriberLimit: number;
}

const PLAN_LIMITS = {
  FREE: {
    appIntegratedLimit: 2,
    campaignLimit: 3,
    emailLimit: 5,
    subscriberLimit: 500,
  },
  LAUNCH: {
    appIntegratedLimit: 2,
    campaignLimit: 5,
    emailLimit: 20,
    subscriberLimit: 2000,
  },
  SCALE: {
    appIntegratedLimit: 5,
    campaignLimit: 10,
    emailLimit: 50,
    subscriberLimit: 10000,
  },
} as const;

type PlanName = keyof typeof PLAN_LIMITS;

export const verifyPaystackPayment = async (
  reference: string
): Promise<PaymentVerificationResult> => {
  try {
    console.log("🔍 Verifying Paystack transaction:", reference);

    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
    if (!paystackSecret) {
      throw new Error("Missing Paystack secret key");
    }

    // Verify transaction with Paystack
    const verificationResponse = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${paystackSecret}`,
        },
        timeout: 10000,
      }
    );

    const transaction = verificationResponse.data.data;

    if (transaction.status !== "success") {
      throw new Error("Transaction is not successful");
    }

    const {
      metadata,
      customer,
      plan,
      amount,
      currency,
      authorization,
      subscription_code,
      paid_at
    } = transaction;

    if (!metadata?.userId || !customer?.customer_code) {
      throw new Error("Missing metadata.userId or customer.customer_code");
    }

    const userId = metadata.userId;
    const customerCode = customer.customer_code;
    const planName = (metadata.planName || plan?.name || "FREE").toUpperCase() as PlanName;
    const fallbackPlanCode = metadata?.planCode || plan?.plan_code;
    const authorizationCode = authorization?.authorization_code;

    let subscriptionCode = subscription_code;

    console.log("✅ Payment verified:", {
      status: transaction.status,
      customerCode,
      planCode: fallbackPlanCode,
      subscriptionCode,
      authorizationCode,
    });

    // Create subscription if missing
    if (!subscriptionCode && authorizationCode && fallbackPlanCode) {
      console.log("⚠️ No subscription_code found. Creating subscription...");

      const subRes = await axios.post(
        "https://api.paystack.co/subscription",
        {
          customer: customerCode,
          plan: fallbackPlanCode,
          authorization: authorizationCode,
        },
        {
          headers: {
            Authorization: `Bearer ${paystackSecret}`,
            "Content-Type": "application/json",
          },
        }
      );

      subscriptionCode = subRes.data?.data?.subscription_code;
      if (!subscriptionCode) {
        throw new Error("Failed to create subscription");
      }
      console.log("📦 Subscription created:", { subscriptionCode });
    }

    // Get plan limits
    const limits = PLAN_LIMITS[planName] || PLAN_LIMITS.FREE;
    const planAmount = amount / 100;
    const planCurrency = currency || "NGN";

    // Update membership with Prisma
    const updatedMembership = await db.membership.upsert({
      where: { userId },
      update: {
        plan: planName,
        email: customer.email,
        role: planName === "FREE" ? "USER" : "NEWSLETTEROWNER",
        subscriptionStatus: "active",
        paystackCustomerId: customerCode,
        paystackSubscriptionId: subscriptionCode,
        currentPeriodEnd: new Date(paid_at),
        amount: planAmount,
        currency: planCurrency,
        lastPaymentDate: new Date(),
        ...limits
      },
      create: {
        userId,
        email: customer.email,
        plan: planName,
        role: planName === "FREE" ? "USER" : "NEWSLETTEROWNER",
        subscriptionStatus: "active",
        paystackCustomerId: customerCode,
        paystackSubscriptionId: subscriptionCode,
        currentPeriodEnd: new Date(paid_at),
        amount: planAmount,
        currency: planCurrency,
        lastPaymentDate: new Date(),
        ...limits
      }
    });

    console.log("✅ Membership updated:", updatedMembership);

    return {
      success: true,
      data: {
        amount: planAmount,
        currency: planCurrency,
        plan: planName,
        subscriptionId: subscriptionCode,
      },
    };
  } catch (error: unknown) {
    console.error("❌ Payment verification failed:", error);

    let errorMessage = "Payment verification failed. Please try again.";
    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.message || error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      success: false,
      message: errorMessage,
    };
  }
};