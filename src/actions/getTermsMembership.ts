'use server';

import Membership from "@/models/membership.model";
import { connectDb } from "@/shared/libs/db";
import { currentUser } from "@clerk/nextjs/server";

interface MembershipStatus {
  termsAccepted: boolean;
}

export async function getMembershipStatus(): Promise<MembershipStatus | null> {
  try {
    // Connect to the database
    await connectDb();

    // Get the current user
    const user = await currentUser();
    
    // If the user doesn't exist or doesn't have an ID, return null
    if (!user?.id) return null;

    // Find the user's membership details in the database
    const member = await Membership.findOne({ userId: user.id });
    
    // If no membership is found for the user, return null
    if (!member) return null;

    // Return the terms acceptance status
    return {
      termsAccepted: member.termsAndConditionsAccepted,
    };
  } catch (error) {
    // Log the error to debug
    console.error("Error fetching membership status:", error);
    
    // Return null in case of any error
    return null;
  }
}
