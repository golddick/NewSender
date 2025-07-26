// types/blog.ts

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface BlogMember {
  id: string;
  userId: string;
  fullName: string;
  userName: string;
  author: string;
  imageUrl: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export type CommentStatus = "pending" | "approved" ;

export interface BlogComment {
  id: string;
  content: string;
  likes: number;
  status: CommentStatus;
  createdAt: Date | string;
  updatedAt: Date | string;
  member: BlogMember;
  replies?: BlogComment[]; 
  parentId: string | null;
}

export type FormattedComment = {
  id: string;
  author: string;
  authorAvatar: string;
  date: string;
  content: string;
  likes: number;
  isLiked: boolean;
  replies: FormattedComment[];
  isAuthor: boolean;
};


export interface BlogCommentBase {
  id: string;
  content: string;
  status: CommentStatus;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
  postId: string;
  userId: string;
  authorId: string;
  parentId: string | null;
}

export interface BlogCommentWithMember extends BlogCommentBase {
  member: BlogMember;
  replies: BlogCommentWithMember[];
}

export interface BlogPost {
  id: string;
  title: string;
  subtitle?: string | null;
  slug: string;
  content: string;
  excerpt?: string | null;
  featuredImage?: string | null;
  featuredVideo?: string | null;
  galleryImages: string[];
  format: "MARKDOWN" | "HTML" | "RICH_TEXT";
  wordCount: number;
  characterCount: number;
  readTime: number;
  views: number;
  likes: number;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED" | "SCHEDULED";
  visibility: "PUBLIC" | "PRIVATE" | "MEMBERS_ONLY";
  allowComments: boolean;
  isFeatured: boolean;
  isPinned: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  publishedAt?: Date | string | null;
  scheduledAt?: Date | string | null;

  // SEO fields
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords: string[];

  // Author
  authorId: string;
  authorBio: string;
  authorAvatar?: string | null;
  authorTitle?: string | null;
  author?: string;

  // Relationships
  category: BlogCategory;
  categoryId: string;
  tags: BlogTag[];
  comments: BlogComment[];
  membership?: BlogMember | null;
  generatedById?: string | null;
}

export interface RelatedPost {
  id: string;
  title: string;
  excerpt?: string | null;
  featuredImage?: string | null;
  slug: string;
  createdAt: Date | string;
  readTime: number;
  category: {
    name: string;
    slug: string;
  };
  tags: {
    name: string;
    slug: string;
  }[];
}

export interface SingleBlogPostResponse {
  success: boolean;
  data?: BlogPost;
  error?: string;
}
export interface BlogPostsResponse {
  success: boolean;
  data?: BlogPost[];
  error?: string;
}

export interface RelatedPostsResponse {
  success: boolean;
  data?: RelatedPost[];
  error?: string;
}

export interface BlogPostReaderProps {
//   slug: string;
  post: BlogPost;
  relatedPosts: RelatedPost[];
}
