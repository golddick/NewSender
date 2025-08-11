// 'use server';

// import { db } from '@/shared/libs/database';
// import { revalidatePath } from 'next/cache';
// import { checkUsageLimit, incrementUsage } from '@/lib/checkAndUpdateUsage';
// import { currentUser } from '@clerk/nextjs/server';
// import { notifySubscribersAboutNewPost } from './notify';
// import type { PostStatus } from '@prisma/client';
// import { ensurePublishingAllowed, handlePostPublishActions } from './blogPostPublishing';




// export async function updateBlogPost(
//   postId: string,
//   authorId: string,
//   {
//     title,
//     author,
//     authorTitle,
//     authorBio,
//     subtitle,
//     content,
//     excerpt,
//     category,
//     tags,
//     status,
//     featuredImage,
//     featuredVideo,
//     galleryImages,
//     seoTitle,
//     seoDescription,
//     seoKeywords,
//     allowComments,
//     isFeatured,
//     isPublic,
//   }: {
//     title: string;
//     author: string;
//     authorTitle?: string;
//     authorBio?: string;
//     subtitle?: string;
//     content?: string;
//     excerpt?: string;
//     category?: string;
//     isFeatured: boolean;
//     isPublic: boolean;
//     tags?: string[];
//     status: PostStatus;
//     featuredImage: string;
//     featuredVideo?: string;
//     galleryImages?: string[];
//     seoTitle?: string;
//     seoDescription?: string;
//     seoKeywords?: string[];
//     allowComments?: boolean;
//   }
// ) {
//   try {
//     const user = await currentUser();
//     if (!user) {
//       return { success: false, error: 'You must be logged in to update a blog post' };
//     }

//     const existingPost = await db.blogPost.findUnique({
//       where: { id: postId, authorId },
//       include: { category: true, tags: true, membership: true },
//     });

//     if (!existingPost) {
//       return { success: false, error: 'Post not found' };
//     }

//     const isPublishingNow = existingPost.status === 'DRAFT' && status === 'PUBLISHED';
//     if (isPublishingNow) {
//       const allowed = await ensurePublishingAllowed(user.id);
//       if (!allowed.success) return allowed;
//     }

//     // Word count + read time
//     const wordCount = content
//       ? content.trim().split(/\s+/).length
//       : existingPost.wordCount;
//     const readTime = Math.ceil(wordCount / 200);

//     // Slug generation
//     const baseSlug = title
//       ?.toLowerCase()
//       .replace(/[^\w\s]/g, '')
//       .replace(/\s+/g, '-')
//       .slice(0, 60);

//     const authorSlug = author
//       ?.toLowerCase()
//       .replace(/[^\w\s]/g, '')
//       .replace(/\s+/g, '-');

//     const slug =
//       existingPost.title !== title && baseSlug && authorSlug
//         ? `${baseSlug}-by-${authorSlug}`
//         : existingPost.slug;

//     // Ensure unique slug only if title changed
//     if (existingPost.title !== title) {
//       const existingSlug = await db.blogPost.findUnique({ where: { slug } });
//       if (existingSlug && existingSlug.id !== postId) {
//         return {
//           success: false,
//           error: 'A post with this slug already exists.',
//         };
//       }
//     }

//     const updatedPost = await db.blogPost.update({
//       where: { id: postId, authorId },
//       data: {
//         title,
//         subtitle,
//         slug,
//         content,
//         excerpt,
//         wordCount,
//         readTime,
//         characterCount: content?.length || existingPost.characterCount,
//         seoTitle,
//         seoDescription,
//         seoKeywords,
//         featuredImage,
//         featuredVideo,
//         galleryImages,
//         isFeatured,
//         visibility: isPublic ? 'PUBLIC' : 'PRIVATE',
//         author,
//         authorTitle,
//         authorBio,
//         status,
//         allowComments,
//         ...(category && {
//           category: {
//             connectOrCreate: {
//               where: { name: category },
//               create: {
//                 name: category,
//                 slug: category.toLowerCase().replace(/\s+/g, '-'),
//               },
//             },
//           },
//         }),
//         ...(tags && {
//           tags: {
//             set: [],
//             connectOrCreate: tags.map((tag) => ({
//               where: { name: tag },
//               create: {
//                 name: tag,
//                 slug: tag.toLowerCase().replace(/\s+/g, '-'),
//               },
//             })),
//           },
//         }),
//         publishedAt: isPublishingNow ? new Date() : existingPost.publishedAt,
//       },
//       include: {
//         category: true,
//         tags: true,
//         membership: true,
//       },
//     });

//     if (isPublishingNow) {
//       await handlePostPublishActions(
//         updatedPost,
//         user.id,
//         user.emailAddresses[0].emailAddress
//       );
//     }

