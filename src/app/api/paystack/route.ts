import { NextResponse } from "next/server";
import { db } from "@/shared/libs/database";
import crypto from "crypto";
import { PLAN_CONFIG } from "@/lib/planLimit"; // Your plan config

export async function POST(request: Request) {
  try {
    const secret = process.env.PAYSTACK_SECRET_KEY!;
    const rawBody = await request.text();

    // Verify signature
    const signature = crypto.createHmac("sha512", secret).update(rawBody).digest("hex");
    const paystackSignature = request.headers.get("x-paystack-signature");

    if (signature !== paystackSignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(rawBody);
    console.log("Paystack Webhook Event:", event.event);

    const subscription = event.data;

    // Find membership by Paystack customer ID
    const membership = await db.membership.findFirst({
      where: { paystackCustomerId: subscription?.customer?.customer_code },
    });

    if (!membership) {
      return NextResponse.json({ error: "Membership not found" }, { status: 404 });
    }

    // Handle subscription success
    if (
      event.event === "subscription.create" ||
      event.event === "subscription.charge.success" ||
      event.event === "invoice.payment_success" ||
      event.event === "charge.success"
    ) {
      const planCode = subscription.plan?.plan_code;
      let mappedPlan: "LAUNCH" | "SCALE" | "FREE" = "FREE";
      let billingCycle: "monthly" | "yearly" = "monthly";
      let amount = 0;

      for (const [planName, planConfig] of Object.entries(PLAN_CONFIG)) {
        if (planConfig.monthly.id === planCode) {
          mappedPlan = planName as "LAUNCH" | "SCALE";
          billingCycle = "monthly";
          amount = planConfig.monthly.amount;
          break;
        }

        if (planConfig.yearly.id === planCode) {
          mappedPlan = planName as "LAUNCH" | "SCALE";
          billingCycle = "yearly";
          amount = planConfig.yearly.amount;
          break;
        }
      }

      // Update membership
      await db.membership.update({
        where: { id: membership.id },
        data: {
          plan: mappedPlan,
          amount,
        },
      });

      // Create invoice
      await db.invoice.create({
        data: {
          userId: membership.userId,
          description: `${mappedPlan} Plan - ${billingCycle}`,
          amount,
          status: "paid",
          invoiceUrl: subscription?.authorization?.receipt_url || "",
          date: new Date(),
        },
      });

      return NextResponse.json({ success: true });
    }

    // Handle downgrade (subscription cancellation or expiration)
    if (
      event.event === "subscription.not_renew" ||
      event.event === "subscription.disable" ||
      event.event === "subscription.cancel"
    ) {
      await db.membership.update({
        where: { id: membership.id },
        data: {
          plan: "FREE",
          amount: 0,
        },
      });

      return NextResponse.json({ success: true, message: "User downgraded to FREE plan" });
    }

    return NextResponse.json({ message: "Event ignored" });
  } catch (error: any) {
    console.error("Paystack webhook error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}





// import { NextResponse } from "next/server";
// import { db } from "@/shared/libs/database";
// import crypto from "crypto";

// export async function POST(request: Request) {
//   try {
//     const secret = process.env.PAYSTACK_SECRET_KEY!;
//     const rawBody = await request.text();
//     const signature = crypto
//       .createHmac("sha512", secret)
//       .update(rawBody)
//       .digest("hex");

//     // Verify Paystack signature
//     const paystackSignature = request.headers.get("x-paystack-signature");
//     if (signature !== paystackSignature) {
//       return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
//     }

//     const event = JSON.parse(rawBody);

//     if (event.event === "subscription.create" || event.event === "subscription.charge.success") {
//       const subscription = event.data;

//       // Find user by Paystack customer code
//       const membership = await db.membership.findFirst({
//         where: { paystackCustomerId: subscription.customer.customer_code },
//       });

//       if (!membership) {
//         return NextResponse.json({ error: "Membership not found" }, { status: 404 });
//       }

//       // Update membership plan
//       const planCode = subscription.plan.plan_code;
//       const amount = subscription.amount; // kobo or cents

//       await db.membership.update({
//         where: { id: membership.id },
//         data: {
//           plan: subscription.plan.name.toUpperCase(),
//           amount,
//         },
//       });

//       // Create invoice
//       await db.invoice.create({
//         data: {
//           userId: membership.userId,
//           description: `${subscription.plan.name} Plan - ${subscription.interval}`,
//           amount,
//           status: "paid",
//           invoiceUrl: subscription.authorization?.receipt_url || "",
//           date: new Date(),
//         },
//       });

//       return NextResponse.json({ success: true });
//     }

//     return NextResponse.json({ message: "Event ignored" });
//   } catch (error: any) {
//     console.error("Paystack webhook error:", error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }
