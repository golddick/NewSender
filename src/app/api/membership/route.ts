// app/api/membership/route.ts
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/shared/libs/database";
import { redirect } from "next/navigation";

export async function GET() {
  const user = await currentUser();
  console.log(user, 'user server memeber ')
  console.log(user?.id)
  const userId = user?.id;
  if (!userId) {
    // return NextResponse.json({ error: "Unauthorized" }, { status: 401 });'
    redirect('/sign-in')
  }

  const membership = await db.membership.findUnique({
    where: { userId: userId },
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
