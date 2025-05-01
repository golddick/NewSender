// "use server";
// import { connectDb } from "@/shared/libs/db";
// import Stripe from "stripe";

// export const manageSubscription = async ({
//   customerId,
// }: {
//   customerId: string;
// }) => {
//   try {
//     await connectDb();
//     const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//       apiVersion: "2025-03-31.basil",
//     });

//     const portalSession = await stripe.billingPortal.sessions.create({
//       customer: customerId,
//       return_url: process.env.NEXT_PUBLIC_WEBSITE_URL + "/dashboard",
//     });

//     return portalSession.url;
//   } catch (error) {
//     console.log(error);
//   }
// };


// File: app/api/manage-subscription.ts (or similar)
"use server";

import { connectDb } from "@/shared/libs/db";
import Stripe from "stripe";

type ManageSubscriptionResult =
  | { url: string }
  | { error: string };

export const manageSubscription = async ({
  customerId,
}: {
  customerId: string | undefined;
}): Promise<ManageSubscriptionResult> => {
  try {
    // Validate input
    if (!customerId) {
      return { error: "No customer ID provided." };
    }

    // Validate Stripe secret key
    const stripeSecret = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecret) {
      console.error("Missing STRIPE_SECRET_KEY");
      return { error: "Server misconfiguration: Stripe secret key is missing." };
    }

    // Connect to database (if needed)
    await connectDb();

    // Initialize Stripe
    const stripe = new Stripe(stripeSecret, {
      apiVersion: "2025-03-31.basil", // use a stable version
    });

    // Create billing portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: process.env.NEXT_PUBLIC_WEBSITE_URL + "/dashboard",
    });

    // Validate response
    if (!portalSession.url) {
      return { error: "Failed to create billing portal session." };
    }

    return { url: portalSession.url };
  } catch (error: any) {
    console.error("manageSubscription error:", error.stack || error.message || error);
    return { error: "Something went wrong while managing subscription." };
  }
};
