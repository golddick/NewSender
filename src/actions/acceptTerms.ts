// src/lib/membership/acceptTermsAndPrivacy.ts
'use server';

import { db } from "@/shared/libs/database"; // Prisma client
import { currentUser } from "@clerk/nextjs/server";

export async function acceptTermsAndPrivacy() {
  // Get current user
  const user = await currentUser();
  if (!user?.id) {
    throw new Error("User not authenticated");
  }

  // Update membership using Prisma
  const updatedMembership = await db.membership.update({
    where: { userId: user.id },
    data: { termsAndConditionsAccepted: true },
  });

  if (!updatedMembership) {
    throw new Error("Membership not found");
  }

  return updatedMembership;
}
