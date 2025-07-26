// actions/blog.ts
'use server';

import { BlogPostsResponse } from '@/app/type';
import { db } from '@/shared/libs/database';
import { currentUser } from '@clerk/nextjs/server';
import { BlogPost, PostStatus, Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Types
type BlogPostWithRelations = Prisma.BlogPostGetPayload<{
  include: {
    category: true;
    tags: true;
    membership: true;
    comments: true;
  };
}>;

interface GetPostsParams {
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  status?: PostStatus;
  authorId?: string;
}

interface BlogPostResponse {
  success: boolean;
  data?: BlogPostWithRelations[] | BlogPostWithRelations;
  error?: string;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
interface SingleBlogPostResponse {
  success: boolean;
  data?:  BlogPostWithRelations;
  error?: string;
}


// Get all blog posts
export async function getBlogPosts({
  page = 1,
  limit = 10,
  category,
  tag,
  search,
  sort = 'publishedAt',
  order = 'desc',
  status = 'PUBLISHED',
  authorId,
}: GetPostsParams = {}): Promise<BlogPostResponse> {
  try {
    const skip = (page - 1) * limit;

    const where: Prisma.BlogPostWhereInput = {
      status,
      ...(authorId && { authorId }),
    };

    if (category) {
      where.category = {
        slug: category,
      };
    }

    if (tag) {
      where.tags = {
        some: {
          slug: tag,
        },
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [posts, total] = await Promise.all([
      db.blogPost.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sort]: order,
        },
        include: {
          category: true,
          tags: true,
          membership: true,
          comments: {
            where: { status: 'approved' },
            orderBy: { createdAt: 'desc' },
          },
        },
      }),
      db.blogPost.count({ where }),
    ]);

    return {
      success: true,
      data: posts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return {
      success: false,
      error: 'Failed to fetch blog posts',
    };
  }
}

// Get single blog post by slug
export async function getBlogPost(
  slug: string,
  includeDraft = false
): Promise<SingleBlogPostResponse> {
  const user = await currentUser();
  const userId = user?.id || null;
  try {
    const post = await db.blogPost.findUnique({
      where: {
        slug,
        status: includeDraft ? undefined : 'PUBLISHED',
      },
      include: {
        category: true,
        tags: true,
        membership: true,
        comments: {
          where: { status: 'approved' },
          orderBy: { createdAt: 'desc' },
          include: {
            member: true,
            replies: {
              where: { status: 'approved' },
              orderBy: { createdAt: 'asc' },
              include: {
                member: true,
              },
            },
          },
        },
      },
    });

    if (!post) {
      return {
        success: false,
        error: 'Blog post not found',
      };
    }


    // Increment view count if published post
    if (post.status === 'PUBLISHED' && userId !== post.authorId) {
      await db.blogPost.update({
        where: { id: post.id },
        data: { views: { increment: 1 } },
      });
    }

    return {
      success: true,
      data: post,
    };
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return {
      success: false,
      error: 'Failed to fetch blog post',
    };
  }
}


// Get blog posts by newsletter owner 

export async function getBlogPostsByAuthor({
  page = 1,
  limit = 10,
  category,
  tag,
  search,
  sort = 'publishedAt',
  order = 'desc',
  status,
  authorId,
}: GetPostsParams = {}): Promise<BlogPostResponse> {
  try {
    const skip = (page - 1) * limit;

    const where: Prisma.BlogPostWhereInput = {
      ...(authorId && {
        membership: {
          userId: authorId,
        },
      }),
    };

    if (category) {
      where.category = {
        slug: category,
      };
    }

    if (tag) {
      where.tags = {
        some: {
          slug: tag,
        },
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [posts, total] = await Promise.all([
      db.blogPost.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sort]: order,
        },
        include: {
          category: true,
          tags: true,
          membership: true,
          comments: {
            where: { status: 'approved' },
            orderBy: { createdAt: 'desc' },
          },
        },
      }),
      db.blogPost.count({ where }),
    ]);

    return {
      success: true,
      data: posts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return {
      success: false,
      error: 'Failed to fetch blog posts',
    };
  }
}


