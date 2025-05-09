"use server";

import * as AWS from "aws-sdk";
import * as nodemailer from "nodemailer";
import mongoose from "mongoose";

import { checkUsageLimit, incrementUsage } from "@/lib/checkAndUpdateUsage";
import Email from "@/models/email.model";
import Campaign from "@/models/newsLetterCampaign.model";

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY_ID,
  region: "eu-north-1",
});

const ses = new AWS.SES({ apiVersion: "2010-12-01" });
const transporter = nodemailer.createTransport({ SES: ses });

interface Props {
  userEmail: string[];
  subject: string;
  content: string;
  emailId: string;
  category?: string;
  campaign?: string;
  newsLetterOwnerId: string;
  contentJson: string;

}

export const sendEmail = async ({
  userEmail,
  subject,
  content,
  emailId,
  category,
  campaign,
  newsLetterOwnerId,
  contentJson
}: Props) => {
  try {
    if (!newsLetterOwnerId) {
      return { error: "User not found or not authenticated." };
    }

    console.log(campaign, "Campaign ID");
    console.log(category, "Category ID");

    
    let actualEmailId = emailId;

    const userId = newsLetterOwnerId;
    const adminMail = process.env.ADMIN_EMAIL || "goldick60@gmail.com";
    const domain = process.env.NEXT_PUBLIC_APP_DOMAIN || "https://denews-xi.vercel.app/";

    // ✅ Check usage limit
    const usageCheck = await checkUsageLimit(userId, "emailsSent");
    if (!usageCheck.success) {
      return { error: usageCheck.message };
    }

    // ✅ First: Check if the email exists in DB
    let emailDoc = await Email.findOne({ title: subject, newsLetterOwnerId: userId });

    // ✅ If not exists, save it before sending
    if (!emailDoc) {
      emailDoc = await Email.create({
        title: subject,
        content: contentJson,
        newsLetterOwnerId: userId,
        category,
        campaign,
      });
    }

    actualEmailId = emailDoc._id.toString(); // Ensure we have a valid ID for tracking


    // ✅ Track opens/clicks
    const openPixel = `<img src="${domain}/api/track/open?emailId=${actualEmailId}" width="1" height="1" style="display:none;" alt=""/>`;
    const modifiedHtml = content.replace(/href="([^"]+)"/g, (match, url) => {
      const encoded = encodeURIComponent(url);
      return `href="${domain}/api/track/click?url=${encoded}&emailId=${actualEmailId}"`;
    });
    const htmlWithTracking = modifiedHtml + openPixel;

    // ✅ Send email
    const response = await transporter.sendMail({
      from: adminMail,
      to: userEmail,
      subject,
      html: htmlWithTracking,
    });

    console.log(response, "Email Response");

    if (response.accepted.length === 0) {
      return { error: "Failed to send email." };
    }

    // ✅ Link to campaign and update sent count
    if (campaign && mongoose.Types.ObjectId.isValid(campaign)) {
      const campaignDoc = await Campaign.findById(campaign);

      console.log(campaignDoc, "Campaign Document");

      // Check if the campaign exists
      if (campaignDoc) {
        // 1. Link the email to the campaign if it's not already linked
        const alreadyLinked = campaignDoc.emails.some((id: mongoose.Types.ObjectId) =>
          id.equals(emailDoc._id)
        );
        
        if (!alreadyLinked) {
          campaignDoc.emails.push(emailDoc._id);
        }

        // 2. Increment the emailsSent count
        campaignDoc.emailsSent = (campaignDoc.emailsSent || 0) + 1;

        // 3. Save the updated campaign document
        await campaignDoc.save();
      }
    }

    // ✅ Increment usage regardless
    await incrementUsage(userId, "emailsSent");

    return {
      success: true,
      message: emailDoc.wasNew
        ? "Email saved, sent, and campaign updated."
        : "Email already existed, sent and campaign updated.",
    };
  } catch (error) {
    console.error("Send Email Error:", error);
    return {
      error: error instanceof Error ? error.message : "An unexpected error occurred.",
    };
  }
};






// // src/shared/utils/email.sender.ts
// "use server";

// import * as AWS from "aws-sdk";
// import * as nodemailer from "nodemailer";

// const adminMail = "golddick60@gmail.com";

// AWS.config.update({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_KEY_ID,
//   region: "eu-north-1",
// });

// const ses = new AWS.SES({ apiVersion: "2010-12-01" });

// const transporter = nodemailer.createTransport({
//   SES: ses,
// });

// interface Props {
//   userEmail: string[];
//   subject: string;
//   content: string;
//   emailId?: string; 
//   category?: string;
//   campaign?: string;
// }

// export const sendEmail = async ({ userEmail, subject, content, emailId, category, campaign }: Props) => {
//   try {
//     const domain = process.env.NEXT_PUBLIC_APP_DOMAIN || "http://localhost:3000";

//     // Embed a 1x1 transparent pixel for "open" tracking
//     const openPixel = `<img src="${domain}/api/track/open?emailId=${emailId}" width="1" height="1" style="display:none;" alt=""/>`;

//     // Replace all links with click tracking links
//     const modifiedHtml = content.replace(/href="([^"]+)"/g, (match, url) => {
//       const encoded = encodeURIComponent(url);
//       return `href="${domain}/api/track/click?url=${encoded}&emailId=${emailId}"`;
//     });

//     const htmlWithTracking = modifiedHtml + openPixel;

//     const response = await transporter.sendMail({
//       from: adminMail,
//       to: userEmail,
//       subject,
//       html: htmlWithTracking,
//     });

//     return response;
//   } catch (error) {
//     console.error("Send Email Error:", error);
//     throw error;
//   }
// };


