// "use server";

// import * as nodemailer from "nodemailer";
// import { revalidatePath } from "next/cache";
// import Email from "@/models/email.model";
// import mongoose from "mongoose";
// import { checkUsageLimit, incrementUsage } from "@/lib/checkAndUpdateUsage";
// import Campaign from "@/models/newsLetterCampaign.model";
// import Category from "@/models/newsLetterCategory.model";

// const BATCH_SIZE = 50;

// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,
//   port: Number(process.env.SMTP_PORT),
//   secure: true,
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,
//   },
//   tls: {
//     rejectUnauthorized: true,
//   },
// });

// const verifyTransporter = async () => {
//   try {
//     await transporter.verify();
//     return true;
//   } catch (error) {
//     console.error("SMTP connection verification failed:", error);
//     return false;
//   }
// };

// export const sendEmail = async (formData: {
//   userEmail: string[];
//   subject: string;
//   content: string;
//   emailId: string;
//   category: string;
//   campaign: string;
//   newsLetterOwnerId: string;
//   contentJson: string;
//   adminEmail: string;
// }) => {
//   const startTime = Date.now();
//   let emailDoc;

//   try {
//     // Basic validation
//     if (!formData.newsLetterOwnerId || !formData.adminEmail) {
//       return { error: "User not authenticated.", success: false };
//     }

//     if (!formData.campaign || !formData.category) {
//       return { error: "Campaign or Category is missing.", success: false };
//     }

//     if (!formData.userEmail || formData.userEmail.length === 0) {
//       return { error: "No recipients specified.", success: false };
//     }

//     // Usage Limit
//     const usageCheck = await checkUsageLimit(formData.newsLetterOwnerId, "emailsSent");
//     if (!usageCheck.success) {
//       return { error: usageCheck.message, success: false };
//     }

//     const isTransporterReady = await verifyTransporter();
//     if (!isTransporterReady) {
//       return { error: "SMTP server is not ready.", success: false };
//     }

//     const categoryDetails = await Category.findById(formData.category);
//     const categoryName = categoryDetails?.name || "Unknown";

//     emailDoc = await Email.findOneAndUpdate(
//       {
//         title: formData.subject,
//         newsLetterOwnerId: formData.newsLetterOwnerId,
//       },
//       {
//         content: formData.contentJson,
//         status: "PENDING",
//         category: formData.category,
//         campaign: formData.campaign,
//         recipientCount: formData.userEmail.length,
//         $setOnInsert: {
//           title: formData.subject,
//           newsLetterOwnerId: formData.newsLetterOwnerId,
//         },
//       },
//       { upsert: true, new: true }
//     );

//     const actualEmailId = emailDoc._id.toString();
    // // const domain = process.env.NEXT_PUBLIC_APP_DOMAIN || "https://denews-xi.vercel.app";
    // const domain =  "https://denews-xi.vercel.app";

//     const processedContent = formData.content.replace(
//       /href="([^"]+)"/g,
//       (match, url) => `href="${domain}/api/track/click?emailId=${actualEmailId}&url=${encodeURIComponent(url)}"`
//     );

//     const htmlContent = `
//       <div style="text-align: center; margin-bottom: 20px;">
//         <img src="${domain}/logo.jpg" alt="Logo" width="120" style="display: block; margin: auto;" />
//       </div>
//       ${processedContent}
//       <div style="text-align: center; margin-top: 30px;">
//         <a href="${domain}/unsubscribe?emailId=${actualEmailId}" 
//            style="padding: 10px 20px; background-color: #e63946; color: #fff; border-radius: 5px; text-decoration: none;">
//           Unsubscribe
//         </a>
//       </div>
//       <img src="${domain}/api/track/open?emailId=${actualEmailId}" width="1" height="1" style="opacity:0;" alt="tracker" />
//     `;

//     const batches = [];
//     for (let i = 0; i < formData.userEmail.length; i += BATCH_SIZE) {
//       batches.push(formData.userEmail.slice(i, i + BATCH_SIZE));
//     }

//     let totalAccepted = 0;
//     let totalRejected = 0;
//     let lastMessageId = "";

//     for (const batch of batches) {
//       const mailOptions = {
//         from: `"Newsletter Service" <${process.env.SMTP_USER}>`,
//         to: batch,
//         cc: formData.adminEmail,
//         subject: formData.subject,
//         html: htmlContent,
//         headers: {
//           "X-Email-Campaign": formData.campaign,
//           "X-Email-Category": formData.category,
//           "X-Email-ID": actualEmailId,
//         },
//       };

//       const result = await transporter.sendMail(mailOptions);
//       console.log(`Batch result: ${result.accepted.length} accepted, ${result.rejected.length} rejected`);

