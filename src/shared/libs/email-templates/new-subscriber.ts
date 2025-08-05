// // lib/templates/welcomeTemplate.ts
// interface WelcomeTemplateParams {
//   name?: string;
//   email: string;
// }

// export const getWelcomeTemplate = ({ name, email }: WelcomeTemplateParams) => ({
//   title: "Welcome to TheNews!",
//   content: {
//     subject: `Welcome${name ? ` ${name}` : ''} to TheNews!`,
//     html: `
//       <!DOCTYPE html>
//       <html>
//       <head>
//           <style>
//               body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
//               .header { background-color: #000; color: #fff; padding: 20px; text-align: center; }
//               .content { padding: 20px; }
//               .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: right; font-size: 14px; color: #999; }
//               .button { background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 20px 0; }
//           </style>
//       </head>
//       <body>
//           <div class="header">
//               <h1>Welcome to TheNews!</h1>
//           </div>
//           <div class="content">
//               <p>Hello${name ? ` ${name}` : ''},</p>
//               <p>Thank you for subscribing to our newsletter with ${email}.</p>
//               <p>We're excited to share our latest updates with you.</p>
//               <div style="text-align: center;">
//                   <a href="#" class="button">Explore Content</a>
//               </div>
//           </div>
//           <div class="footer">
//               <p>Best regards,<br>The TheNews Team</p>
//           </div>
//       </body>
//       </html>
//     `,
//     text: `Welcome${name ? ` ${name}` : ''} to TheNews!\n\nThank you for subscribing with ${email}.\n\nWe're excited to share our latest updates with you.`
//   }
// });



// lib/templates/welcomeTemplate.ts
interface WelcomeTemplateParams {
  name?: string;
  email: string;
  platformName: string;
  platformUrl: string;
}

export const getWelcomeTemplate = ({ name, email, platformName , platformUrl}: WelcomeTemplateParams) => ({
  title: `Welcome to ${platformName}!`,
  content: {
    subject: `Welcome${name ? ` ${name}` : ''} to ${platformName}!`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: #ffffff;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 24px;
            background: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            text-align: center;
            color: #111;
          }
          .badge {
            display: inline-block;
            background: #000;
            color: #FFD700;
            padding: 6px 12px;
            border-radius: 16px;
            font-size: 12px;
            font-weight: 600;
            margin-bottom: 20px;
          }
          h1 {
            font-size: 20px;
            font-weight: bold;
            color: #000;
            margin: 12px 0 6px;
          }
          p {
            font-size: 14px;
            color: #333;
            margin: 8px 0;
            line-height: 1.6;
          }
          .button {
            display: inline-block;
            background: #000;
            color: #FFD700;
            padding: 10px 22px;
            border-radius: 4px;
            text-decoration: none;
            font-weight: 600;
            font-size: 14px;
            margin-top: 20px;
          }
          .footer {
            border-top: 1px solid #e5e5e5;
            padding-top: 12px;
            color: #999;
            font-size: 10px;
            margin-top: 20px;
            line-height: 1.5;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <p class="badge">Welcome Aboard!</p>
          <h1>Welcome${name ? ` ${name}` : ''} to ${platformName}!</h1>
          <p>Thank you for subscribing to our newsletter with <strong>${email}</strong>.</p>
          <p>We're thrilled to have you join the ${platformName} community and can't wait to share the latest news and updates with you.</p>
          <a href="${platformUrl}" class="button">Explore Content</a>
          <div class="footer">
            <p>You are receiving this email because you subscribed to ${platformName}.</p>
            <p>Best regards,<br/> ${platformName} Team</p>
          </div>
        </div> 
      </body>
      </html>
    `,
    text: `Welcome${name ? ` ${name}` : ''} to ${platformName}!\n\nThank you for subscribing with ${email}.\n\nWe're thrilled to have you join the ${platformName} community and can't wait to share the latest updates with you.`,
  }
});
