// lib/cors.ts
import { NextResponse } from "next/server";

export function withCors(json: any, status = 200) {
  const res = NextResponse.json(json, { status });
  res.headers.set("Access-Control-Allow-Origin", "*"); // or restrict to frontend domains
  res.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, xypher-api-key");
  return res;
}

export function corsOptions() {
  return withCors({}, 200);
}
