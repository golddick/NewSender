// middleware.ts or src/middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Public routes (no auth)
const isPublicRoute = createRouteMatcher([
  "/sign-in",
  "/sign-up",
  "/api/webhook",
  "/",
  "/api/subscribe",
  "/api/campaigns",
  "api/track-notifcation-mail/(.*)",
  "/api/track/(.*)",
  "/api/track/open(.*)",
  "/api/track/click(.*)",
]);

const middleware = clerkMiddleware(async (auth, req: NextRequest) => {
  const origin = req.headers.get("origin") || "*";

  // Handle OPTIONS preflight
  if (req.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": origin,
        "Vary": "Origin",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, xypher-api-key, TheNews-api-key, thenews-api-key",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  // Set CORS headers for all other requests
  const res = NextResponse.next();
  res.headers.set("Access-Control-Allow-Origin", origin);
  res.headers.set("Vary", "Origin");
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, xypher-api-key, TheNews-api-key, thenews-api-key");
  res.headers.set("Access-Control-Allow-Credentials", "true");

  // Skip auth for public routes
  if (isPublicRoute(req)) return res;

  // Require Clerk auth for protected routes
  await auth();
  return res;
});

export default middleware;

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)", "/(api|trpc)(.*)"],
};
