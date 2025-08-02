

// type EmailContent = {
//   title: string;
//   subtitle?: string;
//   mainHeading?: string;
//   body: string;
//   featuredImage?: string;
//   features?: string[];
//   details?: Record<string, string>;
//   cta?: string;
//   ctaUrl?: string;
// };

// export  const generateEmailHtml = (content: EmailContent) => {
//   // Header section
//   const header = `
//     <div style="background: #000000; color: #ffffff; padding: 30px 20px; text-align: center;">
//       <h1 style="margin: 0; font-size: 20px; font-weight: bold; text-transform: uppercase;">
//         ${content.title || "WELCOME TO THENEWS!"}
//       </h1>
//     </div>
//   `;

//   // Featured image section
//   const featuredImage = content.featuredImage ? `
//     <img 
//       src="${content.featuredImage}" 
//       alt="${content.title}" 
//       style="
//         max-width: 100%;
//         height: 200px;
//         margin: 0 auto;
//         border-radius: 6px;
//         margin-bottom: 16px;
//         object-fit: cover;
//       "
//     />
//   ` : '';

//   // Main heading section
//   const mainHeading = `
//     <h2 style="color: #333333; margin-bottom: 15px; font-size: 20px; text-transform: uppercase;">
//       ${content.subtitle || "HELLO AND WELCOME!"}
//     </h2>
//   `;

//   // Body content
//   const bodyContent = `
//     <p style="color: #666666; line-height: 1.6; margin-bottom: 25px; font-size: 16px;">
//       ${content.body || ""}
//     </p>
//   `;

//   // Features section
//   const features = content.features?.length ? `
//     <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #EAB308;">
//       <h3 style="color: #333333; margin-top: 0; font-size: 15px; text-transform: uppercase;">KEY FEATURES:</h3>
//       <ul style="color: #666666; line-height: 1.8; padding-left: 20px;">
//         ${content.features.map(feature => `<li>${feature}</li>`).join("")}
//       </ul>
//     </div>
//   ` : '';

//   // Details section
//   const details = content.details && Object.keys(content.details).length ? `
//     <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0;">
//       <h4 style="color: #333333; margin-top: 0; font-size: 12px; text-transform: uppercase;">DETAILS:</h4>
//       <div style="color: #666666; line-height: 1.6; font-size: 12px;">
//         ${Object.entries(content.details)
//           .map(([key, value]) => `<p><strong>${key}:</strong> ${value}</p>`)
//           .join("")}
//       </div>
//     </div>
//   ` : '';

//   // Call to action section
//   const callToAction = content.cta ? `
//     <div style="text-align: center; margin: 35px 0;">
//       <a href="${content.ctaUrl || "#"}" 
//         style="background: #000000; color: #ffffff; padding: 15px 35px; 
//                text-decoration: none; border-radius: 6px; font-weight: bold; 
//                display: inline-block; font-size: 16px; text-transform: uppercase;">
//         ${content.cta}
//       </a>
//     </div>
//   ` : '';

//   // Footer section
//   const footer = `
//     <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eeeeee;">
//       <p style="color: #999999; font-size: 14px; margin: 0;">
//         Best regards,<br>
//         <strong>The TheNews Team</strong>
//       </p>
//     </div>
//   `;

//   // Main container
//   return `
//     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
//       ${header}
      
//       <div style="padding: 40px 30px;">
//         ${mainHeading}
//         ${featuredImage}
//         ${bodyContent}
//         ${features}
//         ${details}
//         ${callToAction}
//         ${footer}
//       </div>
//     </div>
//   `;
// };




type EmailContent = {
  title: string;
  subtitle?: string;
  mainHeading?: string;
  body: string;
  featuredImage?: string;
  features?: string[];
  details?: Record<string, string>;
  cta?: string;
  ctaUrl?: string;
};

export const generateEmailHtml = (content: EmailContent) => {
  // Header section
  const header = `
    <div style="background: #000000; color: #ffffff; padding: 30px 20px; text-align: center;">
      <h1 style="margin: 0; font-size: 20px; font-weight: bold; text-transform: uppercase;">
        ${content.title || "WELCOME TO THENEWS!"}
      </h1>
    </div>
  `;

  // Featured image section
  const featuredImage = content.featuredImage ? `
    <div style="text-align: center;">
      <img 
        src="${content.featuredImage}" 
        alt="${content.title}" 
        style="
          max-width: 100%;
          max-height: 200px;
          margin: 0 auto;
          border-radius: 6px;
          margin-bottom: 16px;
          object-fit: cover;
        "
      />
    </div>
  ` : '';

  // Main heading section
  const mainHeading = `
    <h2 style="color: #333333; margin-bottom: 12px; font-size: 20px; text-align: center; text-transform: uppercase;">
      ${content.subtitle || "HELLO AND WELCOME!"}
    </h2>
  `;

  // Body content (centered)
  const bodyContent = `
    <div style="text-align: center;">
      <p style="color: #666666; line-height: 1.6; margin-bottom: 25px; font-size: 16px; max-width: 100%; margin-left: auto; margin-right: auto;">
        ${content.body || ""}
      </p>
    </div>
  `;

  // Features section (centered)
  const features = content.features?.length ? `
    <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px auto; border-left: 4px solid #EAB308; max-width: 100%;">
      <h3 style="color: #333333; margin-top: 0; font-size: 15px; text-transform: uppercase; text-align: center;">KEY FEATURES:</h3>
      <ul style="color: #666666; line-height: 1.8; padding-left: 20px; text-align: left; display: inline-block;">
        ${content.features.map(feature => `<li>${feature}</li>`).join("")}
      </ul>
    </div>
  ` : '';

  // Details section (centered)
  const details = content.details && Object.keys(content.details).length ? `
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px auto; max-width: 100%;">
      <h4 style="color: #333333; margin-top: 0; font-size: 12px; text-transform: uppercase; text-align: center;">DETAILS:</h4>
      <div style="color: #666666; line-height: 1.6; font-size: 12px; text-align: left; display: inline-block;">
        ${Object.entries(content.details)
          .map(([key, value]) => `<p><strong>${key}:</strong> ${value}</p>`)
          .join("")}
      </div>
    </div>
  ` : '';

  // Call to action section
  const callToAction = content.cta ? `
    <div style="text-align: center; margin: 35px 0;">
      <a href="${content.ctaUrl || "#"}" 
        style="background: #000000; color: #ffffff; padding: 15px 35px; 
               text-decoration: none; border-radius: 6px; font-weight: bold; 
               display: inline-block; font-size: 16px; text-transform: uppercase;">
        ${content.cta}
      </a>
    </div>
  ` : '';

  // Footer section (right-aligned)
  const footer = `
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eeeeee; text-align: right;">
      <p style="color: #999999; font-size: 14px; margin: 0;">
        Best regards,<br>
        <strong> TheNews Team</strong>
      </p>
    </div>
  `;

  // Main container
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
      ${header}
      
      <div style="padding: 40px 30px;">
        ${mainHeading}
        ${featuredImage}
        ${bodyContent}
        ${features}
        ${details}
        ${callToAction}
        ${footer}
      </div>
    </div>
  `;
};