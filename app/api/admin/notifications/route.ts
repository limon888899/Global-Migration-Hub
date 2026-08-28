import { NextResponse } from "next/server"
import { getRedis } from "@/lib/admin/redis"
import { requireAdminAuth } from "@/lib/admin/require-auth"
import type { VisitNotification } from "@/lib/admin/types"

export const dynamic = "force-dynamic"

const NOTIFICATIONS_KEY = "gmh:visit-notifications"
const LAST_READ_KEY = "gmh:visit-notifications:last-read"

export async function GET(request: Request) {
  const authError = requireAdminAuth(request)
  if (authError) return authError

  const redis = await getRedis()
  const [rawNotifications, lastRead] = await Promise.all([
    redis.get(NOTIFICATIONS_KEY),
    redis.get(LAST_READ_KEY),
  ])
  const notifications: VisitNotification[] = rawNotifications ? JSON.parse(rawNotifications) : []
  const lastReadAt = lastRead ? Number(lastRead) : 0
  const unreadCount = notifications.filter((n) => new Date(n.viewedAt).getTime() > lastReadAt).length

  return NextResponse.json({ notifications, unreadCount })
}

/** Marks all current notifications as read (resets the bell's unread badge). */
export async function POST(request: Request) {
  const authError = requireAdminAuth(request)
  if (authError) return authError

  const redis = await getRedis()
  await redis.set(LAST_READ_KEY, String(Date.now()))
  return NextResponse.json({ ok: true })
}
