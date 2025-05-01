"use server";

import Membership from "@/models/membership.model";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil",
});

export const stripeSubscribe = async ({
  price,
  userId,
}: {
  price: string;
  userId: string;
}) => {
  try {
    const user = await Membership.findOne({ userId });
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: user.stripeCustomerId,
      line_items: [
        {
          price: price,
          quantity: 1,
        },
      ],
      success_url: process.env.NEXT_PUBLIC_WEBSITE_URL + "/success",
      cancel_url: process.env.NEXT_PUBLIC_WEBSITE_URL + "/error",
      subscription_data: {
        metadata: {
          payingUserId: userId,
        },
      },
    });

    if (!checkoutSession.url) {
      return {
        message: "Could not create checkout session!",
      };
    }
    return checkoutSession.url;
  } catch (error) {
    console.log(error);
  }
};



// "use server";

// import Membership from "@/models/membership.model";
// import { connectDb } from "@/shared/libs/db";
// import Stripe from "stripe";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: "2025-03-31.basil",
// });

// export const stripeSubscribe = async ({
//   price,
//   userId,
// }: {
//   price: string;
//   userId: string;
// }) => {
//   try {
//     await connectDb();

//     const membership = await Membership.findOne({ userId });
//     if (!membership || !membership.stripeCustomerId) {
//       throw new Error("User has no Stripe customer ID.");
//     }

//     const checkoutSession = await stripe.checkout.sessions.create({
//       mode: "subscription",
//       customer: membership.stripeCustomerId,
//       line_items: [
//         {
//           price: price,
//           quantity: 1,
//         },
//       ],
//       success_url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/success`,
//       cancel_url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/error`,
//       subscription_data: {
//         metadata: {
//           payingUserId: userId,
//         },
//       },
//     });

//     if (!checkoutSession.url) {
//       throw new Error("Stripe session URL not created");
//     }

//     return checkoutSession.url;
//   } catch (error: any) {
//     console.error("stripeSubscribe error:", error);
//   }
// };
