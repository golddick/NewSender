'use server';

import { PLAN_CONFIG } from '@/lib/planLimit';
import { db } from '@/shared/libs/database';
import { currentUser } from '@clerk/nextjs/server';
import axios from 'axios';

export const paystackSubscribe = async ({
  planName,
  billingCycle,
  userId,
}: {
  planName: keyof typeof PLAN_CONFIG;
  billingCycle: "monthly" | "yearly";
  userId: string;
}) => {
  try {
    // 1. Get current user from Clerk
    const user = await currentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    // 2. Get user's email
    const email = user.emailAddresses.find(
      (email) => email.id === user.primaryEmailAddressId
    )?.emailAddress;

    if (!email) {
      throw new Error("User email not found");
    }

    // 3. Verify Paystack configuration
    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
    // const websiteUrl = process.env.NEXT_PUBLIC_WEBSITE_URL || 'http://localhost:3003';
    const websiteUrl = 'http://localhost:3003';

    if (!paystackSecret || !websiteUrl) {
      throw new Error("Payment system configuration error");
    }

    // 4. Get user membership using Prisma
    const membership = await db.membership.findUnique({
      where: { userId },
    });

    if (!membership?.paystackCustomerId) {
      throw new Error("User payment profile not set up");
    }

    // 5. Verify plan exists with billing cycle
    const planConfig = PLAN_CONFIG[planName]?.[billingCycle];
    if (!planConfig) {
      throw new Error("Invalid subscription plan or billing cycle");
    }

    // 6. Initialize transaction with Paystack
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: planConfig.amount * 100, // Convert to kobo
        plan: planConfig.id,
        metadata: {
          userId,
          planName,
          planCode: planConfig.id,
          billingCycle,
        },
        callback_url: `${websiteUrl}/success`,
      },
      {
        headers: {
          Authorization: `Bearer ${paystackSecret}`,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    if (!response.data?.status || !response.data.data?.authorization_url) {
      throw new Error("Payment gateway returned invalid response");
    }

    return response.data.data.authorization_url;

  } catch (error: unknown) {
    console.error("Paystack Error:", error);

    let errorMessage = "Failed to initialize payment. Please try again later.";

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.message || error.message;
    }

    throw new Error(errorMessage);
  }
};




// import { NextResponse } from "next/server";
// import { db } from "@/shared/libs/database";
// import { PLAN_CONFIG } from "@/lib/planLimit";
// import { headers } from "next/headers";
// import crypto from "crypto";
// import { Plan } from "@prisma/client";

// export async function POST(req: Request) {
//   try {
//     const secret = process.env.PAYSTACK_SECRET_KEY!;
//     const rawBody = await req.text();
//   const reqHeaders = await headers();
//     const signature = reqHeaders.get("x-paystack-signature");

//     // 1️⃣ Verify signature
//     const hash = crypto
//       .createHmac("sha512", secret)
//       .update(rawBody)
//       .digest("hex");

//     if (hash !== signature) {
//       return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
//     }

//     const event = JSON.parse(rawBody);

//     // 2️⃣ Handle subscription payment success
//     if (event.event === "charge.success" || event.event === "subscription.create") {
//       const { metadata, plan, amount, customer } = event.data;
//       const userId = metadata?.userId;
//       const planCode = plan?.plan_code;

//       if (!userId || !planCode) {
//         return NextResponse.json({ error: "Invalid webhook payload" }, { status: 400 });
//       }

//       // 3️⃣ Match plan in PLAN_CONFIG by ID
//       let selectedPlan: { name: string; billingCycle: "monthly" | "yearly"; amount: number } | null = null;

//       for (const [planName, planConfig] of Object.entries(PLAN_CONFIG)) {
//         if (planConfig.monthly.id === planCode) {
//           selectedPlan = { name: planName, billingCycle: "monthly", amount: planConfig.monthly.amount };
//           break;
//         }
//         if (planConfig.yearly.id === planCode) {
//           selectedPlan = { name: planName, billingCycle: "yearly", amount: planConfig.yearly.amount };
//           break;
//         }
//       }

//       if (!selectedPlan) {
//         return NextResponse.json({ error: "Plan not found" }, { status: 400 });
//       }

//       // 4️⃣ Update membership
//       await db.membership.update({
//         where: { userId },
//         data: {
//           plan: selectedPlan.name as Plan,
//           amount: selectedPlan.amount,
//           subscriptionStatus: "active",
//           currentPeriodEnd: new Date(Date.now() + (selectedPlan.billingCycle === "yearly" ? 365 : 30) * 24 * 60 * 60 * 1000),
//           nextPaymentDate: new Date(Date.now() + (selectedPlan.billingCycle === "yearly" ? 365 : 30) * 24 * 60 * 60 * 1000),
//         },
//       });

//       // 5️⃣ Save invoice
//       await db.invoice.create({
//         data: {
//           userId,
//           description: `${selectedPlan.name} Plan - ${selectedPlan.billingCycle}`,
//           amount,
//           status: "paid",
//           invoiceUrl: event.data.authorization?.receipt_url || "",
//           date: new Date(),
//         },
//       });
//     }

//     return NextResponse.json({ success: true });
//   } catch (error: any) {
//     console.error("Paystack Webhook Error:", error);
//     return NextResponse.json({ error: error.message || "Webhook failed" }, { status: 500 });
//   }
// }
