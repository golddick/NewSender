import { NextResponse, NextRequest } from "next/server";
import Membership from "@/models/membership.model";
import { connectDb } from "@/shared/libs/db";
import crypto from "crypto";

// Supported event types
type PaystackEvent = 
  | "subscription.create"
  | "subscription.disable"
  | "subscription.enable"
  | "invoice.payment_failed"
  | "charge.success"
  | "subscription.not_renew";

export async function POST(request: NextRequest) {
  try {
    // 1. Connect to database
    await connectDb();

    // 2. Get raw payload and signature
    const payload = await request.text();
    const signature = request.headers.get("x-paystack-signature");

    if (!signature) {
      console.warn("Missing Paystack signature header");
      return NextResponse.json(
        { error: "Missing signature header" },
        { status: 400 }
      );
    }

    // 3. Verify signature
    const computedHash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
      .update(payload)
      .digest("hex");

    if (computedHash !== signature) {
      console.error("Invalid Paystack signature", {
        received: signature,
        computed: computedHash
      });
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    // 4. Parse event data
    const event = JSON.parse(payload) as {
      event: PaystackEvent;
      data: any;
    };

    console.log(`Processing Paystack event: ${event.event}`, {
      eventId: event.data?.id,
      customerCode: event.data?.customer?.customer_code
    });

    // 5. Handle different event types
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
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Webhook processing error:", {
      message: error.message,
      stack: error.stack,
      payload: error.payload
    });

    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

// Helper functions for specific event types
async function handleSubscriptionActivation(data: any) {
  const { customer, plan, subscription_code, next_payment_date } = data;
  
  await Membership.updateOne(
    { paystackCustomerId: customer.customer_code },
    { 
      $set: {
        plan: plan.name.toLowerCase(),
        paystackSubscriptionId: subscription_code,
        subscriptionStatus: "active",
        currentPeriodEnd: new Date(next_payment_date),
        lastPaymentDate: new Date()
      }
    }
  );

  console.log(`Subscription activated for ${customer.customer_code}`);
}

async function handleSubscriptionCancellation(data: any) {
  const { customer } = data;

  await Membership.updateOne(
    { paystackCustomerId: customer.customer_code },
    { 
      $set: {
        subscriptionStatus: "cancelled",
        plan: "FREE",
        cancellationDate: new Date()
      }
    }
  );

  console.log(`Subscription cancelled for ${customer.customer_code}`);
}

async function handlePaymentFailure(data: any) {
  const { customer, attempt } = data;

  await Membership.updateOne(
    { paystackCustomerId: customer.customer_code },
    { 
      $set: {
        subscriptionStatus: "past_due",
        lastPaymentAttempt: new Date(),
        failedAttempts: attempt || 1
      }
    }
  );

  console.log(`Payment failed for ${customer.customer_code}`);
}

async function handleSuccessfulCharge(data: any) {
  const { customer, paid_at } = data;

  await Membership.updateOne(
    { paystackCustomerId: customer.customer_code },
    { 
      $set: {
        lastPaymentDate: new Date(paid_at),
        subscriptionStatus: "active"
      },
      $inc: { successfulPayments: 1 }
    }
  );

  console.log(`Payment succeeded for ${customer.customer_code}`);
}

export const config = {
  api: {
    bodyParser: false,
  },
};