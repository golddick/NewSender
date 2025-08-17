



// import { NextResponse, NextRequest } from "next/server";
// import crypto from "crypto";
// import { db } from "@/shared/libs/database";

// // Plan Limits
// const PLAN_LIMITS = {
//   FREE: { appIntegratedLimit: 2, campaignLimit: 3, emailLimit: 5, subscriberLimit: 500 },
//   LAUNCH: { appIntegratedLimit: 2, campaignLimit: 5, emailLimit: 20, subscriberLimit: 20000 },
//   SCALE: { appIntegratedLimit: 5, campaignLimit: 10, emailLimit: 50, subscriberLimit: 100000 },
// } as const;

// type PlanName = keyof typeof PLAN_LIMITS;

// type PaystackEvent =
//   | "subscription.create"
//   | "subscription.disable"
//   | "subscription.enable"
//   | "invoice.payment_failed"
//   | "charge.success"
//   | "subscription.not_renew"; 

// interface PaystackEventData {
//   event: PaystackEvent;
//   data: {
//     id?: string;
//     customer: {
//       customer_code: string;
//       email?: string;
//     };
//     plan?: {
//       plan_code: string;
//       name: string;
//     };
//     subscription_code?: string;
//     next_payment_date?: string;
//     paid_at?: string;
//     attempt?: number;
//     subscription?: {
//       subscription_code: string;
//     };
//   };
// }

// export async function POST(request: NextRequest) {
//   try {
//     const rawBody = await request.text();
//     const signature = request.headers.get("x-paystack-signature");

//     if (!signature) {
//       return NextResponse.json({ error: "Missing signature" }, { status: 400 });
//     }

//     const hash = crypto
//       .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
//       .update(rawBody)
//       .digest("hex");

//     if (hash !== signature) {
//       return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
//     }

//     const event = JSON.parse(rawBody) as PaystackEventData;
//     const { customer } = event.data;

//     if (!event.event || !customer?.customer_code) {
//       return NextResponse.json({ error: "Invalid event payload" }, { status: 400 });
//     }

//     console.log(`🔔 Paystack Event Received: ${event.event}`);

//     switch (event.event) {
//       case "subscription.create":
//       case "subscription.enable":
//         await handleSubscriptionActivation(event.data);
//         break;
//       case "subscription.disable":
//       case "subscription.not_renew":
//         await handleSubscriptionCancellation(event.data);
//         break;
//       case "invoice.payment_failed":
//         await handlePaymentFailure(event.data);
//         break;
//       case "charge.success":
//         await handleSuccessfulCharge(event.data);
//         break;
//       default:
//         console.warn("Unhandled Paystack event:", event.event);
//         return NextResponse.json({ error: "Unhandled event type" }, { status: 400 });
//     }

//     return NextResponse.json({ success: true });
//   } catch (err: any) {
//     console.error("Webhook error:", { message: err.message, stack: err.stack });
//     return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
//   }
// }

// // --- Prisma Handlers ---

// async function handleSubscriptionActivation(data: PaystackEventData["data"]) {
//   const customerCode = data.customer.customer_code;
//   const planKey = (data.plan?.name || "FREE").toUpperCase() as PlanName;
//   const limits = PLAN_LIMITS[planKey] || PLAN_LIMITS.FREE;

//   const subscriptionCode = data.subscription_code || data.subscription?.subscription_code;
//   const nextDate = data.next_payment_date;

//   if (!subscriptionCode || !nextDate) {
//     throw new Error("Missing subscription_code or next_payment_date.");
//   }

//   await db.membership.updateMany({
//     where: { paystackCustomerId: customerCode },
//     data: {
//       plan: planKey,
//       role: planKey === "FREE" ? "USER" : "NEWSLETTEROWNER",
//       paystackSubscriptionId: subscriptionCode,
//       subscriptionStatus: "active",
//       currentPeriodEnd: new Date(nextDate),
//       nextPaymentDate: new Date(nextDate),
//       lastPaymentDate: new Date(),
//       ...limits,
//     },
//   });

//   console.log("✅ Subscription activated:", { customerCode, planKey });
// }

// async function handleSubscriptionCancellation(data: PaystackEventData["data"]) {
//   const customerCode = data.customer.customer_code;
  
//   await db.membership.updateMany({
//     where: { paystackCustomerId: customerCode },
//     data: {
//       subscriptionStatus: "cancelled",
//       plan: "FREE",
//       role: "USER",
//       ...PLAN_LIMITS.FREE,
//     },
//   });

//   console.log("🚫 Subscription cancelled:", { customerCode });
// }

// async function handlePaymentFailure(data: PaystackEventData["data"]) {
//   const customerCode = data.customer.customer_code;
  
//   await db.membership.updateMany({
//     where: { paystackCustomerId: customerCode },
//     data: {
//       subscriptionStatus: "past_due",
//       failedAttempts: data.attempt || 1,
//     },
//   });

//   console.log("⚠️ Payment failed:", { customerCode, attempt: data.attempt });
// }

