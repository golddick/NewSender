"use client";

import { useCallback, useMemo } from "react";

type UseShareParams = {
  url: string;
  title: string;
  description?: string;
  image?: string;        // Featured image URL
  hashtags?: string[];
  via?: string;
};

type ShareLinks = {
  facebook: string;
  twitter: string;
  linkedin: string;
  whatsapp: string;
  copy: string;
};

export function useShare({
  url,
  title,
  description,
  image,
  hashtags = [],
  via,
}: UseShareParams) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedText = encodeURIComponent(
    description ? `${title} – ${description}` : title
  );
  const encodedHashtags = hashtags.join(",");

  const links: ShareLinks = useMemo(
    () => ({
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}${
        encodedHashtags ? `&hashtags=${encodedHashtags}` : ""
      }${via ? `&via=${via}` : ""}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      whatsapp: `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`,
      copy: url,
    }),
    [encodedUrl, encodedTitle, encodedText, encodedHashtags, via, url]
  );

  const open = useCallback(
    (platform: keyof ShareLinks) => {
      if (platform === "copy") {
        navigator.clipboard.writeText(url).catch(() => {});
        return;
      }
      window.open(links[platform], "_blank", "noopener,noreferrer");
    },
    [links, url]
  );

  const webShare = useCallback(async () => {
    if (typeof navigator !== "undefined" && (navigator as any).share) {
      try {
        await (navigator as any).share({
          title,
          text: description ?? title,
          url,
          ...(image ? { files: [new File([], image)] } : {}),
        });
      } catch {
        // user cancelled
      }
    } else {
      navigator.clipboard.writeText(url).catch(() => {});
    }
  }, [title, description, url, image]);

  return { links, open, webShare };
}




// // src/hooks/useShare.ts
// "use client";

// import { useCallback, useMemo } from "react";

// type UseShareParams = {
//   url: string;
//   title: string;
//   description?: string;
//   image?: string;
//   hashtags?: string[];
//   via?: string;
// };

// type ShareLinks = {
//   facebook: string;
//   twitter: string;
//   linkedin: string;
//   whatsapp: string;
//   telegram: string;
//   email: string;
//   copy: string;
// };

// export function useShare({
//   url,
//   title,
//   description = "",
//   image = "",
//   hashtags = [],
//   via = "",
// }: UseShareParams) {
//   const encodedUrl = encodeURIComponent(url);
//   const encodedTitle = encodeURIComponent(title);
//   const encodedDesc = encodeURIComponent(description);
//   const encodedText = encodeURIComponent(`${title} - ${description}`);
//   const encodedHashtags = hashtags.join(",");
//   const encodedImage = encodeURIComponent(image);

//   const links: ShareLinks = useMemo(() => ({
//     facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
//     twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}${
//       encodedHashtags ? `&hashtags=${encodedHashtags}` : ""
//     }${via ? `&via=${via}` : ""}`,
//     linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
//     whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
//     telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
//     email: `mailto:?subject=${encodedTitle}&body=${encodedText}%0D%0A${encodedUrl}`,
//     copy: url,
//   }), [encodedUrl, encodedTitle, encodedDesc, encodedText, encodedHashtags, url, via]);

//   const open = useCallback((platform: keyof ShareLinks) => {
//     if (platform === "copy") {
//       navigator.clipboard.writeText(url)
//         .then(() => console.log("URL copied to clipboard"))
//         .catch(err => console.error("Failed to copy URL:", err));
//       return;
//     }
    
//     const shareUrl = links[platform];
//     const width = 600, height = 600;
//     const left = (window.innerWidth - width) / 2;
//     const top = (window.innerHeight - height) / 2;
    
//     window.open(
//       shareUrl,
//       "_blank",
//       `width=${width},height=${height},top=${top},left=${left}`
//     );
//   }, [links, url]);

// //   const webShare = useCallback(async () => {
// //     if (navigator.share) {
// //       try {
// //         await navigator.share({
// //           title,
// //           text: description,
// //           url,
// //           ...(image && { files: [new File([image], "share-image.png", { type: "image/png" })]),
// //         });
// //       } catch (err) {
// //         console.log("Share canceled:", err);
// //       }
// //     } else {
// //       // Fallback for desktop browsers without Web Share API
// //       open('copy');
// //     }
// //   }, [title, description, url, image, open]);

//   return { links, open, webShare: () => open('copy') };
// }