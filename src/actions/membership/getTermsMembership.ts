// 'use server';

// import Membership from "@/models/membership.model";
// import { connectDb } from "@/shared/libs/db";
// import { currentUser } from "@clerk/nextjs/server";

// interface MembershipStatus {
//   termsAccepted: boolean;
// }

// export async function getMembershipStatus(): Promise<MembershipStatus | null> {
//   try {
//     // Connect to the database
//     await connectDb();

//     // Get the current user
//     const user = await currentUser();
    
//     // If the user doesn't exist or doesn't have an ID, return null
//     if (!user?.id) return null;

//     // Find the user's membership details in the database
//     const member = await Membership.findOne({ userId: user.id });
    
//     // If no membership is found for the user, return null
//     if (!member) return null;

//     // Return the terms acceptance status
//     return {
//       termsAccepted: member.termsAndConditionsAccepted,
//     };
//   } catch (error) {
//     // Log the error to debug
//     console.error("Error fetching membership status:", error);
    
//     // Return null in case of any error
//     return null;
//   }
// }


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
