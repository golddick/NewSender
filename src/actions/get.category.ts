// "use server";

// import NewsLetterCategory from "@/models/newsLetterCategory.model";
// import { connectDb } from "@/shared/libs/db";

// export const getCategoryByOwnerId = async ({
//   newsLetterOwnerId,
// }: {
//   newsLetterOwnerId: string;
// }) => {
//   try {
//     await connectDb();

//     // Fetch category based on the newsLetterOwnerId
//     const category = await NewsLetterCategory.findOne({
//       newsLetterOwnerId,
//     });

//     if (!category) {
//       throw new Error("Category not found");
//     }

//     // ✅ Convert to plain JSON-serializable data
//     const plainCategory = JSON.parse(JSON.stringify(category));
//     return plainCategory;
//   } catch (error) {
//     console.log("Error fetching category:", error);
//     return { error: "Category not found" };
//   }
// };



// app/actions/get.category.ts

'use server'

import Email from '@/models/email.model'
import Campaign from '@/models/newsLetterCampaign.model'
import NewsLetterCategory from '@/models/newsLetterCategory.model'
import Subscriber from '@/models/subscriber.model'
import { connectDb } from '@/shared/libs/db'

export const getCategoryByOwnerId = async ({ newsLetterOwnerId }: { newsLetterOwnerId: string }) => {
  try {
    await connectDb()
    const categories = await NewsLetterCategory.find({ newsLetterOwnerId })
    return categories.map((category) => ({
      _id: category._id.toString(),
      name: category.name,
      description: category.description,
    }))
  } catch (error) {
    console.error('Error fetching categories:', error)
    return { error: 'Failed to fetch categories' }
  }
}






export const getCategoryById = async ({ categoryId }: { categoryId: string }) => {
  try {
    await connectDb();

    const category = await NewsLetterCategory.findById(categoryId);
    if (!category) {
      return { error: 'Category not found' };
    }

    // ✅ Use 'category' field to match the updated reference structure
    const subscribers = await Subscriber.find({ category: categoryId });
    const campaignEmails = await Email.find({ category: categoryId });

    return {
      _id: category._id.toString(),
      name: category.name,
      description: category.description,
      subscribers: subscribers.map((s) => ({
        _id: s._id.toString(),
        name: s.name,
        email: s.email,
        status: s.status,
        joinedAt: s.joinedAt,
      })),
      campaignEmails: campaignEmails.map((e) => ({
        _id: e._id.toString(),
        title: e.title,
        content: e.content,
        sentAt: e.createdAt, // assuming `createdAt` as "sentAt"
        isOpened: e.isOpened,
        openedAt: e.openedAt,
        isClicked: e.isClicked,
        clickedAt: e.clickedAt,
      })),
    };
  } catch (error) {
    console.error('Error fetching category by ID:', error);
    return { error: 'Failed to fetch category details' };
  }
};




export const getCategoryByName = async ({ name }: { name: string }) => {
  try {
    await connectDb();

    const category = await NewsLetterCategory.findOne({ name });
    if (!category) {
      return { error: 'Category not found' };
    }

    const subscribers = await Subscriber.find({ category: category._id });
    const campaigns = await Campaign.find({ category: category._id });
    const campaignEmails = await Email.find({ category: category._id });

    return {
      _id: category._id.toString(),
      name: category.name,
      description: category.description,
      Categorycampaigns: campaigns.map((c) => ({
        _id: c._id.toString(),
        name: c.name,
        description: c.description,
        status: c.status,
        startDate: c.startDate,
        endDate: c.endDate,
      })),
      subscribers: subscribers.map((s) => ({
        _id: s._id.toString(),
        name: s.name,
        email: s.email,
        status: s.status,
        joinedAt: s.joinedAt,
      })),
      campaignEmails: campaignEmails.map((e) => ({
        _id: e._id.toString(),
        title: e.title,
        content: e.content,
        sentAt: e.createdAt,
        isOpened: e.isOpened,
        openedAt: e.openedAt,
        isClicked: e.isClicked,
        clickedAt: e.clickedAt,
      })),
    };
  } catch (error) {
    console.error('Error fetching category by name:', error);
    return { error: 'Failed to fetch category details' };
  }
};
