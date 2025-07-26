// export function newPostEmailTemplate({
//   author,
//   title,
//   subtitle,
//   excerpt,
//   url,
//   featuredImage,
//   platform
// }: {
//   author: string;
//   platform: string;
//   title: string;
//   subtitle?: string;
//   excerpt?: string;
//   url: string;
//   featuredImage?: string | null;
// }) {
//   return `
//   <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen;">
//     <h1 style="margin-bottom:8px;">${title}</h1>
//     ${subtitle ? `<h2 style="color:#555;margin:0 0 16px;">${subtitle}</h2>` : ''}
//     <p style="color:#777;font-size:14px;margin-bottom:24px;">By ${author}</p>

import { formatString } from "@/lib/utils";

//     ${
//       featuredImage
//         ? `<img src="${featuredImage}" alt="${title}" style="max-width:100%;border-radius:8px;margin-bottom:16px;" />`
//         : ''
//     }

//     <p style="line-height:1.6;color:#333;">${excerpt ?? ''}</p>

//     <p style="margin-top:32px;">
//       <a href="${url}" style="background:#111;color:#fff;padding:12px 20px;border-radius:6px;text-decoration:none;">
//         Read the post
//       </a>
//     </p>

//     <p style="margin-top:32px;color:#999;font-size:12px;">
//       You are receiving this email because you subscribed to ${platform}'s newsletter.
//     </p>
//   </div>
//   `;
// }



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
  ">
    <div style="text-align: center; margin-bottom: 24px;">
      <p style="
        display: inline-block;
        background: #f0f5ff;
        color: #2563eb;
        padding: 6px 12px;
        border-radius: 16px;
        font-size: 12px;
        font-weight: 500;
        margin: 0;
      ">
        New Post Notification
      </p>
    </div>

    <h1 style="
      font-size: 20px;
      font-weight: 600;
      color: #111827;
      margin: 0 0 8px;
      line-height: 1.3;
    ">
      ${title}
    </h1>

    ${subtitle && `
    <h2 style="
      font-size: 15px;
      color: #4b5563;
      font-weight: 400;
      margin: 0 0 16px;
      line-height: 1.4;
    ">
      ${subtitle}
    </h2>`}

    <p style="
      color: #6b7280;
      font-size: 14px;
      margin: 0 0 24px;
    ">
      By ${author} 
    </p>

    ${
      featuredImage
        && `<img 
            src="${featuredImage}" 
            alt="${title}" 
            style="
              max-width: 100%;
              max-height: 200px;
              border-radius: 6px;
              margin-bottom: 20px;
              object-fit: cover;
            "
          />`
       
    }

    <div style="
      background: #f9fafb;
      border-radius: 6px;
      padding: 16px;
      margin-bottom: 24px;
    ">
      <p style="
        color: #374151;
        font-size: 15px;
        line-height: 1.5;
        margin: 0 0 8px;
      ">
        ${ excerpt}
      </p>
    </div>

    <a href="${url}" style="
      display: inline-block;
      background: #2563eb;
      color: #ffffff;
      padding: 12px 24px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 500;
      font-size: 15px;
      text-align: center;
      margin-bottom: 24px;
    ">
      Read Full Post
    </a>

    <div style="
      text-align: center;
      margin-bottom: 24px;
      color: #6b7280;
      font-size: 14px;
      ">
      <a href="${HostPlatformUrl}" style="
        color: #2563eb;
        text-decoration: none;
        caplitize-text: none;
      ">
      Explore more blog post on ${HostPlatform}
      </a>
    </div>

    <div style="
      border-top: 1px solid #e5e7eb;
      padding-top: 16px;
      color: #9ca3af;
      font-size: 12px;
      line-height: 1.5;
    ">
      <p style="margin: 0;">
        You've been notified about this new post because you subscribed to ${ formatString(platform)}'s updates.
      </p>
      <p style="margin: 8px 0 0;">
        © ${new Date().getFullYear()} ${HostPlatform}  All rights reserved.
      </p>
    </div>
  </div>
  `;
}