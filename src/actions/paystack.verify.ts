

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
//         timeout: 10000,
//       }
//     );

//     const transaction = verificationResponse.data.data;

//     // 3. Validate transaction status
//     if (transaction.status !== "success") {
//       throw new Error("Payment not completed successfully");
//     }

//     const { metadata, customer, plan, amount, currency } = transaction;

//     if (!metadata?.userId || !customer?.customer_code) {
//       throw new Error("Invalid transaction data received");
//     }

//     // 4. Handle subscription creation if missing
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

//         console.log("Subscription creation response", subscriptionResponse);
//         console.log("Subscription data", subscriptionResponse.data);

//         subscriptionCode = subscriptionResponse.data?.data?.subscription_code;
//         console.log("Created new subscription", { subscriptionCode });
//       } catch (subscriptionError) {
//         console.error("Subscription creation failed", subscriptionError);
//         throw new Error("Could not create subscription automatically");
//       }
//     }

//     // 5. Define usage limits based on plan
//     const planAmount = amount / 100; // Convert from kobo to naira
//     const planCurrency = currency || "NGN";
//     const planName = (metadata.planName || plan?.name || "FREE").toUpperCase();

//     let subscriberLimit = 500;
//     let emailLimit = 2;

//     if (planName.includes("LUNCH")) {
//       subscriberLimit = 10000;
//       emailLimit = 100;
//     } else if (planName.includes("SCALE")) {
//       subscriberLimit = 1000000;
//       emailLimit = 10000;
//     }

//     // 6. Update membership in DB
//     await connectDb();

//     const updateResult = await Membership.findOneAndUpdate(
//       { userId: metadata.userId },
//       {
//         $set: {
//           plan: planName,
//           subscriptionStatus: "active",
//           paystackCustomerId: customer.customer_code,
//           paystackSubscriptionId: subscriptionCode,
//           currentPeriodEnd: new Date(transaction.paid_at),
//           amount: planAmount,
//           currency: planCurrency,
//           lastPaymentDate: new Date(),
//           subscriberLimit,
//           emailLimit,
//           ...(subscriptionCode && {
//             nextPaymentDate: plan?.next_payment_date
//               ? new Date(plan.next_payment_date)
//               : undefined,
//           }),
//         },
//       },
//       { upsert: true, new: true }
//     );

//     console.log("Membership updated successfully", {
//       userId: metadata.userId,
//       plan: updateResult.plan,
//       amount: updateResult.amount,
//     });

//     return {
//       success: true,
//       data: {
//         amount: planAmount,
//         currency: planCurrency,
//         plan: updateResult.plan,
//         ...(subscriptionCode && { subscriptionId: subscriptionCode }),
//       },
//     };
//   } catch (error: any) {
//     console.error("Payment verification failed:", {
//       reference,
//       error: error.response?.data || error.message,
//     });

//     return {
//       success: false,
//       message:
//         error.response?.data?.message ||
//         "Payment verification failed. Please try again.",
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
    console.log("🔍 Verifying Paystack transaction:", reference);

    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
    if (!paystackSecret) {
      throw new Error("Missing Paystack secret key");
    }

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

    if (transaction.status !== "success") {
      throw new Error("Transaction is not successful");
    }

    const {
      metadata,
      customer,
      plan,
      amount,
      currency,
      authorization,
      subscription_code,
    } = transaction;

    if (!metadata?.userId || !customer?.customer_code) {
      throw new Error("Missing metadata.userId or customer.customer_code");
    }

    const userId = metadata.userId;
    const customerCode = customer.customer_code;
    const planName = (metadata.planName || plan?.name || "FREE").toUpperCase();
    const authorizationCode = authorization?.authorization_code;
    const fallbackPlanCode = metadata?.planCode || plan?.plan_code;

    let subscriptionCode = subscription_code;

    console.log("✅ Payment verified:", {
      status: transaction.status,
      customerCode,
      planCode: fallbackPlanCode,
      subscriptionCode,
      authorizationCode,
    });

    // Attempt to create subscription if missing
    if (!subscriptionCode && authorizationCode && fallbackPlanCode) {
      console.log("⚠️ No subscription_code found. Attempting to create subscription manually...");

      const subRes = await axios.post(
        "https://api.paystack.co/subscription",
        {
          customer: customerCode,
          plan: fallbackPlanCode,
          authorization: authorizationCode,
        },
        {
          headers: {
            Authorization: `Bearer ${paystackSecret}`,
            "Content-Type": "application/json",
          },
        }
      );

      subscriptionCode = subRes.data?.data?.subscription_code;

      console.log("📦 Subscription created manually:", {
        created: !!subscriptionCode,
        subscriptionCode,
      });

      if (!subscriptionCode) {
        throw new Error("Failed to create subscription: No subscription_code returned.");
      }
    }

    // Define usage limits
    const planAmount = amount / 100;
    const planCurrency = currency || "NGN";
    let subscriberLimit = 500;
    let emailLimit = 2;

    if (planName.includes("LUNCH")) {
      subscriberLimit = 10000;
      emailLimit = 100;
    } else if (planName.includes("SCALE")) {
      subscriberLimit = 1000000;
      emailLimit = 10000;
    }

    await connectDb();
    console.log("🔗 Connected to DB");

    const updateResult = await Membership.findOneAndUpdate(
      { userId },
      {
        $set: {
          plan: planName,
          subscriptionStatus: "active",
          paystackCustomerId: customerCode,
          paystackSubscriptionId: subscriptionCode,
          currentPeriodEnd: new Date(transaction.paid_at),
          amount: planAmount,
          currency: planCurrency,
          lastPaymentDate: new Date(),
          subscriberLimit,
          emailLimit,
        },
      },
      { upsert: true, new: true }
    );

    console.log("✅ Membership updated:", {
      userId,
      subscriptionCode,
      plan: planName,
    });

    return {
      success: true,
      data: {
        amount: planAmount,
        currency: planCurrency,
        plan: planName,
        subscriptionId: subscriptionCode,
      },
    };
  } catch (error: any) {
    console.error("❌ Payment verification failed:", {
      error: error.response?.data || error.message,
      reference,
    });

    return {
      success: false,
      message:
        error.response?.data?.message || "Payment verification failed. Please try again.",
    };
  }
};
