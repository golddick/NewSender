// "use server";

// import axios from "axios";
// import { connectDb } from "@/shared/libs/db";
// import Membership from "@/models/membership.model";

// interface PaymentVerificationResult {
//   success: boolean;
//   message?: string;
//   data?: {
//     amount: number;
//     currency: string;
//     plan: string;
//     subscriptionId?: string;
//   };
// }

// export const verifyPaystackPayment = async (
//   reference: string
// ): Promise<PaymentVerificationResult> => {
//   try {
//     // 1. Validate environment configuration
//     const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
//     if (!paystackSecret) {
//       throw new Error("Payment system not configured properly");
//     }

//     // 2. Verify payment with Paystack
//     const verificationResponse = await axios.get(
//       `https://api.paystack.co/transaction/verify/${reference}`,
//       {
//         headers: {
//           Authorization: `Bearer ${paystackSecret}`,
//         },
//         timeout: 10000, // 10 second timeout
//       }
//     );

//     const transaction = verificationResponse.data.data;

//     // 3. Validate transaction status
//     if (transaction.status !== "success") {
//       console.error("Payment not successful", { status: transaction.status });
//       throw new Error("Payment not completed successfully");
//     }

//     const { metadata, customer, plan, amount, currency } = transaction;

//     // 4. Validate required data
//     if (!metadata?.userId || !customer?.customer_code) {
//       console.error("Missing required transaction data", { metadata, customer });
//       throw new Error("Invalid transaction data received");
//     }

//     // 5. Handle subscription creation if needed
//     let subscriptionCode = transaction.subscription_code;
//     const authorizationCode = transaction.authorization?.authorization_code;

//     if (!subscriptionCode && authorizationCode && plan?.plan_code) {
//       try {
//         const subscriptionResponse = await axios.post(
//           "https://api.paystack.co/subscription",
//           {
//             customer: customer.customer_code,
//             plan: plan.plan_code,
//             authorization: authorizationCode,
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${paystackSecret}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         subscriptionCode = subscriptionResponse.data?.data?.subscription_code;
//         console.log("Created new subscription", { subscriptionCode });
//       } catch (subscriptionError) {
//         console.error("Subscription creation failed", subscriptionError);
//         throw new Error("Could not create subscription automatically");
//       }
//     }

//     // 6. Determine plan amount
//     const planAmount = amount / 100; // Convert from kobo to naira
//     const planCurrency = currency || "NGN";

//     // 7. Update membership record
//     await connectDb();

//     const updateResult = await Membership.findOneAndUpdate(
//       { userId: metadata.userId },
//       {
//         $set: {
//           plan: metadata.planName || plan?.name || "FREE",
//           subscriptionStatus: "active",
//           paystackCustomerId: customer.customer_code,
//           paystackSubscriptionId: subscriptionCode,
//           currentPeriodEnd: new Date(transaction.paid_at),
//           amount: planAmount,
//           currency: planCurrency,
//           lastPaymentDate: new Date(),
//           ...(subscriptionCode && {
//             nextPaymentDate: plan?.next_payment_date 
//               ? new Date(plan.next_payment_date)
//               : undefined
//           })
//         }
//       },
//       { upsert: true, new: true }
//     );

//     console.log("Membership updated successfully", {
//       userId: metadata.userId,
//       plan: updateResult.plan,
//       amount: updateResult.amount
//     });

//     return {
//       success: true,
//       data: {
//         amount: planAmount,
//         currency: planCurrency,
//         plan: updateResult.plan,
//         ...(subscriptionCode && { subscriptionId: subscriptionCode })
//       }
//     };

//   } catch (error: any) {
//     console.error("Payment verification failed:", {
//       reference,
//       error: error.response?.data || error.message,
//       stack: error.stack
//     });

//     return {
//       success: false,
//       message: error.response?.data?.message || 
//               "Payment verification failed. Please try again."
//     };
//   }
// };





"use server";

import axios from "axios";
import { connectDb } from "@/shared/libs/db";
import Membership from "@/models/membership.model";

interface PaymentVerificationResult {
  success: boolean;
  message?: string;
  data?: {
    amount: number;
    currency: string;
    plan: string;
    subscriptionId?: string;
  };
}

