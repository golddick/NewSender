// "use server";

// import Email from "@/models/email.model";
// import { db } from "@/shared/libs/database";

// export const deleteEmail = async ({ emailId }: { emailId: string }) => {
//   try {
//     await db();
//     await Email.findByIdAndDelete(emailId);
//     return { message: "Email deleted successfully!" };
//   } catch (error) {
//     return { error: "An error occurred while saving the email." };
//   }
// };
