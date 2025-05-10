


"use server";

import Email from "@/models/email.model";
import { connectDb } from "@/shared/libs/db";

export const saveEmail = async ({
  title,
  content,
  newsLetterOwnerId,
  category,
  campaign,
}: {
  title: string;
  content: string;
  newsLetterOwnerId: string;
  category?: string;
  campaign?: string;
}) => {
  try {
    await connectDb();

    const existingEmail = await Email.findOne({
      title,
      newsLetterOwnerId,
    });

    if (existingEmail) {
      await Email.findByIdAndUpdate(existingEmail._id, {
        content,
        category,
        campaign,
        status: "SAVED"
      });
      return { message: "Email updated successfully!" };
    } else { 
      await Email.create({
        title,
        content,
        newsLetterOwnerId,
        category,
        campaign,
        status:'SAVED'
      });
      return { message: "Email saved successfully!" };
    }
  } catch (error) {
    console.error("Failed to save email:", error);
    throw new Error("Could not save email.");
  }
};


 




