// src/lib/membership/getMembershipStatus.ts
'use server';

import { db } from "@/shared/libs/database"; // Prisma client
import { currentUser } from "@clerk/nextjs/server";

interface MembershipStatus {
  termsAccepted: boolean;
  plan: string;
  role: string;
  subscriptionStatus: string;
}

export async function getMembershipStatus(): Promise<MembershipStatus | null> {
  try {
    // Get the current authenticated user from Clerk
    const user = await currentUser();
    if (!user?.id) return null;

    // Fetch membership from the database using Prisma
    const membership = await db.membership.findUnique({
      where: { userId: user.id },
      select: {
        termsAndConditionsAccepted: true,
        plan: true,
        role: true,
        subscriptionStatus: true,
      },
    });

    if (!membership) return null;

    return {
      termsAccepted: membership.termsAndConditionsAccepted,
      plan: membership.plan,
      role: membership.role,
      subscriptionStatus: membership.subscriptionStatus,
    };
  } catch (error) {
    console.error("Error fetching membership status:", error);
    return null;
  }
}
