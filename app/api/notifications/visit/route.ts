import { NextResponse } from "next/server"
import { getRedis } from "@/lib/admin/redis"
import { MAX_VISIT_NOTIFICATIONS, type Application, type VisitNotification } from "@/lib/admin/types"

export const dynamic = "force-dynamic"

const APPS_KEY = "gmh:applications"
const NOTIFICATIONS_KEY = "gmh:visit-notifications"

/**
 * Called (fire-and-forget) from the public /track page whenever a visitor's
 * passport/NID + date-of-birth lookup succeeds. Logs a lightweight "X is
 * viewing their status" event the admin dashboard bell can surface.
 */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { applicationId?: string } | null
  const applicationId = body?.applicationId?.trim()
  if (!applicationId) {
    return NextResponse.json({ error: "Missing applicationId" }, { status: 400 })
  }

  const redis = await getRedis()

  const rawApps = await redis.get(APPS_KEY)
  const apps: Application[] = rawApps ? JSON.parse(rawApps) : []
  const app = apps.find((a) => a.id === applicationId)
  if (!app) {
    return NextResponse.json({ error: "not_found" }, { status: 404 })
  }

  const rawNotifications = await redis.get(NOTIFICATIONS_KEY)
  const notifications: VisitNotification[] = rawNotifications ? JSON.parse(rawNotifications) : []

  const entry: VisitNotification = {
    id: `visit_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    applicationId: app.id,
    applicantName: app.fullName,
    passportNumber: app.passportNumber,
    destinationCountry: app.destinationCountry,
    viewedAt: new Date().toISOString(),
  }

  const updated = [entry, ...notifications].slice(0, MAX_VISIT_NOTIFICATIONS)
  await redis.set(NOTIFICATIONS_KEY, JSON.stringify(updated))

  return NextResponse.json({ ok: true })
}
