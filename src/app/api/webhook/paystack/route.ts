import { NextResponse, NextRequest } from "next/server";
import Membership from "@/models/membership.model";
import { connectDb } from "@/shared/libs/db";
import crypto from "crypto";

// Plan Limits
const PLAN_LIMITS = {
  FREE: { categoryLimit: 1, campaignLimit: 1, emailLimit: 2, subscriberLimit: 500 },
  LUNCH: { categoryLimit: 2, campaignLimit: 5, emailLimit: 10, subscriberLimit: 2000 },
  SCALE: { categoryLimit: 5, campaignLimit: 10, emailLimit: 50, subscriberLimit: 10000 },
} as const;

type PlanName = keyof typeof PLAN_LIMITS;

type PaystackEvent =
  | "subscription.create"
  | "subscription.disable"
  | "subscription.enable"
  | "invoice.payment_failed"
  | "charge.success"
  | "subscription.not_renew";

interface PaystackEventData {
  event: PaystackEvent;
  data: {
    id?: string;
    customer: {
      customer_code: string;
      email?: string;
    };
    plan?: {
      plan_code: string;
      name: string;
    };
    subscription_code?: string;
    next_payment_date?: string;
    paid_at?: string;
    attempt?: number;
    subscription?: {
      subscription_code: string;
    };
  };
}

export async function POST(request: NextRequest) {
  try {
    await connectDb();

    const rawBody = await request.text();
    const signature = request.headers.get("x-paystack-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
      .update(rawBody)
      .digest("hex");

    if (hash !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(rawBody) as PaystackEventData;
    const { customer } = event.data;

    if (!event.event || !customer?.customer_code) {
      return NextResponse.json({ error: "Invalid event payload" }, { status: 400 });
    }

    console.log(`🔔 Paystack Event Received: ${event.event}`);

    switch (event.event) {
      case "subscription.create":
      case "subscription.enable":
        await handleSubscriptionActivation(event.data);
        break;
      case "subscription.disable":
      case "subscription.not_renew":
        await handleSubscriptionCancellation(event.data);
        break;
      case "invoice.payment_failed":
        await handlePaymentFailure(event.data);
        break;
      case "charge.success":
        await handleSuccessfulCharge(event.data);
        break;
      default:
        console.warn("Unhandled Paystack event:", event.event);
        return NextResponse.json({ error: "Unhandled event type" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Webhook error:", { message: err.message, stack: err.stack });
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}

// --- Handlers ---

async function handleSubscriptionActivation(data: PaystackEventData["data"]) {
  const customerCode = data.customer.customer_code;
  const planKey = (data.plan?.name || "FREE").toUpperCase() as PlanName;
  const limits = PLAN_LIMITS[planKey] || PLAN_LIMITS.FREE;

  const subscriptionCode = data.subscription_code || data.subscription?.subscription_code;
  const nextDate = data.next_payment_date;

  if (!subscriptionCode || !nextDate) {
    throw new Error("Missing subscription_code or next_payment_date.");
  }

  const result = await Membership.updateOne(
    { paystackCustomerId: customerCode },
    {
      $set: {
        plan: planKey,
        role: planKey === "FREE" ? "USER" : "NEWSLETTEROWNER",
        paystackSubscriptionId: subscriptionCode,
        subscriptionStatus: "active",
        currentPeriodEnd: new Date(nextDate),
        nextPaymentDate: new Date(nextDate),
        lastPaymentDate: new Date(),
        ...limits,
      },
    }
  );

  if (result.modifiedCount === 0) {
    console.warn("No record updated for activation", { customerCode });
  }

  console.log("✅ Subscription activated:", { customerCode, planKey });
}

async function handleSubscriptionCancellation(data: PaystackEventData["data"]) {
  const customerCode = data.customer.customer_code;
  const result = await Membership.updateOne(
    { paystackCustomerId: customerCode },
    {
      $set: {
        subscriptionStatus: "cancelled",
        plan: "FREE",
        role: "USER",
        cancellationDate: new Date(),
        ...PLAN_LIMITS.FREE,
      },
    }
  );

  if (result.modifiedCount === 0) {
    console.warn("No record updated for cancellation", { customerCode });
  }

  console.log("🚫 Subscription cancelled:", { customerCode });
}

async function handlePaymentFailure(data: PaystackEventData["data"]) {
  const customerCode = data.customer.customer_code;
  const result = await Membership.updateOne(
    { paystackCustomerId: customerCode },
    {
      $set: {
        subscriptionStatus: "past_due",
        lastPaymentAttempt: new Date(),
        failedAttempts: data.attempt || 1,
      },
    }
  );

  if (result.modifiedCount === 0) {
    console.warn("No record updated for failed payment", { customerCode });
  }

  console.log("⚠️ Payment failed:", { customerCode, attempt: data.attempt });
}

async function handleSuccessfulCharge(data: PaystackEventData["data"]) {
  const customerCode = data.customer.customer_code;
  const paidAt = data.paid_at;

  if (!paidAt) {
    throw new Error("Missing payment date.");
  }

  const updateData: Record<string, any> = {
    $set: {
      lastPaymentDate: new Date(paidAt),
      subscriptionStatus: "active",
    },
    $inc: {
      successfulPayments: 1,
    },
  };

  if (data.subscription?.subscription_code) {
    updateData.$set.paystackSubscriptionId = data.subscription.subscription_code;
  }

  const result = await Membership.updateOne(
    { paystackCustomerId: customerCode },
    updateData
  );

  if (result.modifiedCount === 0) {
    console.warn("No record updated for successful charge", { customerCode });
  }

  console.log("💰 Successful charge:", { customerCode, paidAt });
}

// Disable body parsing for raw webhook signature validation
export const config = {
  api: {
    bodyParser: false,
  },
};
