// import { NextRequest } from "next/server";
// import { db } from "@/shared/libs/database";
// import { verifyApiKey } from "@/lib/sharedApi/auth";
// import { rateLimiter } from "@/lib/rateLimiter";
// import { withCors, corsOptions } from "@/lib/cors";

// export async function OPTIONS(req: NextRequest) {
//   return corsOptions(req);
// }

// // ✅ Get single blog by slug only
// export async function GET(
//   req: NextRequest,
//   context: { params: Promise<{ slug: string }> }
// ) {
//   try {
//     // API Key verification
//     const apiKey = req.headers.get("xypher-api-key");
//     if (!apiKey) {
//       return withCors({ error: "Missing API key" }, req, 401);
//     }

//     const { userId, error } = await verifyApiKey(apiKey);
//     if (error || !userId) {
//       return withCors({ error: "Invalid API key" }, req, 403);
//     }

//     // Check if user has active membership
//     const safeUserId = userId ?? undefined;
//     const membership = await db.membership.findUnique({ 
//       where: { userId: safeUserId } 
//     });
    
//     if (!membership || membership.subscriptionStatus !== "active") {
//       return withCors({ 
//         error: "User does not have an active subscription", 
//         code: "SUBSCRIPTION_INVALID" 
//       }, req, 403);
//     }

//     const img = membership.imageUrl;

//     // Rate limiting
//     const { success, limit, remaining, reset } = await rateLimiter.limit(apiKey);
//     if (!success) {
//       const res = withCors({ error: "Rate limit exceeded" }, req, 429);
//       res.headers.set("X-RateLimit-Limit", limit.toString());
//       res.headers.set("X-RateLimit-Remaining", remaining.toString());
//       res.headers.set("X-RateLimit-Reset", reset.toString());
//       return res;
//     }

//     // Await the params promise
//     const params = await context.params;
//     const { slug } = params;

//     // Find blog by slug only
//     const blog = await db.blogPost.findFirst({
//       where: {
//         slug: slug, // Only search by slug
//         status: "PUBLISHED",
//         visibility: "PUBLIC",
//         publishedAt: {
//           lte: new Date(),
//         },
//         isFlagged: false,
//       },
//       select: {
//         id: true,
//         title: true,
//         content: true,
//         excerpt: true,
//         featuredImage: true,
//         author: true,
//         authorBio: true,
//         publishedAt: true,
//         readTime: true,
//         views: true,
//         likes: true,
//         tags: true,
//         createdAt: true,
//         category: {
//           select: {
//             name: true,
//           },
//         },
//       },
//     });

//     if (!blog) {
//       return withCors({ error: "Blog not found" }, req, 404);
//     }

//     // Increment view count
//     await db.blogPost.update({
//       where: { id: blog.id },
//       data: { views: (blog.views || 0) + 1 },
//     });

//     // Format the response
//     const formattedBlog = {
//       id: blog.id,
//       title: blog.title,
//       content: blog.content,
//       excerpt: blog.excerpt || blog.content.slice(0, 150) + '...',
//       featuredImage: blog.featuredImage || "/no-image.gif",
//       author: {
//         name: blog.author || "Unknown Author",
//         avatar: img  || "/no-image.gif",
//         bio: blog.authorBio || "",
//       },
//       publishedAt: blog.publishedAt?.toISOString() || blog.createdAt.toISOString(),
//       readTime: `${blog.readTime || 3} min read`,
//       views: (blog.views || 0) + 1,
//       likes: blog.likes || 0,
//       category: blog.category?.name || "General",
//       tags: blog.tags || [],
//     };

//     // Prepare response with rate limit headers
//     const response = withCors({
//       success: true,
//       data: formattedBlog,
//     }, req, 200);

//     // Add rate limit headers
//     response.headers.set("X-RateLimit-Limit", limit.toString());
//     response.headers.set("X-RateLimit-Remaining", remaining.toString());
//     response.headers.set("X-RateLimit-Reset", reset.toString());

//     return response;

