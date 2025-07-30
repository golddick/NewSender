// import { NextResponse } from "next/server";
// import { db } from "@/shared/libs/database"; // your Prisma client
// import axios from "axios";

// export async function POST(request: Request) {
//   try {
//     const { userId, planCode } = await request.json();

//     if (!userId || !planCode) {
//       return NextResponse.json(
//         { error: "Missing userId or planCode" },
//         { status: 400 }
//       );
//     }

//     const membership = await db.membership.findUnique({
//       where: { userId },
//     });

//     if (!membership?.paystackCustomerId) {
//       return NextResponse.json(
//         { error: "User has no Paystack customer ID" },
//         { status: 400 }
//       );
//     }

//     const response = await axios.post(
//       "https://api.paystack.co/subscription",
//       {
//         customer: membership.paystackCustomerId,
//         plan: planCode,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     return NextResponse.json({
//       authorizationUrl: response.data.data.authorization_url,
//     });
//   } catch (error: any) {
//     console.error("Subscription error:", error.response?.data || error);
//     return NextResponse.json(
//       { error: error.message || "Subscription failed" },
//       { status: 500 }
//     );
//   }
// }






import { NextResponse } from "next/server";
import { db } from "@/shared/libs/database";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const secret = process.env.PAYSTACK_SECRET_KEY!;
    const rawBody = await request.text();
    const signature = crypto
      .createHmac("sha512", secret)
      .update(rawBody)
      .digest("hex");

    // Verify Paystack signature
    const paystackSignature = request.headers.get("x-paystack-signature");
    if (signature !== paystackSignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(rawBody);

    if (event.event === "subscription.create" || event.event === "subscription.charge.success") {
      const subscription = event.data;

      // Find user by Paystack customer code
      const membership = await db.membership.findFirst({
        where: { paystackCustomerId: subscription.customer.customer_code },
      });

      if (!membership) {
        return NextResponse.json({ error: "Membership not found" }, { status: 404 });
      }

      // Update membership plan
      const planCode = subscription.plan.plan_code;
      const amount = subscription.amount; // kobo or cents

      await db.membership.update({
        where: { id: membership.id },
        data: {
          plan: subscription.plan.name.toUpperCase(),
          amount,
        },
      });

      // Create invoice
      await db.invoice.create({
        data: {
          userId: membership.userId,
          description: `${subscription.plan.name} Plan - ${subscription.interval}`,
          amount,
          status: "paid",
          invoiceUrl: subscription.authorization?.receipt_url || "",
          date: new Date(),
        },
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ message: "Event ignored" });
  } catch (error: any) {
    console.error("Paystack webhook error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
