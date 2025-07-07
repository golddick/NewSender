// // src/actions/delete-category-by-name.ts
// "use server";

// import { currentUser } from "@clerk/nextjs/server";
// import { connectDb } from "@/shared/libs/db";
// import NewsLetterCategory from "@/models/newsLetterCategory.model";
// import Campaign from "@/models/newsLetterCampaign.model";
// import MembershipUsage from "@/models/membershipUsage.model"; // Import the usage model

// export const deleteCategoryByName = async (categoryName: string) => {
//   try {
//     const user = await currentUser();
//     const userId = user?.id;

//     if (!userId) {
//       throw new Error("Unauthorized: User not authenticated");
//     }

//     await connectDb();

//     // 1. Find the category by name and verify ownership
//     const category = await NewsLetterCategory.findOne({
//       name: categoryName,
//       newsLetterOwnerId: userId,
//     });

//     if (!category) {
//       throw new Error("Category not found or you don't have permission to delete it");
//     }

//     // 2. Check if any campaigns in this category exist
//     const campaignsInCategory = await Campaign.find({
//       categoryId: category._id,
//     });

//     if (campaignsInCategory.length > 0) {
//       // 3. Check if any campaigns have subscribers
//       const campaignsWithSubscribers = campaignsInCategory.filter(
//         (campaign) => campaign.subscribers > 0
//       );

//       if (campaignsWithSubscribers.length > 0) {
//         const campaignNames = campaignsWithSubscribers
//           .map((c) => c.name)
//           .join(", ");
//         throw new Error(
//           `Cannot delete category "${categoryName}": These campaigns have subscribers: ${campaignNames}. Please delete or move the campaigns first.`
//         );
//       }

//       // 4. Delete all empty campaigns in this category
//       await Campaign.deleteMany({ categoryId: category._id });
//     }

//     // 5. Delete the category
//     await NewsLetterCategory.deleteOne({
//       name: categoryName,
//       newsLetterOwnerId: userId,
//     });

//     // 6. Update membership usage - decrement categoriesCreated
//     const currentMonth = new Date().toISOString().slice(0, 7); // "YYYY-MM"
//     await MembershipUsage.findOneAndUpdate(
//       { 
//         userId,
//         month: currentMonth 
//       },
//       { 
//         $inc: { categoriesCreated: -1 } // Decrement by 1
//       },
//       { 
//         upsert: true, // Create record if doesn't exist
//         new: true 
//       }
//     );

//     return {
//       success: true,
//       message: `Category "${categoryName}" and its associated empty campaigns were deleted successfully`,
//     };
//   } catch (error) {
//     console.error("Error deleting category by name:", error);
//     return {
//       success: false,
//       message:
//         error instanceof Error ? error.message : "Failed to delete category",
//     };
//   }
// };