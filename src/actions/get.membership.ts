// "use server";

// import Membership from "@/models/membership.model";
// import { connectDb } from "@/shared/libs/db";
// import { currentUser } from "@clerk/nextjs";

// export const getMemberShip = async () => {
//   try {
//     await connectDb().then(async (res) => {
//       const user = await currentUser();
//       if (user) {
//         const membership = await Membership.findOne({
//           userId: user?.id,
//         });
//         return membership;
//       }
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };


"use server";

import Membership from "@/models/membership.model";
import { connectDb } from "@/shared/libs/db";
import { auth } from "@clerk/nextjs/server";

export const getMemberShip = async () => {
  try {
    await connectDb();

    const { userId } = await auth();
    if (userId) {
      const membership = await Membership.findOne({ userId });
      return membership;
    }

    return null;
  } catch (error) {
    console.error("Failed to get membership:", error);
    return null;
  }
};
