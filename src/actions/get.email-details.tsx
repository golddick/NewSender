// "use server";

// import { connectDb } from "@/shared/libs/db";
// import Email from "@/models/email.model";

// export const GetEmailDetails = async ({
//   title,
//   newsLetterOwnerId,
// }: {
//   title: string;
//   newsLetterOwnerId: string;
// }) => {
//   try {
//     await connectDb();
//     const email = await Email.findOne({
//       title,
//       newsLetterOwnerId,
//     });
//     return email;
//   } catch (error) {
//     console.log(error);
//   }
// };


// "use server";

// import { connectDb } from "@/shared/libs/db";
// import Email from "@/models/email.model";

// export const GetEmailDetails = async ({
//   title,
//   newsLetterOwnerId,
// }: {
//   title: string;
//   newsLetterOwnerId: string;
// }) => {
//   try {
//     await connectDb();

//     const email = await Email.findOne({
//       title,
//       newsLetterOwnerId,
//     });

//     if (!email) {
//       console.warn(`📭 No email found for title "${title}" and user ID "${newsLetterOwnerId}"`);
//       return null;
//     }

//     console.log("📬 Email fetched successfully:", {
//       title: email.title,
//       contentLength: email.content?.length || 0,
//       category: email.category,
//       campaign: email.campaign,
//     });

//     return {
//       _id: email._id,
//       title: email.title,
//       content: email.content,
//       category: email.category,
//       campaign: email.campaign,
//     };
//   } catch (error) {
//     console.error("❌ Error fetching email details:", error);
//     return null;
//   }
// };
