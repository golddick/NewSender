"use server";

import Membership from "@/models/membership.model";
import { connectDb } from "@/shared/libs/db";
import { currentUser } from "@clerk/nextjs/server";

export const getMemberShip = async () => {
  try {
    await connectDb(); // Await DB connection
    const user = await currentUser();

    if (user) {
      const membershipDoc = await Membership.findOne({
        userId: user.id,
      });
      console.log(membershipDoc, 'mem doc server')
      const membership = membershipDoc?.toJSON();
      console.log(membership, 'mem server')
      return membership ;
    }

    return null; // If no user found
  } catch (error) {
    console.error("Error in getMemberShip:", error);
    return null;
  }
};

