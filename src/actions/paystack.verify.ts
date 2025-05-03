"use server";

import axios from "axios";
import { connectDb } from "@/shared/libs/db";
import Membership from "@/models/membership.model";

export const verifyPaystackPayment = async (reference: string) => {
  try {
    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
    if (!paystackSecret) {
      throw new Error("Payment system not configured");
    }

    // Verify payment with Paystack
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${paystackSecret}`,
        },
      }
    );

    if (response.data.data.status !== "success") {
      throw new Error("Payment not successful");
    }

    // Update user membership
    await connectDb();
    const metadata = response.data.data.metadata;
    
    await Membership.updateOne(
      { userId: metadata.userId },
      {
        plan: metadata.planName,
        subscriptionStatus: "active",
        paystackSubscriptionId: response.data.data.subscription_code,
        currentPeriodEnd: new Date(response.data.data.paid_at),
      }
    );

    return { success: true };
  } catch (error: any) {
    console.error("Verification Error:", error);
    throw new Error(
      error.response?.data?.message || "Payment verification failed"
    );
  }
};