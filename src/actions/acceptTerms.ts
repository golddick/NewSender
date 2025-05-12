'use server';
import Membership from "@/models/membership.model";
import { connectDb } from "@/shared/libs/db";
import {  currentUser } from "@clerk/nextjs/server";

export async function acceptTermsAndPrivacy() {
    await connectDb();
 
     const user = await currentUser();
     if (!user) {
       throw new Error("User not authenticated");
     }

  if (!user.id) {
    throw new Error('Unauthorized');
  }

  const updated = await Membership.findOneAndUpdate(
    { userId: user.id },
    { termsAndConditionsAccepted: true },
    { new: true }
  );

  if (!updated) throw new Error('Membership not found');
  return updated;
}