// async function handleSuccessfulCharge(data: PaystackEventData["data"]) {
//   const customerCode = data.customer.customer_code;
//   const paidAt = data.paid_at;

//   if (!paidAt) {
//     throw new Error("Missing payment date.");
//   }
 
//   const updateData: any = {
//     lastPaymentDate: new Date(paidAt),
//     subscriptionStatus: "active",
//     successfulPayments: { increment: 1 },
//   };

//   if (data.subscription?.subscription_code) {
//     updateData.paystackSubscriptionId = data.subscription.subscription_code;
//   }

//   await db.membership.updateMany({
//     where: { paystackCustomerId: customerCode },
//     data: updateData,
//   });

//   console.log("💰 Successful charge:", { customerCode, paidAt });
// }

// // Disable body parsing for raw webhook signature validation
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };







import { NextResponse } from "next/server";
import { db } from "@/shared/libs/database";
import crypto from "crypto";
import { PLAN_CONFIG } from "@/lib/planLimit";
import { PlanSubscriptionStatus } from "@prisma/client";

// 🔐 Verify Paystack webhook signature
function verifySignature(rawBody: string, signature: string | null) {
  const secret = process.env.PAYSTACK_SECRET_KEY!;
  const hash = crypto.createHmac("sha512", secret).update(rawBody).digest("hex");
  return hash === signature;
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const paystackSignature = request.headers.get("x-paystack-signature");

    if (!verifySignature(rawBody, paystackSignature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(rawBody);
    const data = event.data;

    console.log(`🔔 Paystack Event Received: ${event.event}`);

    // 🔎 Find membership by Paystack customer
    const membership = await db.membership.findFirst({
      where: { paystackCustomerId: data?.customer?.customer_code },
    });

    if (!membership) {
      return NextResponse.json({ error: "Membership not found" }, { status: 404 });
    }

    // ✅ Handle subscription success & charge events
    if (
      [
        "subscription.create",
        "subscription.enable",
        "subscription.charge.success",
        "invoice.payment_success",
        "charge.success",
      ].includes(event.event)
    ) {
      let mappedPlan: "FREE" | "LAUNCH" | "SCALE" = "FREE";
      let billingCycle: "monthly" | "yearly" = "monthly";

      const planCode = data.plan?.plan_code;

      // Match plan against PLAN_CONFIG
      for (const [planName, planConfig] of Object.entries(PLAN_CONFIG)) {
        if (planConfig.monthly.id === planCode) {
          mappedPlan = planName as "LAUNCH" | "SCALE";
          billingCycle = "monthly";
          break;
        }
        if (planConfig.yearly.id === planCode) {
          mappedPlan = planName as "LAUNCH" | "SCALE";
          billingCycle = "yearly";
          break;
        }
      }

      // Determine charge amount
      const amount =
        typeof data.amount === "number"
          ? data.amount / 100
          : PLAN_CONFIG[mappedPlan]?.[billingCycle]?.amount || 0;

      // 🧾 Avoid duplicate invoices
      const existingInvoice = await db.invoice.findFirst({
        where: { externalId: data.id?.toString() },
      });

      if (!existingInvoice) {
        // Update membership
        await db.membership.update({
          where: { id: membership.id },
          data: {
            plan: mappedPlan,
            amount,
            subscriptionStatus: PlanSubscriptionStatus.active,
            paystackSubscriptionId: data.subscription?.subscription_code ?? membership.paystackSubscriptionId,
            nextPaymentDate: data.next_payment_date ? new Date(data.next_payment_date) : membership.nextPaymentDate,
            lastPaymentDate: data.paid_at ? new Date(data.paid_at) : membership.lastPaymentDate,
          },
        });

        // Create invoice
        await db.invoice.create({
          data: {
            userId: membership.userId,
            description: `${mappedPlan} Plan - ${billingCycle}`,
            amount,
            status: "paid",
            invoiceUrl: data.invoice_url || data.authorization?.receipt_url || "",
            date: new Date(),
            externalId: data.id?.toString(),
          },
        });
      }

      return NextResponse.json({ success: true, message: "Subscription updated" });
    }

    // ⚠️ Handle downgrade / cancellation
    if (
      ["subscription.disable", "subscription.not_renew", "subscription.cancel"].includes(event.event)
    ) {
      await db.membership.update({
        where: { id: membership.id },
        data: {
          plan: "FREE",
          amount: 0,
          subscriptionStatus: PlanSubscriptionStatus.inactive,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Subscription cancelled, downgraded to FREE",
      });
    }

    // ⚠️ Handle failed payments
    if (event.event === "invoice.payment_failed") {
      await db.membership.update({
        where: { id: membership.id },
        data: {
          subscriptionStatus: PlanSubscriptionStatus.past_due,
          failedAttempts: (membership.failedAttempts || 0) + 1,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Payment failed, membership marked as past_due",
      });
    }

    console.warn("Unhandled Paystack event:", event.event);
    return NextResponse.json({ message: "Event ignored" });
  } catch (error: any) {
    console.error("🚨 Paystack webhook error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