export const verifyPaystackPayment = async (
  reference: string
): Promise<PaymentVerificationResult> => {
  try {
    // 1. Validate environment configuration
    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
    if (!paystackSecret) {
      throw new Error("Payment system not configured properly");
    }

    // 2. Verify payment with Paystack
    const verificationResponse = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${paystackSecret}`,
        },
        timeout: 10000,
      }
    );

    const transaction = verificationResponse.data.data;

    // 3. Validate transaction status
    if (transaction.status !== "success") {
      throw new Error("Payment not completed successfully");
    }

    const { metadata, customer, plan, amount, currency } = transaction;

    if (!metadata?.userId || !customer?.customer_code) {
      throw new Error("Invalid transaction data received");
    }

    // 4. Handle subscription creation if missing
    let subscriptionCode = transaction.subscription_code;
    const authorizationCode = transaction.authorization?.authorization_code;

    if (!subscriptionCode && authorizationCode && plan?.plan_code) {
      try {
        const subscriptionResponse = await axios.post(
          "https://api.paystack.co/subscription",
          {
            customer: customer.customer_code,
            plan: plan.plan_code,
            authorization: authorizationCode,
          },
          {
            headers: {
              Authorization: `Bearer ${paystackSecret}`,
              "Content-Type": "application/json",
            },
          }
        );

        subscriptionCode = subscriptionResponse.data?.data?.subscription_code;
        console.log("Created new subscription", { subscriptionCode });
      } catch (subscriptionError) {
        console.error("Subscription creation failed", subscriptionError);
        throw new Error("Could not create subscription automatically");
      }
    }

    // 5. Define usage limits based on plan
    const planAmount = amount / 100; // Convert from kobo to naira
    const planCurrency = currency || "NGN";
    const planName = (metadata.planName || plan?.name || "FREE").toUpperCase();

    let subscriberLimit = 500;
    let emailLimit = 2;

    if (planName.includes("LUNCH")) {
      subscriberLimit = 10000;
      emailLimit = 100;
    } else if (planName.includes("SCALE")) {
      subscriberLimit = 1000000;
      emailLimit = 10000;
    }

    // 6. Update membership in DB
    await connectDb();

    const updateResult = await Membership.findOneAndUpdate(
      { userId: metadata.userId },
      {
        $set: {
          plan: planName,
          subscriptionStatus: "active",
          paystackCustomerId: customer.customer_code,
          paystackSubscriptionId: subscriptionCode,
          currentPeriodEnd: new Date(transaction.paid_at),
          amount: planAmount,
          currency: planCurrency,
          lastPaymentDate: new Date(),
          subscriberLimit,
          emailLimit,
          ...(subscriptionCode && {
            nextPaymentDate: plan?.next_payment_date
              ? new Date(plan.next_payment_date)
              : undefined,
          }),
        },
      },
      { upsert: true, new: true }
    );

    console.log("Membership updated successfully", {
      userId: metadata.userId,
      plan: updateResult.plan,
      amount: updateResult.amount,
    });

    return {
      success: true,
      data: {
        amount: planAmount,
        currency: planCurrency,
        plan: updateResult.plan,
        ...(subscriptionCode && { subscriptionId: subscriptionCode }),
      },
    };
  } catch (error: any) {
    console.error("Payment verification failed:", {
      reference,
      error: error.response?.data || error.message,
    });

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Payment verification failed. Please try again.",
    };
  }
};




// "use server";

// import axios from "axios";
// import { connectDb } from "@/shared/libs/db";
// import Membership from "@/models/membership.model";

// export const verifyPaystackPayment = async (reference: string) => {
//   try {
//     const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
//     if (!paystackSecret) {
//       throw new Error("Payment system not configured");
//     }

//     // 1. Verify payment with Paystack
//     const response = await axios.get(
//       `https://api.paystack.co/transaction/verify/${reference}`,
//       {
//         headers: {
//           Authorization: `Bearer ${paystackSecret}`,
//         },
//       }
//     );

//     const tx = response.data.data;

//     if (tx.status !== "success") {
//       throw new Error("Payment not successful");
//     }

//     const { metadata, customer, authorization, plan } = tx;

//     console.log("Payment Metadata:", metadata);
//     console.log("Customer Data:", customer);
//     console.log("Authorization Data:", authorization);
//     console.log("Plan Data:", plan);

//     // 2. Optionally create subscription manually if not created automatically
//     let subscriptionCode = tx.subscription_code;

//     if (!subscriptionCode && authorization?.authorization_code && plan?.plan_code) {
//       const createSubRes = await axios.post(
//         `https://api.paystack.co/subscription`,
//         {
//           customer: customer.customer_code,
//           plan: plan.plan_code,
//           authorization: authorization.authorization_code,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${paystackSecret}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       subscriptionCode = createSubRes.data?.data?.subscription_code;

//       if (!subscriptionCode) {
//         throw new Error("Failed to create subscription");
//       }
//     }

//     // 3. Update membership
//     await connectDb();

//     await Membership.updateOne(
//       { userId: metadata.userId },
//       {
//         plan: metadata.planName,
//         subscriptionStatus: "active",
//         paystackCustomerId: customer.customer_code,
//         paystackSubscriptionId: subscriptionCode,
//         currentPeriodEnd: new Date(tx.paid_at),
//       },
//       { upsert: true }
//     );

//     return { success: true };
//   } catch (error: any) {
//     console.error("Verification Error:", {
//       message: error.message,
//       response: error.response?.data,
//     });

//     throw new Error(
//       error.response?.data?.message || "Payment verification failed"
//     );
//   }
// };
