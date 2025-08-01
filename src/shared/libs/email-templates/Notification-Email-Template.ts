

// type EmailContent = {
//   title: string;
//   subtitle?: string;
//   heading?: string;
//   body: string;
//   features?: string[];
//   cta?: string;
//   ctaUrl?: string;
// };

// export const generateEmailHtml = (content: EmailContent): string => {
//   return `
//     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
//       <!-- Header -->
//       <div style="background: #000000; color: #ffffff; padding: 30px 20px; text-align: center;">
//         <h1 style="margin: 0; font-size: 28px; font-weight: bold; text-transform: uppercase;">
//           ${content.title || "WELCOME TO THENEWS!"}
//         </h1>
//         ${
//           content.subtitle
//             ? `<p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9; text-transform: uppercase;">
//                 ${content.subtitle}
//                </p>`
//             : ""
//         }
//       </div>

//       <!-- Body -->
//       <div style="padding: 40px 30px;">
//         <h2 style="color: #333333; margin-bottom: 20px; font-size: 24px; text-transform: uppercase;">
//           ${content.heading || "HELLO AND WELCOME!"}
//         </h2>
//         <p style="color: #666666; line-height: 1.6; margin-bottom: 25px; font-size: 16px;">
//           ${content.body || ""}
//         </p>

//         ${
//           content.features && content.features.length > 0
//             ? `
//               <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #EAB308;">
//                 <h3 style="color: #333333; margin-top: 0; font-size: 20px; text-transform: uppercase;">WHAT'S NEXT?</h3>
//                 <ul style="color: #666666; line-height: 1.8; padding-left: 20px;">
//                   ${content.features.map((f) => `<li>${f}</li>`).join("")}
//                 </ul>
//               </div>
//             `
//             : ""
//         }

//         ${
//           content.cta
//             ? `
//               <div style="text-align: center; margin: 35px 0;">
//                 <a href="${content.ctaUrl || "#"}" 
//                   style="background: #000000; color: #ffffff; padding: 15px 35px; text-decoration: none; 
//                          border-radius: 6px; font-weight: bold; display: inline-block; font-size: 16px; text-transform: uppercase;">
//                   ${content.cta}
//                 </a>
//               </div>
//             `
//             : ""
//         }
//       </div>
//     </div>
//   `;
// };




type EmailContent = {
  title: string;
  subtitle?: string;
  mainHeading?: string;
  body: string;
  features?: string[];
  details?: Record<string, string>;
  cta?: string;
  ctaUrl?: string;
};

export const generateEmailHtml = (content: EmailContent): string => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
      <!-- Header -->
      <div style="background: #000000; color: #ffffff; padding: 30px 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px; font-weight: bold; text-transform: uppercase;">
          ${content.title || "WELCOME TO THENEWS!"}
        </h1>
        ${
          content.subtitle
            ? `<p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">${content.subtitle}</p>`
            : ""
        }
      </div>

      <!-- Body -->
      <div style="padding: 40px 30px;">
        <h2 style="color: #333333; margin-bottom: 20px; font-size: 24px; text-transform: uppercase;">
          ${content.mainHeading || "HELLO AND WELCOME!"}
        </h2>
        <p style="color: #666666; line-height: 1.6; margin-bottom: 25px; font-size: 16px;">
          ${content.body || ""}
        </p>

        ${
          content.features && content.features.length > 0
            ? `
            <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #EAB308;">
              <h3 style="color: #333333; margin-top: 0; font-size: 20px; text-transform: uppercase;">KEY FEATURES:</h3>
              <ul style="color: #666666; line-height: 1.8; padding-left: 20px;">
                ${content.features.map((feature) => `<li>${feature}</li>`).join("")}
              </ul>
            </div>
          `
            : ""
        }

        ${
          content.details && Object.keys(content.details).length > 0
            ? `
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <h4 style="color: #333333; margin-top: 0; font-size: 16px; text-transform: uppercase;">DETAILS:</h4>
              <div style="color: #666666; line-height: 1.6;">
                ${Object.entries(content.details)
                  .map(([key, value]) => `<p><strong>${key}:</strong> ${value}</p>`)
                  .join("")}
              </div>
            </div>
          `
            : ""
        }

        ${
          content.cta
            ? `
            <div style="text-align: center; margin: 35px 0;">
              <a href="${content.ctaUrl || "#"}" 
                style="background: #000000; color: #ffffff; padding: 15px 35px; 
                       text-decoration: none; border-radius: 6px; font-weight: bold; 
                       display: inline-block; font-size: 16px; text-transform: uppercase;">
                ${content.cta}
              </a>
            </div>
          `
            : ""
        }

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eeeeee;">
          <p style="color: #999999; font-size: 14px; margin: 0;">
            Best regards,<br>
            <strong>The TheNews Team</strong>
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div style="background: #f8f9fa; padding: 25px; text-align: center; color: #666666; font-size: 14px;">
        <p style="margin: 0 0 10px 0;">© 2024 TheNews. All rights reserved.</p>
        <p style="margin: 0;">
          <a href="#" style="color: #666666; text-decoration: none;">Unsubscribe</a> | 
          <a href="#" style="color: #666666; text-decoration: none;">Update Preferences</a>
        </p>
      </div>
    </div>
  `;
};
