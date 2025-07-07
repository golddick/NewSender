// app/api/membership/route.ts
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/shared/libs/database";

export async function GET() {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const membership = await db.membership.findFirst({
    where: { userId: user.id },
    select: {
      id: true,
      userId: true,
      plan: true,
      role: true,
      subscriptionStatus: true,
      paystackCustomerId: true,
      email: true,
      organization: true,
      amount: true,
      currency: true,
      lastPaymentDate: true,
      nextPaymentDate: true,
      subscriberLimit: true,
      emailLimit: true,
      campaignLimit: true,
      appIntegratedLimit: true,
      termsAndConditionsAccepted: true,
    }
  });

  if (!membership) {
    return NextResponse.json(null, { status: 200 });
  }

  return NextResponse.json(membership);
}
