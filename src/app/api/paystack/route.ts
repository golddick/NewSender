import { NextResponse } from "next/server";
import Membership from "@/models/membership.model";
import { connectDb } from "@/shared/libs/db";
import axios from "axios";

export async function POST(request: Request) {
  try {
    await connectDb();
    const { userId, planCode } = await request.json();

    const membership = await Membership.findOne({ userId });
    if (!membership?.paystackCustomerId) {
      return NextResponse.json(
        { error: "User has no Paystack customer ID" },
        { status: 400 }
      );
    }

    // Create Paystack subscription
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
    console.error("Subscription error:", error);
    return NextResponse.json(
      { error: error.message || "Subscription failed" },
      { status: 500 }
    );
  }
}