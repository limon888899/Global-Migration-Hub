import { NextResponse } from "next/server"
import { getRedis } from "@/lib/admin/redis"

/** Best-effort client IP (Vercel sets x-forwarded-for). */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  const ip = forwarded?.split(",")[0] ?? request.headers.get("x-real-ip") ?? "unknown"
  return ip.trim()
}

/**
 * Fixed-window rate limit stored in Redis.
 * Returns a ready-made 429 response when the limit is exceeded, otherwise null.
 * If Redis is temporarily unavailable it lets the request through (fail-open).
 */
export async function rateLimit(
  request: Request,
  name: string,
  limit: number,
  windowSeconds: number,
): Promise<NextResponse | null> {
  try {
    const redis = await getRedis()
    const key = `gmh:rl:${name}:${getClientIp(request)}`
    const count = await redis.incr(key)
    if (count === 1) await redis.expire(key, windowSeconds)
    if (count > limit) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a while and try again." },
        { status: 429, headers: { "Retry-After": String(windowSeconds) } },
      )
    }
  } catch (err) {
    console.error("Rate limit check failed", err)
  }
  return null
}