//   } catch (err) {
//     console.error("[BLOG_API_ERROR]", err);
//     return withCors({ error: "Internal server error" }, req, 500);
//   }
// }



import { NextRequest } from "next/server";
import { db } from "@/shared/libs/database";
import { verifyApiKey } from "@/lib/sharedApi/auth";
import { rateLimiter } from "@/lib/rateLimiter";
import { withCors, corsOptions } from "@/lib/cors";

export async function OPTIONS(req: NextRequest) {
  return corsOptions(req);
}

// ✅ Get single blog by slug only
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    // API Key verification
    const apiKey = req.headers.get("xypher-api-key");
    if (!apiKey) {
      return withCors({ error: "Missing API key" }, req, 401);
    }

    const { userId, error } = await verifyApiKey(apiKey);
    if (error || !userId) {
      return withCors({ error: "Invalid API key" }, req, 403);
    }

    // Check if user has active membership
    const safeUserId = userId ?? undefined;
    const membership = await db.membership.findUnique({ 
      where: { userId: safeUserId } 
    });
    
    if (!membership || membership.subscriptionStatus !== "active") {
      return withCors({ 
        error: "User does not have an active subscription", 
        code: "SUBSCRIPTION_INVALID" 
      }, req, 403);
    }

    const img = membership.imageUrl;

    // Rate limiting
    const { success, limit, remaining, reset } = await rateLimiter.limit(apiKey);
    if (!success) {
      const res = withCors({ error: "Rate limit exceeded" }, req, 429);
      res.headers.set("X-RateLimit-Limit", limit.toString());
      res.headers.set("X-RateLimit-Remaining", remaining.toString());
      res.headers.set("X-RateLimit-Reset", reset.toString());
      return res;
    }

    // Await the params promise
    const params = await context.params;
    const { slug } = params;

    // Find blog by slug only
    const blog = await db.blogPost.findFirst({
      where: {
        slug: slug,
        status: "PUBLISHED",
        visibility: "PUBLIC",
        publishedAt: {
          lte: new Date(),
        },
        isFlagged: false,
      },
      select: {
        id: true,
        title: true,
        content: true,
        excerpt: true,
        featuredImage: true,
        featuredVideo: true, // Added
        galleryImages: true, // Added
        allowComments: true, // Added
        author: true,
        authorBio: true,
        publishedAt: true,
        readTime: true,
        views: true,
        likes: true,
        tags: true,
        createdAt: true,
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!blog) {
      return withCors({ error: "Blog not found" }, req, 404);
    }

    // Increment view count
    await db.blogPost.update({
      where: { id: blog.id },
      data: { views: { increment: 1 } },
    });

    // Format the response
    const formattedBlog = {
      id: blog.id,
      title: blog.title,
      content: blog.content,
      excerpt: blog.excerpt || blog.content.slice(0, 150) + '...',
      featuredImage: blog.featuredImage || "/no-image.gif",
      featuredVideo: blog.featuredVideo || null, // Added
      galleryImages: blog.galleryImages || [], // Added
      allowComments: blog.allowComments !== false, // Added (default to true)
      author: {
        name: blog.author || "Unknown Author",
        avatar: img  || "/no-image.gif",
        bio: blog.authorBio || "",
      },
      publishedAt: blog.publishedAt?.toISOString() || blog.createdAt.toISOString(),
      readTime: `${blog.readTime || 3} min read`,
      views: (blog.views || 0) + 1,
      likes: blog.likes || 0,
      category: blog.category?.name || "General",
      tags: blog.tags || [],
    };

    // Prepare response with rate limit headers
    const response = withCors({
      success: true,
      data: formattedBlog,
    }, req, 200);

    // Add rate limit headers
    response.headers.set("X-RateLimit-Limit", limit.toString());
    response.headers.set("X-RateLimit-Remaining", remaining.toString());
    response.headers.set("X-RateLimit-Reset", reset.toString());

    return response;

  } catch (err) {
    console.error("[BLOG_API_ERROR]", err);
    return withCors({ error: "Internal server error" }, req, 500);
  }
}