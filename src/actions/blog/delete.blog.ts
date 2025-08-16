'use server';

import { decrementBlogUsage } from '@/lib/checkAndUpdateUsage';
import { db } from '@/shared/libs/database';
import { currentUser } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

type DeleteBlogPostResult = {
  success: boolean;
  error: string | null;
};

export async function deleteBlogPost(postId: string): Promise<DeleteBlogPostResult> {
  const user = await currentUser();
  if (!user) {
    return { success: false, error: "You must be logged in to delete a blog post" };
  }

  try {
    // Find the post and verify ownership
    const post = await db.blogPost.findUnique({
      where: { id: postId },
      include: { membership: true },
    });

    if (!post) {
      return { success: false, error: "Post not found" };
    }

    if (post.membership?.userId !== user.id) {
      return { success: false, error: "You are not authorized to delete this post" };
    }

    // Delete post
    await db.blogPost.delete({
      where: { id: postId },
    });

    // Decrement usage only if it was a published post
    if (post.status === "PUBLISHED") {
      await decrementBlogUsage(user.id, 1);
    }

    // Revalidate affected paths
    revalidatePath("/blog");
    revalidatePath(`/blog/${post.slug}`);
    revalidatePath(`/dashboard/blog/${post.slug}`);

    return { success: true, error: null };
  } catch (error: any) {
    console.error("Error deleting blog post:", error);
    return { success: false, error: error.message || "Error deleting blog post" };
  }
}