// Get blog categories
export async function getBlogCategories() {
  try {
    const categories = await db.blogCategory.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        _count: {
          select: {
            posts: {
              where: { status: 'PUBLISHED' },
            },
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return {
      success: true,
      data: categories,
    };
  } catch (error) {
    console.error('Error fetching blog categories:', error);
    return {
      success: false,
      error: 'Failed to fetch blog categories',
    };
  }
}

// Get blog tags
export async function getBlogTags() {
  try {
    const tags = await db.blogTag.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        _count: {
          select: {
            posts: {
              where: { status: 'PUBLISHED' },
            },
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return {
      success: true,
      data: tags,
    };
  } catch (error) {
    console.error('Error fetching blog tags:', error);
    return {
      success: false,
      error: 'Failed to fetch blog tags',
    };
  }
}

// Update blog post
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
    featuredImage: string ;
    featuredVideo?: string;
    galleryImages?: string[];
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string[];
    allowComments?: boolean;
  }
) {
  try {
    const existingPost = await db.blogPost.findUnique({
      where: { id: postId , authorId:authorId },
      include: { category: true, tags: true },
    });

    if (!existingPost) {
      return { success: false, error: 'Post not found' };
    }

    // Calculate word count if content changed
    const wordCount = content
      ? content.trim().split(/\s+/).length
      : existingPost.wordCount;
    const readTime = Math.ceil(wordCount / 200);

   const baseSlug = title
  ?.toLowerCase()
  .replace(/[^\w\s]/g, '')       // remove punctuation
  .replace(/\s+/g, '-')          // replace spaces with dashes
  .slice(0, 60);                 // limit length

const authorSlug = author
  ?.toLowerCase()
  .replace(/[^\w\s]/g, '')       // clean up special characters
  .replace(/\s+/g, '-');         // convert spaces to dashes

// If title changed, generate a new slug; otherwise, keep the existing one
const slug = (existingPost.title !== title && baseSlug && authorSlug)
  ? `${baseSlug}-by-${authorSlug}`
  : existingPost.slug;

// Check slug uniqueness only if title changed
if (existingPost.title !== title) {
  const existingSlug = await db.blogPost.findUnique({
    where: { slug },
  });

  if (existingSlug && existingSlug.id !== postId) {
    return {
      success: false,
      error: 'A post with this slug already exists.',
    };
  }
}


    const updatedPost = await db.blogPost.update({
      where: { id: postId, authorId: authorId },
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
        isFeatured:isFeatured,
        visibility: isPublic ? 'PUBLIC' : 'PRIVATE' ,
        author: author,
        authorTitle: authorTitle,
        authorBio: authorBio,
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
      },
      include: {
        category: true,
        tags: true,
      },
    });

    revalidatePath('/blog');
    revalidatePath(`/blog/${updatedPost.slug}`);
    return { success: true, post: updatedPost };
  } catch (error) {
    console.error('Error updating blog post:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update blog post',
    };
  }
}



// Delete blog post
export async function deleteBlogPost(postId: string) {
  try {
    await db.blogPost.delete({
      where: { id: postId },
    });

    revalidatePath('/blog');
    return { success: true };
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete blog post',
    };
  }
}



// Get featured posts
export async function getFeaturedPosts(limit = 3) {
  try {
    const posts = await db.blogPost.findMany({
      where: {
        status: 'PUBLISHED',
        isFeatured: true,
      },
      take: limit,
      orderBy: {
        publishedAt: 'desc',
      },
      include: {
        category: true,
        tags: true,
        membership: true,
      },
    });

    return { success: true, data: posts };
  } catch (error) {
    console.error('Error fetching featured posts:', error);
    return {
      success: false,
      error: 'Failed to fetch featured posts',
    };
  }
}

// Get related posts
export async function getRelatedPosts(postId: string, limit = 3)
{
  try {
    const post = await db.blogPost.findUnique({
      where: { id: postId },
      include: { tags: true },
    });

    if (!post) {
      return { success: false, error: 'Post not found' };
    }

    const relatedPosts = await db.blogPost.findMany({
      where: {
        status: 'PUBLISHED',
        id: { not: postId },
        OR: [
          { categoryId: post.categoryId },
          { tags: { some: { id: { in: post.tags.map((tag) => tag.id) } } } },
        ],
      },
      take: limit,
      orderBy: {
        publishedAt: 'desc',
      },
      include: {
        category: true,
        tags: true,
        membership: true,
      },
    });

    return { success: true, data: relatedPosts };
  } catch (error) {
    console.error('Error fetching related posts:', error);
    return {
      success: false,
      error: 'Failed to fetch related posts',
    };
  }
}



// Update gallery images
export async function updateGalleryImages(postId: string, newGalleryImages: string[]) {
  try {
    const updated = await db.blogPost.update({
      where: { id: postId },
      data: { galleryImages: newGalleryImages },
    });

    // Optionally revalidate the blog post page
    revalidatePath(`/blog/${updated.slug}`);
    revalidatePath("/dashboard/blog");

    return { success: true };
  } catch (error) {
    console.error("Error updating gallery images:", error);
    return { success: false, error: "Failed to update gallery images" };
  }
}






