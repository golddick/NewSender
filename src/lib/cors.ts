

// import { NextResponse } from "next/server";

// export function withCors(json: any, req?: Request, status = 200) {
//   const res = NextResponse.json(json, { status });

//   // Grab the Origin header from the request
//   const origin = req?.headers.get("origin") || "*";

//   res.headers.set("Access-Control-Allow-Origin", origin);
//   res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
//   res.headers.set("Access-Control-Allow-Headers", "Content-Type, xypher-api-key");
//   res.headers.set("Access-Control-Allow-Credentials", "true"); // optional
//   return res;
// }

// // Preflight OPTIONS response
// export function corsOptions(req?: Request) {
//   return withCors({}, req, 200);
// }



// lib/cors.ts
import { NextRequest, NextResponse } from "next/server";

// Dynamic CORS that allows any origin but validates via API key
export function withCors(json: any, req: NextRequest, status = 200) {
  const res = NextResponse.json(json, { status });
  
  // Get the origin from the request
  const origin = req.headers.get("origin");
  
  // Allow any origin - security is handled by API key validation
  if (origin) {
    res.headers.set("Access-Control-Allow-Origin", origin);
    res.headers.set("Vary", "Origin");
  } else {
    res.headers.set("Access-Control-Allow-Origin", "*");
  }
  
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, xypher-api-key, Authorization");
  res.headers.set("Access-Control-Max-Age", "86400");
  res.headers.set("Access-Control-Allow-Credentials", "true");
  
  return res;
}

// Preflight OPTIONS response
export function corsOptions(req: NextRequest) {
  const res = new NextResponse(null, { status: 200 });
  
  const origin = req.headers.get("origin");
  
  // Allow any origin for preflight
  if (origin) {
    res.headers.set("Access-Control-Allow-Origin", origin);
    res.headers.set("Vary", "Origin");
  } else {
    res.headers.set("Access-Control-Allow-Origin", "*");
  }
  
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, xypher-api-key, Authorization");
  res.headers.set("Access-Control-Max-Age", "86400");
  res.headers.set("Access-Control-Allow-Credentials", "true");
  
  return res;
}