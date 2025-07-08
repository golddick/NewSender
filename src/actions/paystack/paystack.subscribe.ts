// "use server";

// import Membership from "@/models/membership.model";
// import { connectDb } from "@/shared/libs/db";
// import { currentUser } from "@clerk/nextjs/server";
// import axios from "axios";

// const PLAN_CONFIG = {
//   "PLN_qqs88g3s909068i": { amount: 50000, name: "LUNCH" },
//   "PLN_zpaqmox70eunvd9": { amount: 540000, name: "LUNCH" },
//   "PLN_4idp8h4m8ptak6k": { amount: 120000, name: "SCALE" },
//   "PLN_l1ck8bvf49k9nhx": { amount: 1000000, name: "SCALE" },
// };

// export const paystackSubscribe = async ({
//   planCode,
//   userId,
// }: {
//   planCode: string;
//   userId: string;
// }) => {
//   try {
//     // 1. Get current user from Clerk
//     const user = await currentUser();
//     if (!user) {
//       throw new Error("User not authenticated");
//     }

//     console.log("User from Clerk:", user);

//     // 2. Get user's email (primary email address)
//     const email = user.emailAddresses.find(
//       (email) => email.id === user.primaryEmailAddressId
//     )?.emailAddress;

//     if (!email) {
//       throw new Error("User email not found");
//     }

//     // 3. Verify Paystack configuration
//     const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
//     const websiteUrl = process.env.NEXT_PUBLIC_WEBSITE_URL;
    
//     if (!paystackSecret || !websiteUrl) {
//       throw new Error("Payment system configuration error");
//     }

//     // 4. Connect to database
//     await connectDb();

//     // 5. Get user membership
//     const membership = await Membership.findOne({ userId });
//     if (!membership?.paystackCustomerId) {
//       throw new Error("User payment profile not set up");
//     }

//     // 6. Verify plan exists
//     const planConfig = PLAN_CONFIG[planCode as keyof typeof PLAN_CONFIG];
//     if (!planConfig) {
//       throw new Error("Invalid subscription plan");
//     }

//     // 7. Initialize transaction
//     const response = await axios.post(
//       "https://api.paystack.co/transaction/initialize",
//       {
//         email: email, // Use the email from Clerk
//         amount: planConfig.amount * 100,
//         plan: planCode,
//         metadata: {
//           userId,
//           planName: planConfig.name,
//           planCode
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

//   } catch (error: any) {
//     console.error("Paystack Error:", {
//       message: error.message,
//       response: error.response?.data,
//     });
    
//     throw new Error(
//       error.response?.data?.message || 
//       "Failed to initialize payment. Please try again later."
//     );
//   }
// };



'use server';

import { db } from '@/shared/libs/database';
import { currentUser } from '@clerk/nextjs/server';
import axios from 'axios';

const PLAN_CONFIG = {
  "PLN_xpxme65ldog950p": { amount: 15000, name: "LAUNCH" },
  // "PLN_zpaqmox70eunvd9": { amount: 540000, name: "LUNCH" },
  "PLN_4idp8h4m8ptak6k": { amount: 50000, name: "SCALE" },
  // "PLN_l1ck8bvf49k9nhx": { amount: 1000000, name: "SCALE" },
} as const;

export const paystackSubscribe = async ({
  planCode,
  userId,
}: {
  planCode: string;
  userId: string;
}) => {
  try {
    // 1. Get current user from Clerk
    const user = await currentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }


    // 2. Get user's email (primary email address)
    const email = user.emailAddresses.find(
      (email) => email.id === user.primaryEmailAddressId
    )?.emailAddress;

    if (!email) {
      throw new Error("User email not found");
    }

    // 3. Verify Paystack configuration
    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
    const websiteUrl = 'http://localhost:3003/';
    // const websiteUrl = process.env.NEXT_PUBLIC_WEBSITE_URL;
    
    if (!paystackSecret || !websiteUrl) {
      throw new Error("Payment system configuration error");
    }

    // 4. Get user membership using Prisma
    const membership = await db.membership.findUnique({
      where: { userId }
    });

    if (!membership?.paystackCustomerId) {
      throw new Error("User payment profile not set up");
    }

    // 5. Verify plan exists with type safety
    const planConfig = PLAN_CONFIG[planCode as keyof typeof PLAN_CONFIG];
    if (!planConfig) {
      throw new Error("Invalid subscription plan");
    }

    // 6. Initialize transaction with Paystack
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: planConfig.amount * 100, // Convert to kobo
        plan: planCode,
        metadata: {
          userId,
          planName: planConfig.name,
          planCode
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