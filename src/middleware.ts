import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextRequest, NextResponse, NextFetchEvent } from "next/server";

// export function middleware(req: NextRequest, event: NextFetchEvent) {
//   // Create a response object for OPTIONS requests or a default response for others
//   let response = req.method === "OPTIONS" ? new NextResponse(null, {
//     status: 204,
//     headers: {
//       "Access-Control-Allow-Origin": "*", // Adjust as necessary
//       "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
//       "Access-Control-Allow-Headers": "Content-Type, Authorization",
//     },
//   }) : NextResponse.next();

//   // Ensure CORS headers are applied to all responses, not just OPTIONS
//   if (req.method !== "OPTIONS") {
//     response.headers.set("Access-Control-Allow-Origin", "*");
//     response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
//     response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   }

//   return response;
// }

import { createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in", "/sign-up", "/api/webhook", "/", "/api/subscribe"
]);

export default clerkMiddleware((auth, req) => {
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }
  return auth().then(() => NextResponse.next());
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)",  "/(api|trpc)(.*)"],
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
