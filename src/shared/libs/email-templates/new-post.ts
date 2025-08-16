
// import { formatString } from "@/lib/utils";


// export function newPostNotificationTemplate({
//   author,
//   title,
//   subtitle,
//   excerpt,
//   url,
//   featuredImage,
//   platform,
//   HostPlatformUrl,
//   HostPlatform
// }: {
//   author: string;
//   platform: string;
//   title: string;
//   subtitle?: string;
//   excerpt?: string;
//   url: string;
//   HostPlatformUrl: string;
//   HostPlatform: string;
//   featuredImage?: string | null;
// }) {

//   return `
//   <div style="
//     font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
//     max-width: 600px;
//     margin: 0 auto;
//     padding: 24px;
//     background: #ffffff;
//     border-radius: 8px;
//     box-shadow: 0 2px 10px rgba(0,0,0,0.05);
//     color: #111;
//   ">

//     <div style="text-align: center; margin-bottom: 20px;">
//       <p style="
//         display: inline-block;
//         background: #000;
//         color: #FFD700;
//         padding: 6px 12px;
//         border-radius: 16px;
//         font-size: 12px;
//         font-weight: 600;
//         margin: 0;
//       ">
//         New Blog Post Alert!
//       </p>
//     </div>

//     <p style="
//       font-size: 14px;
//       color: #333;
//       margin: 0 0 12px;
//       line-height: 1.5;
//     ">
//       Hey there! A new blog post has just been published on <strong>${platform}</strong>. 
//       Here's a sneak peek of what's inside:
//     </p>

//     <h1 style="
//       font-size: 20px;
//       font-weight: bold;
//       color: #000;
//       margin: 0 0 6px;
//       line-height: 1.3;
//     ">
//       ${title}
//     </h1>

//     ${subtitle ? `
//     <h2 style="
//       font-size: 15px;
//       color: #555;
//       font-weight: 400;
//       margin: 0 0 12px;
//       line-height: 1.4;
//     ">
//       ${subtitle}
//     </h2>` : ""}

//     <p style="
//       color: #777;
//       font-size: 13px;
//       margin: 0 0 16px;
//     ">
//       By <span style="color: #000; font-weight: 600;">${author}</span>
//     </p>

//     ${
//       featuredImage
//         && `<img 
//             src="${featuredImage}" 
//             alt="${title}" 
//             style="
//               max-width: 100%;
//                max-height: 200px;
//                margin: 0 auto;
//               border-radius: 6px;
//               margin-bottom: 16px;
//               object-fit: cover;
//             "
//           />`
        
//     }

//     <div style="
//       background: #fefae0;
//       border-left: 4px solid #FFD700;
//       border-radius: 4px;
//       padding: 12px;
//       margin-bottom: 16px;
//     ">
//       <p style="
//         color: #333;
//         font-size: 14px;
//         line-height: 1.5;
//         margin: 0;
//       ">
//         ${excerpt}
//       </p>
//     </div>

//     <a href="${url}" style="
//       display: inline-block;
//       background: #000;
//       color: #FFD700;
//       padding: 10px 22px;
//       border-radius: 4px;
//       text-decoration: none;
//       font-weight: 600;
//       font-size: 14px;
//       text-align: center;
//       margin-bottom: 20px;
//     ">
//       Read Full Post
//     </a>

//     <div style="
//       text-align: center;
//       margin: 20px 0;
//       color: #555;
//       font-size: 13px;
//     ">
//       <a href="${HostPlatformUrl}" style="
//         color: #000;
//         font-weight: 500;
//         text-decoration: underline;
//       ">
//         Explore more on ${HostPlatform}
//       </a>
//     </div>

//     <div style="
//       border-top: 1px solid #e5e5e5;
//       padding-top: 12px;
//       color: #999;
//       font-size: 10px;
//       line-height: 1.5;
//     ">
//       <p style="margin: 0;">
//         You are receiving this email because you subscribed to updates from ${platform}.
//       </p>
//     </div>
//   </div>
//   `;
// }


import { formatString } from "@/lib/utils";

export function newPostNotificationTemplate({
  author,
  title,
  subtitle,
  excerpt,
  url,
  featuredImage,
  platform,
  HostPlatformUrl,
  HostPlatform
}: {
  author: string;
  platform: string;
  title: string;
  subtitle?: string;
  excerpt?: string;
  url: string;
  HostPlatformUrl: string;
  HostPlatform: string;
  featuredImage?: string | null;
}) {
  return `
  <div style="
    font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    max-width: 600px;
    margin: 0 auto;
    padding: 24px;
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    color: #111;
    text-align: center;
  ">

    <div style="margin-bottom: 20px;">
      <p style="
        display: inline-block;
        background: #000;
        color: #B39922;
        padding: 6px 12px;
        border-radius: 16px;
        font-size: 12px;
        font-weight: 600;
        margin: 0;
      ">
        New Blog Post Alert!
      </p>
    </div>

    <p style="
      font-size: 14px;
      color: #333;
      margin: 0 0 12px;
      line-height: 1.5;
    ">
      Hey there! A new blog post has just been published by <strong>${platform}</strong>. 
      Here's a sneak peek of what's inside:
    </p>

    <h1 style="
      font-size: 20px;
      font-weight: bold;
      color: #000;
      margin: 12px 0 6px;
      line-height: 1.3;
    ">
      ${title}
    </h1>

    ${
      subtitle
        ? `
      <h2 style="
        font-size: 15px;
        color: #555;
        font-weight: 300;
        margin: 0 0 12px;
        line-height: 1.4;
      ">
        ${subtitle}
      </h2>`
        : ""
    }

    <p style="
      color: #777;
      font-size: 13px;
      margin: 0 0 16px;
    ">
      Authur <span style="color: #000; font-weight: 600;">${author}</span>
    </p>

    ${
      featuredImage
        ? `<div style="text-align: center; margin-bottom: 16px;">
            <img 
              src="${featuredImage}" 
              alt="${title}" 
              style="
                max-width: 100%;
                max-height: 200px;
                margin: 0 auto;
                border-radius: 6px;
                object-fit: cover;
              "
            />
          </div>`
        : ""
    }

    <div style="
      background: #FBF8E9;
      border-left: 4px solid #B39922;
      border-radius: 4px;
      padding: 12px;
      margin-bottom: 16px;
      display: inline-block;
      text-align: left;
      max-width: 90%;
    ">
      <p style="
        color: #333;
        font-size: 14px;
        line-height: 1.5;
        margin: 0;
      ">
        ${excerpt || ""}
      </p>
    </div>

    <div>
      <a href="${url}" style="
        display: inline-block;
        background: #000;
        color: #B39922;
        padding: 10px 22px;
        border-radius: 4px;
        text-decoration: none;
        font-weight: 600;
        font-size: 14px;
        text-align: center;
        margin-bottom: 20px;
      ">
        Read Full Post
      </a>
    </div>

    <div style="
      margin: 20px 0;
      color: #555;
      font-size: 13px;
    ">
      <a href="${HostPlatformUrl}" style="
        color: #000;
        font-weight: 500;
        text-decoration: underline;
      ">
        Explore more on ${HostPlatform}
      </a>
    </div>

    <div style="
      border-top: 1px solid #e5e5e5;
      padding-top: 12px;
      color: #999;
      font-size: 10px;
      line-height: 1.5;
    ">
      <p style="margin: 0;">
        You are receiving this email because you subscribed to updates from ${platform}.
      </p>
    </div>
  </div>
  `;
}
