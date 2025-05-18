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

import NewsLetterCategory from "@/models/newsLetterCategory.model";
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

    console.log(subscribers, 'ssssll')

    // ✅ Convert to plain JSON-serializable data
    const plainSubscribers = JSON.parse(JSON.stringify(subscribers));
    return plainSubscribers;
  } catch (error) {
    console.log("Error fetching subscribers:", error);
    return [];
  }
};



export const getSubscribersByCategory = async ({
  categoryId,
  ownerId
}: {
  categoryId: string;
  ownerId: string;
}) => {
  try {
    await connectDb();

    // Verify the category exists and belongs to the owner
    const category = await NewsLetterCategory.findOne({
      _id: categoryId,
      newsLetterOwnerId: ownerId
    });


    if (!category) {
      return { error: "Category not found or unauthorized" };
    }

    // Find subscribers who have this category in their subscriptions
    const subscribers = await Subscriber.find({
      category: categoryId,
      newsLetterOwnerId: ownerId,
    }).select("email ");

    return {
      subscribers: subscribers.map(sub => ({
        email: sub.email,
        name: sub.name || ""
      }))
    };
  } catch (error) {
    console.error("Error fetching subscribers:", error);
    return { error: "Failed to fetch subscribers" };
  }
};