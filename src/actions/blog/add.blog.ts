'use server';

import { checkUsageLimit, incrementUsage } from '@/lib/checkAndUpdateUsage';
import { db } from '@/shared/libs/database';
import { currentUser } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { notifySubscribersAboutNewPost } from './notify';

export async function createBlogPost(formData: {
  title: string;
  subtitle?: string;
  authorBio: string;
  authorTitle: string;
  author: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  isDraft: boolean;
  isFeatured: boolean;
  isPublic: boolean;
  featuredImage: string;
  featuredVideo?: string;
  galleryImages?: string[];
  seoTitle?: string;
  seoDescription?: string;
  seoScore?: number;
  seoKeywords?: string[];
  allowComments?: boolean;
}) {
  const user = await currentUser();
  if (!user) {
    return { success: false, error: "You must be logged in to create a blog post" };
  }

  // Check monthly blog post usage
  const usageCheck = await checkUsageLimit(user.id, "blogPostsCreated");
  if (!usageCheck.success) {
    return {
      success: false,
      error: usageCheck.message ?? "You've reached your monthly blog post limit"
    };
  }

  try {
    // Calculate word count & read time
    const wordCount = formData.content.trim().split(/\s+/).length;
    const readTime = Math.ceil(wordCount / 200);

    const baseSlug = formData.title
    .toLowerCase()
    .replace(/[^\w\s]/g, '')       // remove punctuation
    .replace(/\s+/g, '-')          // replace spaces with dashes
    .slice(0, 60);                 // limit length

  const authorSlug = formData.author
    ?.toLowerCase()
    .replace(/[^\w\s]/g, '')       // clean up special characters
    .replace(/\s+/g, '-');         // convert spaces to dashes

  const slug = `${baseSlug}-by-${authorSlug}`;

    // Check if a post with this slug already exists
    const existingPost = await db.blogPost.findUnique({
      where: { slug },
    });

    if (existingPost) {
      return {
        success: false,
        error: "A post with this title already exists. Please choose a different title."
      };
    }

    const post = await db.blogPost.create({
      data: {
        title: formData.title,
        subtitle: formData.subtitle,
        authorBio: formData.authorBio,
        author: formData.author,
        authorTitle: formData.authorTitle,
        slug,
        content: formData.content,
        excerpt: formData.excerpt || formData.content.slice(0, 160) + '...',
        format: 'MARKDOWN',
        status: formData.isDraft ? 'DRAFT' : 'PUBLISHED',
        visibility: formData.isPublic ? 'PUBLIC' : 'PRIVATE',
        featuredImage: formData.featuredImage,
        featuredVideo:formData.featuredVideo || null,
        galleryImages: formData.galleryImages || [],
        isFeatured: formData.isFeatured,
        isPinned: false,
        allowComments: formData.allowComments ?? true,
        wordCount,
        characterCount: formData.content.length,
        readTime,
        seoTitle: formData.seoTitle,
        seoDescription: formData.seoDescription,
        seoScore: formData.seoScore || 0,
        seoKeywords: formData.seoKeywords || [],
        publishedAt: formData.isDraft ? null : new Date(),
        membership: {
          connect: { userId: user.id }
        },
        category: {
          connectOrCreate: {
            where: { name: formData.category },
            create: {
              name: formData.category,
              slug: formData.category.toLowerCase().replace(/\s+/g, '-'),
              description: null
            }
          }
        },
        tags: {
          connectOrCreate: formData.tags.map((tag) => ({
            where: { name: tag },
            create: {
              name: tag,
              slug: tag.toLowerCase().replace(/\s+/g, '-')
            }
          }))
        }
      },
      include: {
        category: true,
        tags: true,
        membership: true
      }
    });

    // Increment monthly usage only if it's a published post
    if (!formData.isDraft) {
      await incrementUsage(user.id, "blogPostsCreated", 1);

      // Notify subscribers about the new post

        const platformName = post.membership?.organization || post.membership?.userName || 'TheNews'

      await notifySubscribersAboutNewPost({
          post: post,
          adminEmail: user.emailAddresses[0].emailAddress, 
          fromApplication: platformName
        });
    }

    // Revalidate pages
    revalidatePath('/blog');
    revalidatePath(`/blog/${post.slug}`);


    return {
      success: true,
      post: {
        ...post,
        url: `/dashboard/blog/${post.slug}`
      }
    };

  } catch (error: any) {
    console.error('Error creating blog post:', error);

    // Handle specific database errors
    if (error.code === 'P2002') { // Prisma unique constraint violation
      return {
        success: false,
        error: "A post with similar details already exists. Please check your input."
      };
    }

    // Generic error handling
    return {
      success: false,
      error: getClientFriendlyErrorMessage(error)
    };
  }
}

// Helper function to transform technical errors to user-friendly messages
function getClientFriendlyErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    // Handle specific error cases
    if (error.message.includes('slug') || error.message.includes('unique')) {
      return "A post with this title already exists. Please choose a different title.";
    }
    if (error.message.includes('connect') || error.message.includes('relation')) {
      return "There was an issue with the database connection. Please try again.";
    }
    return "An unexpected error occurred while creating your post. Please try again.";
  }
  return "An unknown error occurred. Please try again later.";
}


