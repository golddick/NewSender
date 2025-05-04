import { NextResponse, NextRequest } from "next/server";
import Membership from "@/models/membership.model";
import { connectDb } from "@/shared/libs/db";
import crypto from "crypto";

// Paystack Event Types
type PaystackEvent = 
  | "subscription.create"
  | "subscription.disable"
  | "subscription.enable"
  | "invoice.payment_failed"
  | "charge.success"
  | "subscription.not_renew";

// Paystack Event Data Interface
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

    const payload = await request.text();
    const signature = request.headers.get("x-paystack-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing signature header" }, { status: 400 });
    }

    const computedHash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
      .update(payload)
      .digest("hex");

    if (computedHash !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(payload) as PaystackEventData;

    if (!event.event || !event.data?.customer?.customer_code) {
      return NextResponse.json({ error: "Invalid event payload" }, { status: 400 });
    }

    console.log(`Handling Paystack event: ${event.event}`);

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

  } catch (error: any) {
    console.error("Webhook processing error:", {
      message: error.message,
      stack: error.stack
    });

    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}

// --- Helper Functions ---

async function handleSubscriptionActivation(data: PaystackEventData["data"]) {
  try {
    if (!data.plan || !data.subscription_code || !data.next_payment_date) {
      throw new Error("Missing required activation data");
    }

    const planName = data.plan.name.toUpperCase();

    let subscriberLimit = 500;
    let emailLimit = 2;

    switch (planName) {
      case "LUNCH":
        subscriberLimit = 10000;
        emailLimit = 100;
        break;
      case "SCALE":
        subscriberLimit = 1000000;
        emailLimit = 1000;
        break;
      case "FREE":
      default:
        subscriberLimit = 500;
        emailLimit = 2;
        break;
    }

    const result = await Membership.updateOne(
      { paystackCustomerId: data.customer.customer_code },
      {
        $set: {
          plan: planName,
          paystackSubscriptionId: data.subscription_code || data.subscription?.subscription_code,
          subscriptionStatus: "active",
          currentPeriodEnd: new Date(data.next_payment_date),
          lastPaymentDate: new Date(),
          subscriberLimit,
          emailLimit
        }
      }
    );

    if (result.modifiedCount === 0) {
      console.warn("No membership record updated", {
        customerCode: data.customer.customer_code
      });
    }

    console.log("Subscription activated", {
      customer: data.customer.customer_code,
      plan: planName,
      subscriberLimit,
      emailLimit
    });
  } catch (error) {
    console.error("Subscription activation failed:", {
      customer: data.customer.customer_code,
      error: error instanceof Error ? error.message : String(error)
    });
    throw error;
  }
}

async function handleSubscriptionCancellation(data: PaystackEventData["data"]) {
  try {
    const result = await Membership.updateOne(
      { paystackCustomerId: data.customer.customer_code },
      {
        $set: {
          subscriptionStatus: "cancelled",
          plan: "FREE",
          cancellationDate: new Date(),
          subscriberLimit: 500,
          emailLimit: 2
        }
      }
    );

    if (result.modifiedCount === 0) {
      console.warn("No membership record cancelled", {
        customerCode: data.customer.customer_code
      });
    }

    console.log("Subscription cancelled", {
      customer: data.customer.customer_code
    });
  } catch (error) {
    console.error("Subscription cancellation failed:", {
      customer: data.customer.customer_code,
      error: error instanceof Error ? error.message : String(error)
    });
    throw error;
  }
}

async function handlePaymentFailure(data: PaystackEventData["data"]) {
  try {
    const result = await Membership.updateOne(
      { paystackCustomerId: data.customer.customer_code },
      {
        $set: {
          subscriptionStatus: "past_due",
          lastPaymentAttempt: new Date(),
          failedAttempts: data.attempt || 1
        }
      }
    );

    if (result.modifiedCount === 0) {
      console.warn("No record updated for failed payment", {
        customerCode: data.customer.customer_code
      });
    }

    console.log("Payment failure recorded", {
      customer: data.customer.customer_code,
      attempt: data.attempt
    });
  } catch (error) {
    console.error("Failed to record payment failure:", {
      customer: data.customer.customer_code,
      error: error instanceof Error ? error.message : String(error)
    });
    throw error;
  }
}

async function handleSuccessfulCharge(data: PaystackEventData["data"]) {
  try {
    if (!data.paid_at) {
      throw new Error("Missing payment date");
    }

    const updateData: Record<string, any> = {
      $set: {
        lastPaymentDate: new Date(data.paid_at),
        subscriptionStatus: "active"
      },
      $inc: { successfulPayments: 1 }
    };

    if (data.subscription?.subscription_code) {
      updateData.$set.paystackSubscriptionId = data.subscription.subscription_code;
    }

    const result = await Membership.updateOne(
      { paystackCustomerId: data.customer.customer_code },
      updateData
    );

    if (result.modifiedCount === 0) {
      console.warn("No record updated for successful charge", {
        customerCode: data.customer.customer_code
      });
    }

    console.log("Successful payment recorded", {
      customer: data.customer.customer_code,
      paidAt: data.paid_at
    });
  } catch (error) {
    console.error("Failed to record successful payment:", {
      customer: data.customer.customer_code,
      error: error instanceof Error ? error.message : String(error)
    });
    throw error;
  }
}

// Disable default body parser for raw payload
export const config = {
  api: {
    bodyParser: false,
  },
};
