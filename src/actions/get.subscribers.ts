// "use server";

// import Subscriber from "@/models/subscriber.model";
// import { connectDb } from "@/shared/libs/db";

// export const getSubscribers = async ({
//   newsLetterOwnerId,
// }: {
//   newsLetterOwnerId: string;
// }) => {
//   try {
//     await connectDb();

//     const subscribers = await Subscriber.find({
//       newsLetterOwnerId,
//     });
//     return subscribers;
//   } catch (error) {
//     console.log(error);
//   }
// };



"use server";

import Subscriber from "@/models/subscriber.model";
import { connectDb } from "@/shared/libs/db";

export const getSubscribers = async ({
  newsLetterOwnerId,
}: {
  newsLetterOwnerId: string;
}) => {
  try {
    await connectDb();

    const subscribers = await Subscriber.find({
      newsLetterOwnerId,
    });

    // ✅ Convert to plain JSON-serializable data
    const plainSubscribers = JSON.parse(JSON.stringify(subscribers));
    return plainSubscribers;
  } catch (error) {
    console.log("Error fetching subscribers:", error);
    return [];
  }
};
