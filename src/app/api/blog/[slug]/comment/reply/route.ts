
import { NextRequest } from "next/server";
import { db } from "@/shared/libs/database";
import { verifyApiKey } from "@/lib/sharedApi/auth";
import { rateLimiter } from "@/lib/rateLimiter";
import { withCors, corsOptions } from "@/lib/cors";

export async function OPTIONS(req: NextRequest) {
  return corsOptions(req);
}


export async function POST(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const apiKey = req.headers.get("xypher-api-key");
    if (!apiKey) return withCors({ error: "Missing API key" }, req, 401);

    const { userId, error } = await verifyApiKey(apiKey);
    if (error || !userId) return withCors({ error: "Invalid API key" }, req, 403);

    const membership = await db.membership.findUnique({ where: { userId } });
    if (!membership || membership.subscriptionStatus !== "active") {
      return withCors({ error: "Inactive subscription" }, req, 403);
    }

    const { success, limit, remaining, reset } = await rateLimiter.limit(apiKey);
    if (!success) {
      const res = withCors({ error: "Rate limit exceeded" }, req, 429);
      res.headers.set("X-RateLimit-Limit", limit.toString());
      res.headers.set("X-RateLimit-Remaining", remaining.toString());
      res.headers.set("X-RateLimit-Reset", reset.toString());
      return res;
    }

    const { slug } = await context.params;
    const body = await req.json();
    if (!body.commentId || !body.reply) {
      return withCors({ error: "commentId and reply are required" }, req, 400);
    }

    const post = await db.blogPost.findFirst({ where: { slug } });
    if (!post) return withCors({ error: "Blog post not found" }, req, 404);

    const parent = await db.blogComment.findUnique({ where: { id: body.commentId } });
    if (!parent) return withCors({ error: "Parent comment not found" }, req, 404);

    const reply = await db.blogComment.create({
      data: {
        content: body.reply,
        authorId: userId,
        userId: userId,
        postId: post.id,
        parentId: parent.id,
      },
    });

    const response = withCors(
      { success: true, message: "Reply added successfully", data: reply },
      req,
      201
    );
    response.headers.set("X-RateLimit-Limit", limit.toString());
    response.headers.set("X-RateLimit-Remaining", remaining.toString());
    response.headers.set("X-RateLimit-Reset", reset.toString());
    return response;
  } catch (err) {
    console.error("[COMMENT_REPLY_API_ERROR]", err);
    return withCors({ error: "Internal server error" }, req, 500);
  }
}
