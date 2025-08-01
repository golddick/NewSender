// // lib/actions.ts
// "use server"

// import { db } from "@/shared/libs/database"

// export async function getAllCategories() {
//   return await db.blogCategory.findMany({ orderBy: { name: "asc" } })
// }


// export async function getFilteredPosts({
//   authorId,
//   category,
//   search,
//   sort,
//   order
// }: {
//   authorId: string;
//   category?: string;
//   search?: string;
//   sort?: string;
//   order?: "asc" | "desc";
// }){
//   const posts = await db.blogPost.findMany({
//     where: {
//       authorId,
//       ...(category && { category: { slug: category } }),
//       ...(search && {
//         OR: [
//           { title: { contains: search, mode: "insensitive" } },
//           { content: { contains: search, mode: "insensitive" } }
//         ]
//       })
//     },
//     include: {
//       category: true,
//       tags: true, // Added to match BlogPost type
//       membership: true,
//       comments: { // Added to match BlogPost type if needed
//         select: {
//           id: true // Only include necessary fields
//         }
//       }
//     },
//     orderBy: {
//       [sort || "publishedAt"]: order || "desc"
//     }
//   });

//   // Transform to match exact BlogPost type
//   return posts.map(post => ({
//     id: post.id,
//     title: post.title,
//     slug: post.slug,
//     content: post.content,
//     excerpt: post.excerpt,
//     format: post.format as 'MARKDOWN' | 'HTML',
//     status: post.status as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED',
//     visibility: post.visibility as 'PUBLIC' | 'PRIVATE' | 'MEMBERS_ONLY',
//     featuredImage: post.featuredImage,
//     isFeatured: post.isFeatured,
//     isPinned: post.isPinned,
//     allowComments: post.allowComments,
//     wordCount: post.wordCount,
//     characterCount: post.characterCount,
//     readTime: post.readTime,
//     views: post.views,
//     likes: post.likes,
//     seoTitle: post.seoTitle,
//     seoDescription: post.seoDescription,
//     seoKeywords: post.seoKeywords,
//     publishedAt: post.publishedAt,
//     createdAt: post.createdAt,
//     updatedAt: post.updatedAt,
//     author:post.author,
//     authorTitle:post.authorTitle,
//     category: post.category ? {
//       id: post.category.id,
//       name: post.category.name,
//       slug: post.category.slug,
//       description: post.category.description
//     } : null,
//     tags: post.tags.map(tag => ({
//       id: tag.id,
//       name: tag.name,
//       slug: tag.slug
//     })),
//     membership: {
//       id: post.membership.id,
//       userId: post.membership.userId,
//       email: post.membership.email,
//       fullName: post.membership.fullName,
//       userName: post.membership.userName,
//       imageUrl: post.membership.imageUrl
//     },
//     comments: post.comments // Include if needed, or remove if not in type
//   }));
// }

// // export async function getFilteredPosts({ authorId, category, search, sort, order }: {
// //   authorId: string,
// //   category?: string,
// //   search?: string,
// //   sort?: string,
// //   order?: "asc" | "desc"
// // }) {
// //   return await db.blogPost.findMany({
// //     where: {
// //       authorId,
// //       ...(category && { category: { slug: category } }),
// //       ...(search && {
// //         OR: [
// //           { title: { contains: search, mode: "insensitive" } },
// //           { content: { contains: search, mode: "insensitive" } }
// //         ]
// //       })
// //     },
// //     include: {
// //       category: true,
// //       membership: true
// //     },
// //     orderBy: {
// //       [sort || "publishedAt"]: order || "desc"
// //     }
// //   })
// // }






"use server"

import { db } from "@/shared/libs/database"

export async function getAllCategories() {
  return await db.blogCategory.findMany({ orderBy: { name: "asc" } })
}

