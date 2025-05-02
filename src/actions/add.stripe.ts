// "use server";

// import Membership from "@/models/membership.model";
// import { connectDb } from "@/shared/libs/db";
// import { currentUser } from "@clerk/nextjs/server";
// import Stripe from "stripe";

// export const addStripe = async () => {
//   try {
//     await connectDb();
//     const user = await currentUser();

//     console.log(user, "user");

//     const membership = await Membership.findOne({  userId: user?.id });

//     if (membership) {
//       return;
//     } else {
//       const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//         apiVersion: "2025-03-31.basil",
//       });

//       await stripe.customers
//         .create({
//           email: user?.emailAddresses[0].emailAddress,
//           name: user?.firstName! + user?.lastName,
//         })
//         .then(async (customer) => {
//           await Membership.create({
//             userId: user?.id,
//             stripeCustomerId: customer.id,
//             plan: "lunch",
//           });
//         });
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };




"use server";

import Membership from "@/models/membership.model";
import { connectDb } from "@/shared/libs/db";
import { auth, currentUser } from "@clerk/nextjs/server";
import Stripe from "stripe";

export const addStripe = async () => {
  try {
    // Connect to the database
    await connectDb();

    // Get the authenticated user's ID and info
    const user = await currentUser();

    console.log( user, "userId and user")
    // console.log(userId, user, "userId and user")

    if ( !user) {
      throw new Error("User not authenticated");
    }

    // Check if the user already has a membership
    const existingMembership = await Membership.findOne({ userId: user.id });

    if (existingMembership) {
      return { message: "Membership already exists." };
    }

    // Initialize Stripe client
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-03-31.basil", 
    });

    // Create a new Stripe customer
    const customer = await stripe.customers.create({
      email: user.emailAddresses?.[0]?.emailAddress,
      name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
    });

    // Create membership in the database
    await Membership.create({
      userId: user.id,
      stripeCustomerId: customer.id,
      plan: "lunch",
    });

    return { message: "Membership and Stripe customer created successfully." };
  } catch (error) {
    console.error("Error in addStripe:", error);
    return { error: "An error occurred while setting up Stripe." };
  }
};