//     revalidatePath('/blog');
//     revalidatePath(`/blog/${updatedPost.slug}`);

//     return { success: true, post: updatedPost };
//   } catch (error) {
//     console.error('Error updating blog post:', error);
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : 'Failed to update blog post',
//     };
//   }
// }



// lib/updateBlogPost.ts
'use server';

import { db } from '@/shared/libs/database';
import { revalidatePath } from 'next/cache';
import { currentUser } from '@clerk/nextjs/server';
import type { PostStatus } from '@prisma/client';
import { ensurePublishingAllowed, handlePostPublishActions } from './blogPostPublishing';

type UpdateBlogPostResult =
  | { success: true; post: Awaited<ReturnType<typeof db.blogPost.findUnique>> }
  | { success: false; error: string };

export async function updateBlogPost(
  postId: string,
  authorId: string,
  {
    title,
    author,
    authorTitle,
    authorBio,
    subtitle,
    content,
    excerpt,
    category,
    tags,
    status,
    featuredImage,
    featuredVideo,
    galleryImages,
    seoTitle,
    seoDescription,
    seoKeywords,
    allowComments,
    isFeatured,
    isPublic,
  }: {
    title: string;
    author: string;
    authorTitle?: string;
    authorBio?: string;
    subtitle?: string;
    content?: string;
    excerpt?: string;
    category?: string;
    isFeatured: boolean;
    isPublic: boolean;
    tags?: string[];
    status: PostStatus;
    featuredImage: string;
    featuredVideo?: string;
    galleryImages?: string[];
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string[];
    allowComments?: boolean;
  }
): Promise<UpdateBlogPostResult> {
  try {
    const user = await currentUser();
    if (!user) {
      return { success: false, error: 'You must be logged in to update a blog post' };
    }

    const existingPost = await db.blogPost.findUnique({
      where: { id: postId, authorId },
      include: { category: true, tags: true, membership: true },
    });

    if (!existingPost) {
      return { success: false, error: 'Post not found' };
    }

    const isPublishingNow = existingPost.status === 'DRAFT' && status === 'PUBLISHED';
    if (isPublishingNow) {
      const allowed = await ensurePublishingAllowed(user.id);
      if (!allowed.success) return { success: false, error: allowed.error ?? 'Publishing not allowed' };
    }

    // Word count & read time
    const wordCount = content
      ? content.trim().split(/\s+/).length
      : existingPost.wordCount;
    const readTime = Math.ceil(wordCount / 200);

    // Slug generation
    const baseSlug = title
      ?.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, '-')
      .slice(0, 60);

    const authorSlug = author
      ?.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, '-');

    const slug =
      existingPost.title !== title && baseSlug && authorSlug
        ? `${baseSlug}-by-${authorSlug}`
        : existingPost.slug;

    // Ensure unique slug only if title changed
    if (existingPost.title !== title) {
      const existingSlug = await db.blogPost.findUnique({ where: { slug } });
      if (existingSlug && existingSlug.id !== postId) {
        return {
          success: false,
          error: 'A post with this slug already exists.',
        };
      }
    }

    const updatedPost = await db.blogPost.update({
      where: { id: postId, authorId },
      data: {
        title,
        subtitle,
        slug,
        content,
        excerpt,
        wordCount,
        readTime,
        characterCount: content?.length || existingPost.characterCount,
        seoTitle,
        seoDescription,
        seoKeywords,
        featuredImage,
        featuredVideo,
        galleryImages,
        isFeatured,
        visibility: isPublic ? 'PUBLIC' : 'PRIVATE',
        author,
        authorTitle,
        authorBio,
        status,
        allowComments,
        ...(category && {
          category: {
            connectOrCreate: {
              where: { name: category },
              create: {
                name: category,
                slug: category.toLowerCase().replace(/\s+/g, '-'),
              },
            },
          },
        }),
        ...(tags && {
          tags: {
            set: [],
            connectOrCreate: tags.map((tag) => ({
              where: { name: tag },
              create: {
                name: tag,
                slug: tag.toLowerCase().replace(/\s+/g, '-'),
              },
            })),
          },
        }),
        publishedAt: isPublishingNow ? new Date() : existingPost.publishedAt,
      },
      include: {
        category: true,
        tags: true,
        membership: true,
      },
    });

    if (isPublishingNow) {
      await handlePostPublishActions(
        updatedPost,
        user.id,
        user.emailAddresses[0].emailAddress
      );
    }

    revalidatePath('/blog');
    revalidatePath(`/blog/${updatedPost.slug}`);
    revalidatePath(`/dashboard/blog`);

    return { success: true, post: updatedPost };
  } catch (error) {
    console.error('Error updating blog post:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update blog post',
    };
  }
}
