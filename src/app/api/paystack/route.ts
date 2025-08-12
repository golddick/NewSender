// import { NextResponse } from "next/server";
// import { db } from "@/shared/libs/database";
// import crypto from "crypto";
// import { PLAN_CONFIG } from "@/lib/planLimit"; // Your plan config

// export async function POST(request: Request) {
//   try {
//     const secret = process.env.PAYSTACK_SECRET_KEY!;
//     const rawBody = await request.text();

//     // Verify signature
//     const signature = crypto.createHmac("sha512", secret).update(rawBody).digest("hex");
//     const paystackSignature = request.headers.get("x-paystack-signature");

//     if (signature !== paystackSignature) {
//       return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
//     }

//     const event = JSON.parse(rawBody);
//     console.log("Paystack Webhook Event:", event.event);

//     const subscription = event.data;

//     // Find membership by Paystack customer ID
//     const membership = await db.membership.findFirst({
//       where: { paystackCustomerId: subscription?.customer?.customer_code },
//     });

//     if (!membership) {
//       return NextResponse.json({ error: "Membership not found" }, { status: 404 });
//     }

//     // Handle subscription success
//     if (
//       event.event === "subscription.create" ||
//       event.event === "subscription.charge.success" ||
//       event.event === "invoice.payment_success" ||
//       event.event === "charge.success"
//     ) {
//       const planCode = subscription.plan?.plan_code;
//       let mappedPlan: "LAUNCH" | "SCALE" | "FREE" = "FREE";
//       let billingCycle: "monthly" | "yearly" = "monthly";
//       let amount = 0;

//       for (const [planName, planConfig] of Object.entries(PLAN_CONFIG)) {
//         if (planConfig.monthly.id === planCode) {
//           mappedPlan = planName as "LAUNCH" | "SCALE";
//           billingCycle = "monthly";
//           amount = planConfig.monthly.amount;
//           break;
//         }

//         if (planConfig.yearly.id === planCode) {
//           mappedPlan = planName as "LAUNCH" | "SCALE";
//           billingCycle = "yearly";
//           amount = planConfig.yearly.amount;
//           break;
//         }
//       }

//       // Update membership
//       await db.membership.update({
//         where: { id: membership.id },
//         data: {
//           plan: mappedPlan,
//           amount,
//         },
//       });

//       // Create invoice
//       await db.invoice.create({
//         data: {
//           userId: membership.userId,
//           description: `${mappedPlan} Plan - ${billingCycle}`,
//           amount,
//           status: "paid",
//           invoiceUrl: subscription?.authorization?.receipt_url || "",
//           date: new Date(),
//         },
//       });

//       return NextResponse.json({ success: true });
//     }

//     // Handle downgrade (subscription cancellation or expiration)
//     if (
//       event.event === "subscription.not_renew" ||
//       event.event === "subscription.disable" ||
//       event.event === "subscription.cancel"
//     ) {
//       await db.membership.update({
//         where: { id: membership.id },
//         data: {
//           plan: "FREE",
//           amount: 0,
//         },
//       });

//       return NextResponse.json({ success: true, message: "User downgraded to FREE plan" });
//     }

//     return NextResponse.json({ message: "Event ignored" });
//   } catch (error: any) {
//     console.error("Paystack webhook error:", error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }



import { NextResponse } from "next/server";
import { db } from "@/shared/libs/database";
import crypto from "crypto";
import { PLAN_CONFIG } from "@/lib/planLimit";

export async function POST(request: Request) {
  try {
    const secret = process.env.PAYSTACK_SECRET_KEY!;
    const rawBody = await request.text();

    // Verify Paystack webhook signature
    const signature = crypto.createHmac("sha512", secret).update(rawBody).digest("hex");
    const paystackSignature = request.headers.get("x-paystack-signature");

    if (signature !== paystackSignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(rawBody);
    console.log("Paystack Webhook Event:", event.event);

    const data = event.data;

    // Find membership by Paystack customer code
    const membership = await db.membership.findFirst({
      where: { paystackCustomerId: data?.customer?.customer_code },
    });

    if (!membership) {
      return NextResponse.json({ error: "Membership not found" }, { status: 404 });
    }

    // ✅ Subscription success events
    if (
      [
        "subscription.create",
        "subscription.charge.success",
        "invoice.payment_success",
        "charge.success",
      ].includes(event.event)
    ) {
      const planCode = data.plan?.plan_code;
      let mappedPlan: "LAUNCH" | "SCALE" | "FREE" = "FREE";
      let billingCycle: "monthly" | "yearly" = "monthly";

      // First try to match with PLAN_CONFIG
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

      // ✅ Get amount from Paystack payload (fallback to config)
      const amount =
        typeof data.amount === "number"
          ? data.amount / 100
          : PLAN_CONFIG[mappedPlan]?.[billingCycle]?.amount || 0;

      // ✅ Avoid duplicate invoices
      const existingInvoice = await db.invoice.findFirst({
        where: { externalId: data.id?.toString() }, // store Paystack's unique payment ID
      });

      if (!existingInvoice) {
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
            invoiceUrl:
              data.invoice_url ||
              data.authorization?.receipt_url ||
              "",
            date: new Date(),
            externalId: data.id?.toString(),

          },
        });
      }

      return NextResponse.json({ success: true });
    }

    // ✅ Downgrade events
    if (
      [
        "subscription.not_renew",
        "subscription.disable",
        "subscription.cancel",
      ].includes(event.event)
    ) {
      await db.membership.update({
        where: { id: membership.id },
        data: {
          plan: "FREE",
          amount: 0,
        },
      });

      return NextResponse.json({
        success: true,
        message: "User downgraded to FREE plan",
      });
    }

    return NextResponse.json({ message: "Event ignored" });
  } catch (error: any) {
    console.error("Paystack webhook error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