//       totalAccepted += result.accepted.length;
//       totalRejected += result.rejected.length;
//       lastMessageId = result.messageId || lastMessageId;

//       if (!result.messageId || result.accepted.length === 0) {
//         await Email.findByIdAndUpdate(emailDoc._id, { status: "FAILED" });
//         return {
//           error: "Email failed to send for one or more batches.",
//           success: false,
//         };
//       }
//     }

//     await Email.findByIdAndUpdate(emailDoc._id, {
//       status: "SENT",
//       messageId: lastMessageId,
//       sentAt: new Date(),
//     });

//     if (mongoose.Types.ObjectId.isValid(formData.campaign)) {
//       await Campaign.findByIdAndUpdate(formData.campaign, {
//         $inc: { emailsSent: formData.userEmail.length },
//         $addToSet: { emails: emailDoc._id },
//         lastSentAt: new Date(),
//       });
//     }

//     await incrementUsage(formData.newsLetterOwnerId, "emailsSent", formData.userEmail.length);
//     revalidatePath("/dashboard");

//     const duration = Date.now() - startTime;
//     return {
//       success: true,
//       messageId: lastMessageId,
//       stats: {
//         recipients: formData.userEmail.length,
//         accepted: totalAccepted,
//         rejected: totalRejected,
//         processingTime: duration,
//         batches: batches.length,
//       },
//     };
//   } catch (error) {
//     if (emailDoc) {
//       await Email.findByIdAndUpdate(emailDoc._id, {
//         status: "FAILED",
//         error: error instanceof Error ? error.message : "Unknown error",
//       });
//     }

//     return {
//       error: "Failed to send email",
//       success: false,
//       details: error instanceof Error ? error.message : "Unknown error",
//     };
//   }
// };



"use server";

import * as nodemailer from "nodemailer";
import { revalidatePath } from "next/cache";
import mongoose from "mongoose";
import Email from "@/models/email.model";
import Campaign from "@/models/newsLetterCampaign.model";
import Category from "@/models/newsLetterCategory.model";
import { checkUsageLimit, incrementUsage } from "@/lib/checkAndUpdateUsage";
import { connectDb } from "../libs/db";

const BATCH_SIZE = 20;

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: true,
  },
});

const verifyTransporter = async () => {
  try {
    await transporter.verify();
    return true;
  } catch (error) {
    console.error("SMTP connection verification failed:", error);
    return false;
  }
};

