"use server";

import axios from "axios";
import { connectDb } from "@/shared/libs/db";
import Membership from "@/models/membership.model";

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
  categoryLimit: number;
  campaignLimit: number ;
  emailLimit: number;
  subscriberLimit: number;
}

const PLAN_LIMITS: Record<"FREE" | "LUNCH" | "SCALE", PlanLimits> = {
  FREE: {
    categoryLimit: 1,
    campaignLimit: 1,
    emailLimit: 2,
    subscriberLimit: 500,
  },
  LUNCH: {
    categoryLimit: 2,
    campaignLimit: 5,
    emailLimit: 10,
    subscriberLimit: 2000,
  },
  SCALE: {
    categoryLimit: 5,
    campaignLimit: 10,
    emailLimit: 50,
    subscriberLimit: 10000,
  },
};

export const verifyPaystackPayment = async (
  reference: string
): Promise<PaymentVerificationResult> => {
  try {
    console.log("🔍 Verifying Paystack transaction:", reference);

    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
    if (!paystackSecret) {
      throw new Error("Missing Paystack secret key");
    }

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
    } = transaction;

    if (!metadata?.userId || !customer?.customer_code) {
      throw new Error("Missing metadata.userId or customer.customer_code");
    }

    const userId = metadata.userId;
    const customerCode = customer.customer_code;
    const planName = (metadata.planName || plan?.name || "FREE").toUpperCase() as
      | "FREE"
      | "LUNCH"
      | "SCALE";
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

    // Attempt to create subscription if missing
    if (!subscriptionCode && authorizationCode && fallbackPlanCode) {
      console.log("⚠️ No subscription_code found. Attempting to create subscription manually...");

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
        throw new Error("Failed to create subscription: No subscription_code returned.");
      }

      console.log("📦 Subscription created manually:", { subscriptionCode });
    }

    // Use shared plan limits
    const limits = PLAN_LIMITS[planName] || PLAN_LIMITS.FREE;

    const planAmount = amount / 100;
    const planCurrency = currency || "NGN";

    await connectDb();
    console.log("🔗 Connected to DB");

    const updateResult = await Membership.findOneAndUpdate(
      { userId },
      {
        $set: {
          plan: planName,
          role: planName === "FREE" ? "USER" : "NEWSLETTEROWNER",
          subscriptionStatus: "active",
          paystackCustomerId: customerCode,
          paystackSubscriptionId: subscriptionCode,
          currentPeriodEnd: new Date(transaction.paid_at),
          amount: planAmount,
          currency: planCurrency,
          lastPaymentDate: new Date(),
          subscriberLimit: limits.subscriberLimit,
          emailLimit: limits.emailLimit,
          campaignLimit:limits.campaignLimit,
          categoryLimit: limits.categoryLimit,
        },
      },
      { upsert: true, new: true }
    );

    console.log("✅ Membership updated:", {
      userId,
      subscriptionCode,
      plan: planName,
      limits,
    });

    return {
      success: true,
      data: {
        amount: planAmount,
        currency: planCurrency,
        plan: planName,
        subscriptionId: subscriptionCode,
      },
    };
  } catch (error: any) {
    console.error("❌ Payment verification failed:", {
      error: error.response?.data || error.message,
      reference,
    });

    return {
      success: false,
      message:
        error.response?.data?.message || "Payment verification failed. Please try again.",
    };
  }
};

