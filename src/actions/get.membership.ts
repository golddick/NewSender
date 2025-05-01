"use server";

import Membership from "@/models/membership.model";
import { connectDb } from "@/shared/libs/db";
import { currentUser } from "@clerk/nextjs/server";
// import { currentUser } from "@clerk/nextjs";

// export const getMemberShip = async () => {
//   try {
//     await connectDb().then(async (res) => {
//       const user = await currentUser();

//       // console.log(user, "user server")
//       console.log(user?.id, "user id server")
//       if (user) {
//         const membership = await Membership.findOne({
//           userId: user?.id,
//         });
//         console.log(membership, 'mem server')
//         return membership;

//       }
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };



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



// "use server";

// import Membership from "@/models/membership.model";
// import { connectDb } from "@/shared/libs/db";
// import { auth } from "@clerk/nextjs/server";

// export const getMemberShip = async () => {
//   try {
//     await connectDb();

//     const { userId } = await auth();
//     if (userId) {
//       const membership = await Membership.findOne({ userId });
//       console.log(membership, "membership")
//       return membership;
//     }

//     return null;
//   } catch (error) {
//     console.error("Failed to get membership:", error);
//     return null;
//   }
// };
