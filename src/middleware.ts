// middleware.ts or src/middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define your public routes (Clerk shouldn't protect these)
const isPublicRoute = createRouteMatcher([
  "/sign-in", 
  "/sign-up", 
  "/api/webhook", 
  "/", 
  "/api/subscribe"
]);

const middleware = clerkMiddleware(async (auth, req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, TheNews-api-key, thenews-api-key",
      },
    });
  }

  // Set CORS headers on all responses
  const res = NextResponse.next();
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, TheNews-api-key, thenews-api-key");

  // Bypass Clerk auth for public routes
  if (isPublicRoute(req)) return res;

  await auth(); // Will throw if not authenticated
  return res;
});

export default middleware;

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)", "/(api|trpc)(.*)"],
};
