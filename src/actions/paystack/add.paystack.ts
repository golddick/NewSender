

"use server";

import { db } from "@/shared/libs/database";
import { currentUser } from "@clerk/nextjs/server";
import { Plan, PlanSubscriptionStatus, SubscriptionStatus } from "@prisma/client";

export const addPaystack = async () => {
  try {
    const user = await currentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const userId = user.id;
    const email = user.emailAddresses?.[0]?.emailAddress;
    const fullName = user.firstName + " " + user.lastName;
    const userName = user.username
    const imageUrl = user.imageUrl
    if (!email) {
      throw new Error("User email not found");
    }

    const existingMembership = await db.membership.findUnique({
      where: { userId }
    });

    const currentMonth = new Date().toISOString().slice(0, 7);

    if (existingMembership?.paystackCustomerId) {
      await db.membershipUsage.upsert({
        where: {
          userId_month: {
            userId,
            month: currentMonth
          }
        },
        create: {
          userId,
          month: currentMonth,
          emailsSent: 0,
          subscribersAdded: 0,
          campaignsCreated: 0,
        },
        update: {}
      });

      return {
        success: true,
        message: "Membership already exists",
        paystackCustomerId: existingMembership.paystackCustomerId,
      };
    }

    // Create Paystack customer
    const response = await fetch("https://api.paystack.co/customer", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        first_name: user.firstName || "",
        last_name: user.lastName || "",
        metadata: {
          clerkUserId: userId,
        },
      }),
    });

    const data = await response.json();

    if (!data.status || !data.data) {
      throw new Error(data.message || "Paystack customer creation failed");
    }

    const paystackCustomer = data.data;

    const membershipData = {
      userId,
      paystackCustomerId: paystackCustomer.customer_code,
      email,
      fullName:fullName,
      imageUrl:imageUrl,
      userName:userName || '',
      plan: Plan.FREE,
      subscriptionStatus: PlanSubscriptionStatus.inactive,
      subscriberLimit: 500,
      emailLimit: 5,
      campaignLimit: 3,
    };

    await db.membership.upsert({
      where: { userId },
      create: membershipData,
      update: membershipData,
    });

    await db.membershipUsage.upsert({
      where: {
        userId_month: {
          userId,
          month: currentMonth
        }
      },
      create: {
        userId,
        month: currentMonth,
        emailsSent: 0,
        subscribersAdded: 0,
        campaignsCreated: 0,
      },
      update: {}
    });

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
