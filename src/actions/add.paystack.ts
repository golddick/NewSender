// "use server";

// import Membership from "@/models/membership.model";
// import { connectDb } from "@/shared/libs/db";
// import { currentUser } from "@clerk/nextjs/server";

// export const addPaystack = async () => {
//   try {
//     await connectDb();

//     const user = await currentUser();
//     if (!user) {
//       throw new Error("User not authenticated");
//     }

//     const existingMembership = await Membership.findOne({ userId: user.id });
//     if (existingMembership?.paystackCustomerId) {
//       console.log("Membership already exists:", existingMembership);
//       return {
//         success: true,
//         message: "Membership already exists",
//         paystackCustomerId: existingMembership.paystackCustomerId,
//       };
//     }

//     const email = user.emailAddresses?.[0]?.emailAddress;
//     if (!email) {
//       throw new Error("User email not found");
//     }

//     const response = await fetch("https://api.paystack.co/customer", {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         email: email,
//         first_name: user.firstName || "",
//         last_name: user.lastName || "",
//         metadata: {
//           clerkUserId: user.id,
//         },
//       }),
//     });

//     const data = await response.json();
//     if (!data.status || !data.data) {
//       throw new Error(data.message || "Paystack customer creation failed");
//     }

//     const paystackCustomer = data.data;

//     const membershipData = {
//       userId: user.id,
//       paystackCustomerId: paystackCustomer.customer_code,
//       email: email,
//       plan: "FREE",
//       subscriptionStatus: "inactive",
//       subscriberLimit: 500, // FREE plan limit
//       emailLimit: 2,        // FREE plan email limit
//     };

//     let result;
//     if (existingMembership) {
//       result = await Membership.updateOne({ userId: user.id }, { $set: membershipData });
//     } else {
//       result = await Membership.create(membershipData);
//     }

//     console.log("Membership saved or updated:", result);

//     return {
//       success: true,
//       message: "Paystack integration completed",
//       paystackCustomerId: paystackCustomer.customer_code,
//     };

//   } catch (error: any) {
//     console.error("Paystack integration error:", error);
//     return {
//       success: false,
//       error: error.message || "Failed to integrate with Paystack",
//     };
//   }
// };





"use server";

import Membership from "@/models/membership.model";
import MembershipUsage from "@/models/membershipUsage.model";
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

      // Ensure usage for current month is initialized
      const currentMonth = new Date().toISOString().slice(0, 7);
      await MembershipUsage.findOneAndUpdate(
        { userId: user.id, month: currentMonth },
        {
          $setOnInsert: {
            emailsSent: 0,
            subscribersAdded: 0,
          },
        },
        { upsert: true, new: true }
      );

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
      subscriberLimit: 500, // FREE plan limit
      emailLimit: 2,        // FREE plan email limit
    };

    let result;
    if (existingMembership) {
      result = await Membership.updateOne({ userId: user.id }, { $set: membershipData });
    } else {
      result = await Membership.create(membershipData);
    }

    console.log("Membership saved or updated:", result);

    // Ensure usage record for current month exists
    const currentMonth = new Date().toISOString().slice(0, 7); // e.g. "2025-05"
    await MembershipUsage.findOneAndUpdate(
      { userId: user.id, month: currentMonth },
      {
        $setOnInsert: {
          emailsSent: 0,
          subscribersAdded: 0,
        },
      },
      { upsert: true, new: true }
    );

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
