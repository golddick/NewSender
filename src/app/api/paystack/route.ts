import { NextResponse } from "next/server";
import { db } from "@/shared/libs/database"; // your Prisma client
import axios from "axios";

export async function POST(request: Request) {
  try {
    const { userId, planCode } = await request.json();

    if (!userId || !planCode) {
      return NextResponse.json(
        { error: "Missing userId or planCode" },
        { status: 400 }
      );
    }

    const membership = await db.membership.findUnique({
      where: { userId },
    });

    if (!membership?.paystackCustomerId) {
      return NextResponse.json(
        { error: "User has no Paystack customer ID" },
        { status: 400 }
      );
    }

    const response = await axios.post(
      "https://api.paystack.co/subscription",
      {
        customer: membership.paystackCustomerId,
        plan: planCode,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json({
      authorizationUrl: response.data.data.authorization_url,
    });
  } catch (error: any) {
    console.error("Subscription error:", error.response?.data || error);
    return NextResponse.json(
      { error: error.message || "Subscription failed" },
      { status: 500 }
    );
  }
}