export const sendEmail = async (formData: {
  userEmail: string[];
  subject: string;
  content: string;
  emailId: string;
  category: string;
  campaign: string;
  newsLetterOwnerId: string;
  contentJson: string;
  adminEmail: string;
}) => {
  const startTime = Date.now();
  let emailDoc;

  try {
    await connectDb();

    if (!formData.newsLetterOwnerId || !formData.adminEmail) {
      return { error: "Missing newsletter owner ID or admin email", success: false };
    }

    if (!formData.userEmail || formData.userEmail.length === 0) {
      return { error: "No recipients specified", success: false };
    }

    const usageCheck = await checkUsageLimit(formData.newsLetterOwnerId, "emailsSent");
    if (!usageCheck.success) return { error: usageCheck.message, success: false };

    const isTransporterReady = await verifyTransporter();
    if (!isTransporterReady) return { error: "Email server is not available.", success: false };

    const categoryDetails = await Category.findById(formData.category);
    const categoryName = categoryDetails?.name || "Unknown";

    emailDoc = await Email.findOneAndUpdate(
      {
        title: formData.subject,
        newsLetterOwnerId: formData.newsLetterOwnerId,
      },
      {
        content: formData.contentJson,
        status: "PENDING",
        category: formData.category,
        campaign: formData.campaign,
        recipientCount: formData.userEmail.length,
        $setOnInsert: {
          title: formData.subject,
          newsLetterOwnerId: formData.newsLetterOwnerId,
        },
      },
      { upsert: true, new: true }
    );

    const emailId = emailDoc._id.toString();
    // const domain = process.env.NEXT_PUBLIC_APP_DOMAIN || "https://denews-xi.vercel.app";
    const domain =  "https://denews-xi.vercel.app";

    const batches = [];
    for (let i = 0; i < formData.userEmail.length; i += BATCH_SIZE) {
      batches.push(formData.userEmail.slice(i, i + BATCH_SIZE));
    }

    let totalAccepted = 0;
    let totalRejected = 0;
    let lastMessageId = "";

    for (const batch of batches) {
      // Send individually for unsubscribe link uniqueness
      for (const email of batch) {
        const trackedContent = formData.content.replace(
          /href="([^"]+)"/g,
          (match, url) => `href="${domain}/api/track/click?emailId=${emailId}&url=${encodeURIComponent(url)}"`
        );

        const htmlContent = `
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="${domain}/logo.jpg" alt="Logo" width="120" />
          </div>
          ${trackedContent}
          <div style="text-align: center; margin-top: 30px;">
            <a href="${domain}/api/unsubscribe?email=${encodeURIComponent(email)}&ownerId=${formData.newsLetterOwnerId}" 
              style="padding: 10px 20px; background-color: #e63946; color: #fff; border-radius: 5px; text-decoration: none;">
              Unsubscribe
            </a>
          </div>
          <img src="${domain}/api/track/open?emailId=${emailId}" width="1" height="1" style="opacity:0;" />
        `;

        const mailOptions = {
          from: `"Newsletter Service" <${process.env.SMTP_USER}>`,
          to: email,
          cc: formData.adminEmail,
          subject: formData.subject,
          html: htmlContent,
          headers: {
            "X-Email-Campaign": formData.campaign,
            "X-Email-Category": formData.category,
            "X-Email-ID": emailId,
          },
        };

        const result = await transporter.sendMail(mailOptions);

        if (result.accepted.length) totalAccepted++;
        if (result.rejected.length) totalRejected++;
        lastMessageId = result.messageId || lastMessageId;
      }
    }

    await Email.findByIdAndUpdate(emailId, {
      status: "SENT",
      messageId: lastMessageId,
      sentAt: new Date(),
    });

    if (mongoose.Types.ObjectId.isValid(formData.campaign)) {
      await Campaign.findByIdAndUpdate(formData.campaign, {
        $inc: { emailsSent: formData.userEmail.length },
        $addToSet: { emails: emailDoc._id },
        lastSentAt: new Date(),
      });
    }

    await incrementUsage(formData.newsLetterOwnerId, "emailsSent", formData.userEmail.length);
    revalidatePath("/dashboard");

    return {
      success: true,
      messageId: lastMessageId,
      stats: {
        total: formData.userEmail.length,
        accepted: totalAccepted,
        rejected: totalRejected,
        batches: batches.length,
        processingTime: Date.now() - startTime,
      },
    };
  } catch (error) {
    console.error("SendEmail error:", error);
    if (emailDoc) {
      await Email.findByIdAndUpdate(emailDoc._id, {
        status: "FAILED",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
    return {
      success: false,
      error: "Failed to send email",
      details: error instanceof Error ? error.message : "Unknown error",
    };
  }
};



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

//     // ✅ Check usage limit
//     const usageCheck = await checkUsageLimit(formData.newsLetterOwnerId, "emailsSent");
//     if (!usageCheck.success) {
//       return { error: usageCheck.message };
//     }

//     // ✅ Check if the email already exists
//     let emailDoc = await Email.findOne({ title: formData.subject, newsLetterOwnerId: formData.newsLetterOwnerId });

//     if (emailDoc) {
//       // ✅ Update content and mark as SENT
//       await Email.findByIdAndUpdate(emailDoc._id, {
//         content: formData.contentJson,
//         status: "SENT",
//         category: formData.category,
//         campaign: formData.campaign,
//       });
//     } else {
//       emailDoc = await Email.create({
//         title: formData.subject,
//         content: formData.contentJson,
//         newsLetterOwnerId: formData.newsLetterOwnerId,
//         category: formData.category,
//         campaign: formData.campaign,
//         status: "SENT", 
//       });
//     }

//     const actualEmailId = emailDoc._id.toString();

//     // ✅ Track opens and clicks
//     const openPixel = `<img src="${domain}/api/track/open?emailId=${actualEmailId}" width="1" height="1" style="opacity:0;" alt="tracker"/>`;
//     const modifiedHtml = formData.content.replace(/href="([^"]+)"/g, (match, url) => {
//       const encoded = encodeURIComponent(url);
//       return `href="${domain}/api/track/click?emailId=${actualEmailId}&url=${encoded}"`;
//     });
//     const htmlWithTracking = modifiedHtml + openPixel;
//     // ✅ Send email
//     const response = await transporter.sendMail({
//       from: adminMail,
//       to: formData.userEmail,
//       subject: formData.subject,
//       html: htmlWithTracking,
//     });

//     // ✅ Update campaign
//     if (formData.campaign && mongoose.Types.ObjectId.isValid(formData.campaign)) {
//       await Campaign.findByIdAndUpdate(formData.campaign, {
//         $inc: { emailsSent: 1 },
//         $addToSet: { emails: emailDoc._id },
//       });
//     }

//     // ✅ Track usage
//     await incrementUsage(formData.newsLetterOwnerId, "emailsSent");

//     revalidatePath("/dashboard");

//     return { success: true, messageId: response.messageId };
//   } catch (error) {
//     console.error("Email sending failed:", error);
//     return { error: "Failed to send email" };
//   }
// };
