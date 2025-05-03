"use server";

import Membership from "@/models/membership.model";
import { connectDb } from "@/shared/libs/db";
import { currentUser } from "@clerk/nextjs/server";

export const addPaystack = async () => {
  try {
    await connectDb();

    const user = await currentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const existingMembership = await Membership.findOne({ userId: user.id });
    if (existingMembership?.paystackCustomerId) {
      console.log("Membership already exists:", existingMembership);
      return {
        success: true,
        message: "Membership already exists",
        paystackCustomerId: existingMembership.paystackCustomerId,
      };
    }

    const email = user.emailAddresses?.[0]?.emailAddress;
    if (!email) {
      throw new Error("User email not found");
    }

    const response = await fetch("https://api.paystack.co/customer", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        first_name: user.firstName || "",
        last_name: user.lastName || "",
        metadata: {
          clerkUserId: user.id,
        },
      }),
    });

    const data = await response.json();
    if (!data.status || !data.data) {
      throw new Error(data.message || "Paystack customer creation failed");
    }

    const paystackCustomer = data.data;

    const membershipData = {
      userId: user.id,
      paystackCustomerId: paystackCustomer.customer_code,
      email: email,
      plan: "FREE",
      subscriptionStatus: "inactive",
    };

    let result;
    if (existingMembership) {
      result = await Membership.updateOne({ userId: user.id }, { $set: membershipData });
    } else {
      result = await Membership.create(membershipData);
    }

    // ✅ Final log after successful DB operation
    console.log("Membership saved or updated:", result);

    return {
      success: true,
      message: "Paystack integration completed",
      paystackCustomerId: paystackCustomer.customer_code,
    };

  } catch (error: any) {
    console.error("Paystack integration error:", error);
    return {
      success: false,
      error: error.message || "Failed to integrate with Paystack",
    };
  }
};
