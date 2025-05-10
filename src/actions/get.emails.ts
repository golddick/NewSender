

"use server";

import Email from "@/models/email.model";
import { connectDb } from "@/shared/libs/db";

export const getEmails = async ({
  newsLetterOwnerId,
}: {
  newsLetterOwnerId: string;
}) => {
  try {
    await connectDb();

    const emails = await Email.find({ newsLetterOwnerId }).lean() as Array<{
      _id: unknown;
      createdAt?: Date;
      content?: string;
      updatedAt?: Date;
      [key: string]: any;
    }>;
    console.log(emails, 'hhhhemail')
    // Convert MongoDB fields to plain JSON-safe values
    return emails.map((email) => ({
      ...email,
      _id: (email._id as string).toString(),
      content:email.content ?? '',
      createdAt: email.createdAt?.toISOString() || null,
      updatedAt: email.updatedAt?.toISOString() || null,
    }));

  
  } catch (error) {
    console.error("Error in getEmails:", error);
    return [];
  }
};
