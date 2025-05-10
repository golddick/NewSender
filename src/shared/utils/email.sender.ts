


// // src/actions/send-email.ts
// "use server";

// import * as AWS from "aws-sdk";
// import * as nodemailer from "nodemailer";
// import { revalidatePath } from "next/cache";
// import Email from "@/models/email.model";
// import mongoose from "mongoose";
// import { checkUsageLimit, incrementUsage } from "@/lib/checkAndUpdateUsage";
// import Campaign from "@/models/newsLetterCampaign.model";

// AWS.config.update({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_KEY_ID,
//   region: "eu-north-1",
// });

// const ses = new AWS.SES({ apiVersion: "2010-12-01" });
// const transporter = nodemailer.createTransport({ SES: ses });

// export const sendEmail = async (formData: {
//   userEmail: string[];
//   subject: string;
//   content: string;
//   emailId: string;
//   category: string;
//   campaign: string;
//   newsLetterOwnerId: string;
//   contentJson: string;
// }) => {
//   try {


//     if (!formData.newsLetterOwnerId) {
//       return { error: "User not found or not authenticated." };
//     }

//     if (!formData.campaign || !formData.category) {
//       return { error: "Campaign or Category ID is missing." };
//     }

//     const adminMail = process.env.ADMIN_EMAIL || "goldick60@gmail.com";
//     const domain = process.env.NEXT_PUBLIC_APP_DOMAIN || "https://denews-xi.vercel.app/";

//         // ✅ Check usage limit
//         const usageCheck = await checkUsageLimit(formData.newsLetterOwnerId , "emailsSent");
//         if (!usageCheck.success) {
//           return { error: usageCheck.message };
//         }

//     // Create email document (if needed)
//     let emailDoc = await Email.findOne({ title: formData.subject, newsLetterOwnerId: formData.newsLetterOwnerId });
//     if (!emailDoc) {
//       emailDoc = await Email.create({
//         title: formData.subject,
//         content: formData.contentJson,
//         newsLetterOwnerId: formData.newsLetterOwnerId,
//         category: formData.category,
//         campaign: formData.campaign,
        
//       });
//     }

//     const actualEmailId = emailDoc._id.toString();

//     // Add tracking
//     const openPixel = `<img src="${domain}/api/track/open?emailId=${actualEmailId}" width="1" height="1" style="display:none;" alt=""/>`;
//     const modifiedHtml = formData.content.replace(/href="([^"]+)"/g, (match, url) => {
//       const encoded = encodeURIComponent(url);
//       return `href="${domain}/api/track/click?emailId=${actualEmailId}&url=${encoded}"`;
//     });
//     const htmlWithTracking = modifiedHtml + openPixel;

//     // Send email
//     const response = await transporter.sendMail({
//       from: adminMail,
//       to: formData.userEmail,
//       subject: formData.subject,
//       html: htmlWithTracking,
//     });

//     // Update campaign stats
//     if (formData.campaign && mongoose.Types.ObjectId.isValid(formData.campaign)) {
//       await Campaign.findByIdAndUpdate(formData.campaign, {
//         $inc: { emailsSent: 1 },
//         $addToSet: { emails: emailDoc._id }
//       });
//     }

//         // ✅ Increment usage regardless
//     await incrementUsage(formData.newsLetterOwnerId, "emailsSent");

//     revalidatePath("/dashboard"); // Optional: Refresh dashboard data
//     return { success: true, messageId: response.messageId };
//   } catch (error) {
//     console.error("Email sending failed:", error);
//     return { error: "Failed to send email" };
//   }
// };








"use server";

import * as AWS from "aws-sdk";
import * as nodemailer from "nodemailer";
import { revalidatePath } from "next/cache";
import Email from "@/models/email.model";
import mongoose from "mongoose";
import { checkUsageLimit, incrementUsage } from "@/lib/checkAndUpdateUsage";
import Campaign from "@/models/newsLetterCampaign.model";

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY_ID,
  region: "eu-north-1",
});

const ses = new AWS.SES({ apiVersion: "2010-12-01" });
const transporter = nodemailer.createTransport({ SES: ses });

export const sendEmail = async (formData: {
  userEmail: string[];
  subject: string;
  content: string;
  emailId: string;
  category: string;
  campaign: string;
  newsLetterOwnerId: string;
  contentJson: string;
}) => {
  try {
    if (!formData.newsLetterOwnerId) {
      return { error: "User not found or not authenticated." };
    }

    if (!formData.campaign || !formData.category) {
      return { error: "Campaign or Category ID is missing." };
    }

    const adminMail = process.env.ADMIN_EMAIL || "goldick60@gmail.com";
    const domain = process.env.NEXT_PUBLIC_APP_DOMAIN || "https://denews-xi.vercel.app/";

    // ✅ Check usage limit
    const usageCheck = await checkUsageLimit(formData.newsLetterOwnerId, "emailsSent");
    if (!usageCheck.success) {
      return { error: usageCheck.message };
    }

    // ✅ Check if the email already exists
    let emailDoc = await Email.findOne({ title: formData.subject, newsLetterOwnerId: formData.newsLetterOwnerId });

    if (emailDoc) {
      // ✅ Update content and mark as SENT
      await Email.findByIdAndUpdate(emailDoc._id, {
        content: formData.contentJson,
        status: "SENT",
        category: formData.category,
        campaign: formData.campaign,
      });
    } else {
      emailDoc = await Email.create({
        title: formData.subject,
        content: formData.contentJson,
        newsLetterOwnerId: formData.newsLetterOwnerId,
        category: formData.category,
        campaign: formData.campaign,
        status: "SENT", 
      });
    }

    const actualEmailId = emailDoc._id.toString();

    // ✅ Track opens and clicks
    const openPixel = `<img src="${domain}/api/track/open?emailId=${actualEmailId}" width="1" height="1" style="display:none;" alt=""/>`;
    const modifiedHtml = formData.content.replace(/href="([^"]+)"/g, (match, url) => {
      const encoded = encodeURIComponent(url);
      return `href="${domain}/api/track/click?emailId=${actualEmailId}&url=${encoded}"`;
    });
    const htmlWithTracking = modifiedHtml + openPixel;

    // ✅ Send email
    const response = await transporter.sendMail({
      from: adminMail,
      to: formData.userEmail,
      subject: formData.subject,
      html: htmlWithTracking,
    });

    // ✅ Update campaign
    if (formData.campaign && mongoose.Types.ObjectId.isValid(formData.campaign)) {
      await Campaign.findByIdAndUpdate(formData.campaign, {
        $inc: { emailsSent: 1 },
        $addToSet: { emails: emailDoc._id },
      });
    }

    // ✅ Track usage
    await incrementUsage(formData.newsLetterOwnerId, "emailsSent");

    revalidatePath("/dashboard");

    return { success: true, messageId: response.messageId };
  } catch (error) {
    console.error("Email sending failed:", error);
    return { error: "Failed to send email" };
  }
};
