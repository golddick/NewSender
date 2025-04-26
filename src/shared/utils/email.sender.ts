// "use server";
// import * as AWS from "aws-sdk";
// import * as nodemailer from "nodemailer";

// interface Props {
//   userEmail: string[];
//   subject: string;
//   content: string;
// }

// AWS.config.update({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_KEY_ID,
//   region: "us-east-1",
// });

// AWS.config.getCredentials(function (error) {
//   if (error) {
//     console.log(error.stack);
//   }
// });

// const ses = new AWS.SES({ apiVersion: "2010-12-01" });

// const adminMail = "support@becodemy.com";

// // Create a transporter of nodemailer
// const transporter = nodemailer.createTransport({
//   SES: ses,
// });

// export const sendEmail = async ({ userEmail, subject, content }: Props) => {
//   try {
//     const response = await transporter.sendMail({
//       from: adminMail,
//       to: userEmail,
//       subject: subject,
//       html: content,
//     });

//     return response;
//   } catch (error) {
//     console.log(error);
//     throw error;
//   }
// };





// src/shared/utils/email.sender.ts
"use server";

import * as AWS from "aws-sdk";
import * as nodemailer from "nodemailer";

const adminMail = "support@becodemy.com";

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY_ID,
  region: "us-east-1",
});

const ses = new AWS.SES({ apiVersion: "2010-12-01" });

const transporter = nodemailer.createTransport({
  SES: ses,
});

interface Props {
  userEmail: string[];
  subject: string;
  content: string;
  emailId?: string; 
}

export const sendEmail = async ({ userEmail, subject, content, emailId }: Props) => {
  try {
    const domain = process.env.NEXT_PUBLIC_APP_DOMAIN || "http://localhost:3000";

    // Embed a 1x1 transparent pixel for "open" tracking
    const openPixel = `<img src="${domain}/api/track/open?emailId=${emailId}" width="1" height="1" style="display:none;" alt=""/>`;

    // Replace all links with click tracking links
    const modifiedHtml = content.replace(/href="([^"]+)"/g, (match, url) => {
      const encoded = encodeURIComponent(url);
      return `href="${domain}/api/track/click?url=${encoded}&emailId=${emailId}"`;
    });

    const htmlWithTracking = modifiedHtml + openPixel;

    const response = await transporter.sendMail({
      from: adminMail,
      to: userEmail,
      subject,
      html: htmlWithTracking,
    });

    return response;
  } catch (error) {
    console.error("Send Email Error:", error);
    throw error;
  }
};




// "use server";

// import nodemailer from "nodemailer";

// interface Props {
//   userEmail: string[];
//   subject: string;
//   content: string;
//   emailId?: string;
// }

// export const sendEmail = async ({ userEmail, subject, content, emailId }: Props) => {
//   try {
//     const domain = process.env.NEXT_PUBLIC_APP_DOMAIN || "http://localhost:3000";

//     // Open tracking pixel
//     const openPixel = `<img src="${domain}/api/track/open?emailId=${emailId}" width="1" height="1" style="display:none;" alt=""/>`;

//     // Replace links with click tracking
//     const modifiedHtml = content.replace(/href="([^"]+)"/g, (match, url) => {
//       const encoded = encodeURIComponent(url);
//       return `href="${domain}/api/track/click?url=${encoded}&emailId=${emailId}"`;
//     });

//     const htmlWithTracking = modifiedHtml + openPixel;

//     const transporter = nodemailer.createTransport({
//       service: process.env.SMTP_SERVICE, // 'gmail'
//       auth: {
//         user: process.env.SMTP_USER!,
//         pass: process.env.SMTP_PASS!, // this must be an app-specific password if 2FA is enabled
//       },
//     });

//     const response = await transporter.sendMail({
//       from: process.env.SMTP_FROM_EMAIL!,
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
