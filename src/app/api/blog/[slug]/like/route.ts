import { NextRequest } from "next/server";
import { db } from "@/shared/libs/database";
import { verifyApiKey } from "@/lib/sharedApi/auth";
import { rateLimiter } from "@/lib/rateLimiter";
import { withCors, corsOptions } from "@/lib/cors";

export async function OPTIONS(req: NextRequest) {
  return corsOptions(req);
}

// ✅ Like blog post by slug
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    // API key verification
    const apiKey = req.headers.get("xypher-api-key");
    if (!apiKey) return withCors({ error: "Missing API key" }, req, 401);

    const { userId, error } = await verifyApiKey(apiKey);
    if (error || !userId) return withCors({ error: "Invalid API key" }, req, 403);

    // Membership check
    const membership = await db.membership.findUnique({ where: { userId } });
     if (!membership ) {
      return withCors({ 
        error: "No User", 
        code: "USER_NOT_FOUND" 
      }, req, 403);
    }

    // Rate limiting
    const { success, limit, remaining, reset } = await rateLimiter.limit(apiKey);
    if (!success) {
      const res = withCors({ error: "Rate limit exceeded" }, req, 429);
      res.headers.set("X-RateLimit-Limit", limit.toString());
      res.headers.set("X-RateLimit-Remaining", remaining.toString());
      res.headers.set("X-RateLimit-Reset", reset.toString());
      return res;
    }

    const { slug } = await context.params;

    // Find blog by slug
    const blog = await db.blogPost.findFirst({
      where: { slug, status: "PUBLISHED", visibility: "PUBLIC", isFlagged: false },
    });
    if (!blog) return withCors({ error: "Blog not found" }, req, 404);

    // Increment like count
    const updated = await db.blogPost.update({
      where: { id: blog.id },
      data: { likes: { increment: 1 } },
      select: { slug: true, likes: true },
    });

    const response = withCors(
      { success: true, message: "Blog liked successfully", data: updated },
      req,
      200
    );
    response.headers.set("X-RateLimit-Limit", limit.toString());
    response.headers.set("X-RateLimit-Remaining", remaining.toString());
    response.headers.set("X-RateLimit-Reset", reset.toString());

    return response;
  } catch (err) {
    console.error("[BLOG_LIKE_API_ERROR]", err);
    return withCors({ error: "Internal server error" }, req, 500);
  }
}
