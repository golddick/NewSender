import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const redis = Redis.fromEnv();

export const rateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(10, "60 s"), // 10 requests / 60 sec
  analytics: true,
  prefix: "news_api",
});
