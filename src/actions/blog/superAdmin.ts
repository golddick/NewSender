"use server";

import { BlogComment, BlogPost, CommentStatus } from "@/app/type";
import { requireSuperAdmin } from "@/lib/utils";
import { db } from "@/shared/libs/database";
import { currentUser } from "@clerk/nextjs/server";
import { BlogCategory, FlagStatus, PostStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";



/**
 * ✅ BlogPost type (simplified for frontend)
 */
type BlogPostDTO = {
  id: string;
  title: string;
  content?: string | null;
  author: string;
  authorEmail: string;
  status: PostStatus
   category: {
    id: string;
    name: string;
  } | null;
  tags: string[];
  publishedAt?: string;
  views: number;
  likes: number;
  comments: number;
  isFlagged: boolean;
  flagReason?: string | null;
  createdAt: string;
};

// ✅ Fetch all blog posts
export async function fetchAllBlogPosts() {
  const user = await currentUser();
  if (!user) return { success: false, error: "You must be logged in" };

  try {
    await requireSuperAdmin(user.id);

    const blogPosts = await db.blogPost.findMany({
        where: { status: PostStatus.PUBLISHED },
      include: {
        membership: { select: { id: true, fullName: true, email: true } },
        flaggedPosts: true,
        comments: true,
        tags: true,
        category: { select: { id: true, name: true } }, 
      },
      orderBy: { createdAt: "desc" },
    });

    const transformedPosts: BlogPostDTO[] = blogPosts.map((post) => ({
      id: post.id,
      title: post.title,
      content: post.content,
      author: post.membership?.fullName ?? "Unknown",
      authorEmail: post.membership?.email ?? "N/A",
      status: post.status as BlogPostDTO["status"],
      category: post.category
        ? { id: post.category.id, name: post.category.name }
        : null,
      tags: post.tags.map((t) => t.name),
      publishedAt: post.publishedAt?.toISOString(),
      views: post.views,
      likes: post.likes,
      comments: post.comments.filter((c) => c.status === "approved").length,
      isFlagged: post.isFlagged,
      flagReason: post.flagReason ?? post.flaggedPosts[0]?.reason ?? null,
      createdAt: post.createdAt.toISOString(),
    }));

    return { success: true, data: transformedPosts };
  } catch (err: any) {
    console.error("Fetch blog posts error:", err);
    return { success: false, error: err.message || "Failed to fetch blog posts" };
  }
}

// ✅ Fetch a single blog post by ID



export async function fetchBlogPostById(blogId: string) {
  try {
    const blog = await db.blogPost.findUnique({
      where: { id: blogId, status: PostStatus.PUBLISHED },
      include: {
        category: true,
        tags: true,
        comments: {
          include: {
            member: {
                select: {
                  fullName: true,
                  email: true,
                  imageUrl: true,
                  updatedAt: true,
                  userId: true,
                  id: true,
                  userName: true,
                  createdAt: true,
                  
                }
            }
          },
        },
        flaggedPosts: {
          include: {
            user: true, // ✅ Membership relation for flagger
          },
        },
        membership: {
            select: {
              fullName: true,
              email: true,
              imageUrl:true,
              organization: true,
              organizationUrl:true,
              SenderName:true,
              role: true,

            },
  
        }, // ✅ bring in the blog post's author (Membership)
      },
    });

    if (!blog) {
      return { error: "Blog not found" };
    }

    // ✅ Normalize Prisma result into BlogPost type
    const normalizedBlog: BlogPost = {
      ...blog,
      category: blog.category,
      tags: blog.tags,
      flaggedPosts: blog.flaggedPosts,
      comments: blog.comments.map((c): BlogComment => ({
        ...c,
        status: c.status as CommentStatus,
        member: {
          ...c.member, // ✅ already matches BlogMember
        },
      })),
    };

    return { blog: normalizedBlog };
  } catch (error) {
    console.error("Error fetching blog:", error);
    return { error: "Failed to fetch blog" };
  }
}





export async function updateBlogPostStatus(postId: string, status: BlogPostDTO["status"]) {
  const user = await currentUser();
  if (!user) return { success: false, error: "You must be logged in" };

  try {
    await requireSuperAdmin(user.id);

    const updatedPost = await db.blogPost.update({
      where: { id: postId },
      data: { status },
    });

    return { success: true, data: updatedPost };
  } catch (err: any) {
    console.error("Update post status error:", err);
    return { success: false, error: err.message || "Failed to update post status" };
  }
}

// ✅ Resolve blog post flag
export async function resolveBlogPostFlag(postId: string) {
  const user = await currentUser();
  if (!user) return { success: false, error: "You must be logged in" };

  try {
    await requireSuperAdmin(user.id);

    const resolvedPost = await db.blogPost.update({
      where: { id: postId },
      data: { isFlagged: false, flagReason: null },
    });

    return { success: true, data: resolvedPost };
  } catch (err: any) {
    console.error("Resolve flag error:", err);
    return { success: false, error: err.message || "Failed to resolve flag" };
  }
}

// ✅ Delete a blog post
export async function deleteBlogPost(postId: string) {
  const user = await currentUser();
  if (!user) return { success: false, error: "You must be logged in" };

  try {
    await requireSuperAdmin(user.id);
    await db.blogPost.delete({ where: { id: postId } });

    return { success: true };
  } catch (err: any) {
    console.error("Delete post error:", err);
    return { success: false, error: err.message || "Failed to delete post" };
  }
}





export async function flagBlogAction(blogId: string, reason: string, comment?: string) {
  try {
      const user = await currentUser();
  if (!user) return { success: false, error: "You must be logged in" };

  await requireSuperAdmin(user.id);

    await db.$transaction(async (tx) => {
      // Update blog flag status
      await tx.blogPost.update({
        where: { id: blogId },
        data: {
          isFlagged: true,
          flagReason: reason,
          flaggedAt: new Date(),
        //   flaggedBy: session.user.name,
        },
      });


      // Add to flag history
      await tx.blogPostFlag.create({
        data: {
          postId: blogId,
          comment:comment || "",
          status:FlagStatus.FLAGGED,
          flaggedBy:user.firstName || "",
          reason,
          userId: user.id,
          reviewedAt: new Date(),
        },
      });
    });

    revalidatePath("/xontrol/blog");
    return { success: true };
  } catch (error) {
    console.error("Error flagging blog:", error);
    return { error: "Internal server error" };
  }
}




export async function unflagBlogAction(blogId: string, comment?: string) {
  try {
      const user = await currentUser();
  if (!user) return { success: false, error: "You must be logged in" };

 await requireSuperAdmin(user.id);

    await db.$transaction(async (tx) => {
      // Reset flag fields on blog
      await tx.blogPost.update({
        where: { id: blogId },
        data: {
          isFlagged: false,
          flagReason: null,
        },
      });


      // Record in flag history
      await tx.blogPostFlag.create({
        data: {
          postId:blogId,
          status: FlagStatus.RESOLVED,
          reason: "Flag removed",
          comment: comment || '',
          flaggedBy:user.fullName || " TheNews Team",
          userId: user.id,
          reviewedAt: new Date(),
        },
      });
    });

    revalidatePath("/admin/blog");
    return { success: true };
  } catch (error) {
    console.error("Error unflagging blog:", error);
    return { error: "Internal server error" };
  }
}




