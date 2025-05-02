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
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  // Set CORS headers on all responses
  const res = NextResponse.next();
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Bypass Clerk auth for public routes
  if (isPublicRoute(req)) return res;

  await auth(); // Will throw if not authenticated
  return res;
});

export default middleware;

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)", "/(api|trpc)(.*)"],
};



// import { clerkMiddleware } from '@clerk/nextjs/server'

// export default clerkMiddleware()

// export const config = {
//   matcher: [
//     // Skip Next.js internals and all static files, unless found in search params
//     '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
//     // Always run for API routes
//     '/(api|trpc)(.*)',
//   ],
// }




// // middleware.ts (or src/middleware.ts if using src/ structure)
// import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
// import { NextRequest, NextResponse } from 'next/server';

// const isPublicRoute = createRouteMatcher([
//   "/sign-in", "/sign-up", "/api/webhook", "/", "/api/subscribe"
// ]);

// const mergedMiddleware = clerkMiddleware(async (auth, request) => {
//   if (!isPublicRoute(request)) {
//     const { userId } = await auth();

//     console.log(userId, "userId in middleware");
//     if (!userId) {
//       throw new Error("Unauthorized access");
//     }
//   }

//   // CORS Handling
//   if (request.method === "OPTIONS") {
//     return new NextResponse(null, {
//       status: 204,
//       headers: {
//         "Access-Control-Allow-Origin": "*",
//         "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
//         "Access-Control-Allow-Headers": "Content-Type, Authorization",
//       },
//     });
//   }

//   const response = NextResponse.next();
//   response.headers.set("Access-Control-Allow-Origin", "*");
//   response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
//   response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

//   return response;
// });

// export default mergedMiddleware;

// export const config = {
//   matcher: [
//     '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
//     '/(api|trpc)(.*)',
//   ],
// };
