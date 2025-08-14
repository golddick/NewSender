// 'use server';

// import { PLAN_CONFIG } from '@/lib/planLimit';
// import { db } from '@/shared/libs/database';
// import { currentUser } from '@clerk/nextjs/server';
// import { KYCStatus } from '@prisma/client';
// import axios from 'axios';

// export const paystackSubscribe = async ({
//   planName,
//   billingCycle,
//   userId,
// }: {
//   planName: keyof typeof PLAN_CONFIG;
//   billingCycle: "monthly" | "yearly";
//   userId: string;
// }) => {
//   try {
//     // 1. Get current user from Clerk
//     const user = await currentUser();
//     if (!user) {
//       throw new Error("User not authenticated");
//     }

//     // 2. Get user's email
//     const email = user.emailAddresses.find(
//       (email) => email.id === user.primaryEmailAddressId
//     )?.emailAddress;

//     if (!email) {
//       throw new Error("User email not found");
//     }

//     // 3. Verify Paystack configuration
//     const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
//     const websiteUrl = process.env.NEXT_PUBLIC_WEBSITE_URL || 'http://localhost:3003';
//     // const websiteUrl = 'http://localhost:3003';

//     if (!paystackSecret || !websiteUrl) {
//       throw new Error("Payment system configuration error");
//     }

//     // 4. Get user membership using Prisma
//     const membership = await db.membership.findUnique({
//       where: { userId },
//     });

//     if (!membership) {
//       throw new Error("User membership not found");
//     }

//     if (membership.kycStatus !== KYCStatus.APPROVED) {
//       throw new Error("KYC verification is required before subscribing.");
//     }

//     if (!membership?.paystackCustomerId) {
//       throw new Error("User payment profile not set up");
//     }

//     // 5. Verify plan exists with billing cycle
//     const planConfig = PLAN_CONFIG[planName]?.[billingCycle];
//     if (!planConfig) {
//       throw new Error("Invalid subscription plan or billing cycle");
//     }

//     // 6. Initialize transaction with Paystack
//     const response = await axios.post(
//       "https://api.paystack.co/transaction/initialize",
//       {
//         email,
//         amount: planConfig.amount * 100, // Convert to kobo
//         plan: planConfig.id,
//         metadata: {
//           userId,
//           planName,
//           planCode: planConfig.id,
//           billingCycle,
//         },
//         callback_url: `${websiteUrl}/success`,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${paystackSecret}`,
//           "Content-Type": "application/json",
//         },
//         timeout: 10000,
//       }
//     );

//     if (!response.data?.status || !response.data.data?.authorization_url) {
//       throw new Error("Payment gateway returned invalid response");
//     }

//     return response.data.data.authorization_url;

//   } catch (error: unknown) {
//     console.error("Paystack Error:", error);

//     let errorMessage = "Failed to initialize payment. Please try again later.";

//     if (error instanceof Error) {
//       errorMessage = error.message;
//     } else if (axios.isAxiosError(error)) {
//       errorMessage = error.response?.data?.message || error.message;
//     }

//     throw new Error(errorMessage);
//   }
// };





// actions/paystackSubscribe.ts
'use server';

import { PLAN_CONFIG } from '@/lib/planLimit';
import { db } from '@/shared/libs/database';
import { currentUser } from '@clerk/nextjs/server';
import { KYCStatus } from '@prisma/client';
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
    const user = await currentUser();
    if (!user) {
      return { success: false, error: "User not authenticated" };
    }

    const email = user.emailAddresses.find(
      (email) => email.id === user.primaryEmailAddressId
    )?.emailAddress;

    if (!email) {
      return { success: false, error: "User email not found" };
    }

    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
    const websiteUrl = process.env.NEXT_PUBLIC_WEBSITE_URL || 'http://localhost:3003';

    if (!paystackSecret || !websiteUrl) {
      return { success: false, error: "Payment system configuration error" };
    }

    const membership = await db.membership.findUnique({ where: { userId } });

    if (!membership) {
      return { success: false, error: "User membership not found" };
    }

    if (membership.kycStatus !== KYCStatus.APPROVED) {
      return { success: false, kycRequired: true };
    }

    if (!membership?.paystackCustomerId) {
      return { success: false, error: "User payment profile not set up" };
    }

    const planConfig = PLAN_CONFIG[planName]?.[billingCycle];
    if (!planConfig) {
      return { success: false, error: "Invalid subscription plan or billing cycle" };
    }

    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: planConfig.amount * 100,
        plan: planConfig.id,
        metadata: { userId, planName, planCode: planConfig.id, billingCycle },
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
      return { success: false, error: "Payment gateway returned invalid response" };
    }

    return { success: true, url: response.data.data.authorization_url };

  } catch (error: unknown) {
    console.error("Paystack Error:", error);

    let errorMessage = "Failed to initialize payment. Please try again later.";
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.message || error.message;
    }

    return { success: false, error: errorMessage };
  }
};