export async function getFilteredPosts({
  authorId,
  category,
  search,
  sort,
  order
}: {
  authorId: string;
  category?: string;
  search?: string;
  sort?: string;
  order?: "asc" | "desc";
}) {
  // Map frontend sort fields to database fields
  const sortFieldMap: Record<string, string> = {
    updated: "updatedAt",
    created: "createdAt",
    published: "publishedAt",
    views: "views",
    likes: "likes",
    title: "title"
  };

  const dbSortField = sortFieldMap[sort || "updated"] || "updatedAt";
  const dbOrder = order || "desc";

  const posts = await db.blogPost.findMany({
    where: {
      authorId,
      ...(category && { category: { slug: category } }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { content: { contains: search, mode: "insensitive" } },
          { tags: { some: { name: { contains: search, mode: "insensitive" } } }}
        ]
      })
    },
    include: {
      category: true,
      tags: true,
      membership: true,
      _count: {
        select: {
          comments: true
        }
      }
    },
    orderBy: {
      [dbSortField]: dbOrder
    }
  });

  // Rest of your transformation code remains the same...
  return posts.map(post => ({
    id: post.id,
    title: post.title,
    subtitle: post.subtitle || "",
    excerpt: post.excerpt || "",
    content: post.content,
    featuredImage: post.featuredImage,
    featuredVideo: post.featuredVideo || null,
    galleryImages: post.galleryImages || [],
    category: post.category?.name || "Uncategorized",
    tags: post.tags.map(tag => tag.name),
    author: post.author|| post.membership.fullName || "Unknown Author",
    authorTitle: post.authorTitle || "",
    status: post.status as "DRAFT" | "PUBLISHED" | "ARCHIVED" | "SCHEDULED",
    visibility: post.visibility as "PUBLIC" | "PRIVATE" | "MEMBERS_ONLY",
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
    publishedAt: post.publishedAt?.toISOString() || null,
    scheduledAt: post.scheduledAt?.toISOString() || null,
    wordCount: post.wordCount || 0,
    readTime: post.readTime || 0,
    views: post.views || 0,
    likes: post.likes || 0,
    comments: post._count?.comments || 0,
    shares: post.shares || 0,
    seoScore: post.seoScore || 0,
    isFeatured: post.isFeatured || false,
    slug: post.slug
  }));
}

// export async function getFilteredPosts({
//   authorId,
//   category,
//   search,
//   sort,
//   order
// }: {
//   authorId: string;
//   category?: string;
//   search?: string;
//   sort?: string;
//   order?: "asc" | "desc";
// }) {
//   const posts = await db.blogPost.findMany({
//     where: {
//       authorId,
//       ...(category && { category: { slug: category } }),
//       ...(search && {
//         OR: [
//           { title: { contains: search, mode: "insensitive" } },
//           { content: { contains: search, mode: "insensitive" } },
//           { tags: { some: { name: { contains: search, mode: "insensitive" } } } }
//         ]
//       })
//     },
//     include: {
//       category: true,
//       tags: true,
//       membership: true,
//       _count: {
//         select: {
//           comments: true
//         }
//       }
//     },
//     orderBy: {
//       [sort || "updatedAt"]: order || "desc"
//     }
//   });

//   // Transform to match exact BlogPost type
//   return posts.map(post => ({
//     id: post.id,
//     title: post.title,
//     excerpt: post.excerpt || "", // Ensure excerpt is never null
//     content: post.content,
//     featuredImage: post.featuredImage,
//     category: post.category?.name || "Uncategorized",
//     tags: post.tags.map(tag => tag.name),
//     author: post.membership?.fullName || "Unknown Author",
//     authorTitle: post.membership?.userName || "",
//     status: mapStatus(post.status), // Convert status to match interface
//     visibility: mapVisibility(post.visibility), // Convert visibility
//     createdAt: post.createdAt.toISOString(),
//     updatedAt: post.updatedAt.toISOString(),
//     publishedAt: post.publishedAt?.toISOString() || null,
//     scheduledAt: post.scheduledAt?.toISOString() || null,
//     wordCount: post.wordCount || 0,
//     readTime: post.readTime || 0,
//     views: post.views || 0,
//     likes: post.likes || 0,
//     comments: post._count?.comments || 0,
//     shares:  0,
//     seoScore: calculateSeoScore(post), // You'll need to implement this
//     isFeatured: post.isFeatured || false,
//     slug: post.slug
//   }));
// }

// Helper functions to map status and visibility
// function mapStatus(status: string): "draft" | "published" | "scheduled" | "archived" {
//   switch (status) {
//     case "DRAFT": return "draft";
//     case "PUBLISHED": return "published";
//     case "SCHEDULED": return "scheduled";
//     case "ARCHIVED": return "archived";
//     default: return "draft";
//   }
// }

// function mapVisibility(visibility: string): "public" | "private" | "unlisted" {
//   switch (visibility) {
//     case "PUBLIC": return "public";
//     case "PRIVATE": return "private";
//     case "MEMBERS_ONLY": return "unlisted";
//     default: return "public";
//   }
// }
