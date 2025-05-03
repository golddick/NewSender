"use server";

import { connectDb } from "@/shared/libs/db";
import axios from "axios";
import Membership from "@/models/membership.model";

type ManageSubscriptionResult =
  | { url: string }
  | { error: string };

export const managePaystackSubscription = async ({
  customerCode,
}: {
  customerCode: string | undefined;
}): Promise<ManageSubscriptionResult> => {
  // Validate input
  if (!customerCode) {
    console.error("No customer code provided");
    return { error: "No customer account found. Please contact support." };
  }

  // Validate environment configuration
  const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
  if (!paystackSecret) {
    console.error("PAYSTACK_SECRET_KEY is missing");
    return { error: "Payment system is currently unavailable. Please try again later." };
  }

  try {
    await connectDb();

    // Get user's membership with active subscription
    const membership = await Membership.findOne({ 
      paystackCustomerId: customerCode,
      subscriptionStatus: "active"
    });

    if (!membership?.paystackSubscriptionId) {
      console.warn(`No active subscription for customer: ${customerCode}`);
      return { error: "No active subscription found. You may need to upgrade first." };
    }

    // Get subscription details from Paystack
    const subscriptionResponse = await axios.get(
      `https://api.paystack.co/subscription/${membership.paystackSubscriptionId}`,
      {
        headers: {
          Authorization: `Bearer ${paystackSecret}`,
          "Content-Type": "application/json",
        },
        timeout: 10000, // 10 second timeout
      }
    );

    // Check if subscription management is available
    if (!subscriptionResponse.data?.data?.authorization?.authorization_url) {
      console.error("No authorization URL in Paystack response:", subscriptionResponse.data);
      return { error: "Subscription management is currently unavailable. Please try again later." };
    }

    // Return the management URL
    return { 
      url: subscriptionResponse.data.data.authorization.authorization_url 
    };

  } catch (error: any) {
    console.error("Subscription management failed:", {
      error: error.response?.data || error.message,
      stack: error.stack,
      customerCode
    });

    // Handle specific Paystack errors
    if (error.response?.data?.message?.includes("Invalid subscription")) {
      return { error: "Your subscription appears to be invalid. Please contact support." };
    }

    if (error.code === 'ECONNABORTED') {
      return { error: "Request timed out. Please try again." };
    }

    return { 
      error: error.response?.data?.message || 
      "We're having trouble accessing your subscription. Please try again or contact support." 
    };
  }
};