'use server'

import { BlogComment, BlogCommentWithMember, BlogMember, CommentStatus } from '@/app/type'
import { db } from '@/shared/libs/database'
import { currentUser } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'


// Like a post
export async function likePost(postId: string) {
  try {
    const updatedPost = await db.blogPost.update({
      where: { id: postId },
      data: { likes: { increment: 1 } },
    })
    
    revalidatePath(`/blog/${postId}`)
    return { success: true, likes: updatedPost.likes }
  } catch (error) {
    console.error('Error liking post:', error)
    return { success: false, error: 'Failed to like post' }
  }
}

// Add a comment

export async function addComment(
  postId: string,
  content: string,
  authorId: string,
  slug: string,
  parentId?: string | null
): Promise<{
  success: boolean;
  comment?: BlogCommentWithMember;
  error?: string;
}> {
  try {
    const user = await currentUser();
    if (!user) {
      return { success: false, error: "You must be logged in to comment" };
    }

    if (!content.trim()) {
      return { success: false, error: "Comment cannot be empty" };
    }

    const newComment = await db.blogComment.create({
      data: {
        content,
        postId,
        userId: user.id,
        authorId,
        status: "approved",
        ...(parentId && { parentId }),
      },
      include: {
        member: true,
        ...(parentId === undefined && {
          replies: {
            include: {
              member: true,
            },
            orderBy: {
              createdAt: "desc",
            },
          },
        }),
      },
    });

    revalidatePath(`/blog/${slug}`);
    return {
      success: true,
      comment: newComment as unknown as BlogCommentWithMember,
    };
  } catch (error) {
    console.error("Error adding comment:", error);
    return { success: false, error: "Failed to add comment" };
  }
}


export async function likeComment(commentId: string) {
  try {
    const updatedComment = await db.blogComment.update({
      where: { id: commentId },
      data: { likes: { increment: 1 } },
    })

    revalidatePath(`/blog/${updatedComment.postId}`)
    return { success: true, likes: updatedComment.likes }
  } catch (error) {
    console.error('Error liking comment:', error)
    return { success: false, error: 'Failed to like comment' }
  }
}


// // Create comment
// export async function createComment({
//   content,
//   postId,
//   authorId,
//   parentId,
//   userId
// }: {
//   content: string;
//   postId: string;
//   authorId: string;
//   userId: string;
//   parentId?: string;
// }) {
//   try {
//     const comment = await db.blogComment.create({
//       data: {
//         content,
//         postId,
//         authorId,
//         parentId,
//         userId: userId,
//         status: 'approved',
//       },
//       include: {
//         member: true,
//       },
//     });

//     revalidatePath(`/blog/${postId}`);
//     return { success: true, comment };
//   } catch (error) {
//     console.error('Error creating comment:', error);
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : 'Failed to create comment',
//     };
//   }
// }

export const editComment = async (commentId: string, content: string) => {
  try {

  const user = await currentUser();
  if (!user) {
    return { success: false, error: "You must be logged in to create a blog post" };
  }
  const userId = user.id;

    const updatedComment = await db.blogComment.update({
      where: { id: commentId , userId: userId },
      data: { content },
      include: { member: true }
    });

    return { 
      success: true,
      comment: updatedComment
    };
  } catch (error) {
    return { 
      success: false,
      error: "Failed to update comment"
    };
  }
};

export const deleteComment = async (commentId: string) => {
  try {

      const user = await currentUser();
  if (!user) {
    return { success: false, error: "You must be logged in to create a blog post" };
  }

  const userId = user.id


    await db.blogComment.delete({
      where: { id: commentId, userId: userId },
    });

    return { success: true };
  } catch (error) {
    return { 
      success: false,
      error: "Failed to delete comment"
    };
  }
};

export const reportComment = async (commentId: string, blogSlug: string, blogOwner:string, parentCommentBy:string,  ) => {
  try {
     const user = await currentUser();
  if (!user) {
    return { success: false, error: "You must be logged in to create a blog post" };
  }
    const userId = user.id;
    await db.reportedComment.create({
      data: {
        commentId,
        blogSlug,
        blogOwner,
        reason: "Inappropriate content", 
        parentCommentBy,
        reportedBy: userId,
        reportedAt: new Date()
      }
    });

    return { success: true };
  } catch (error) {
    return { 
      success: false,
      error: "Failed to report comment"
    };
  }
};