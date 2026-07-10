import { NextResponse } from "next/server"
import { getRedis } from "@/lib/admin/redis"
import { requireAdminAuth } from "@/lib/admin/require-auth"
import type { Application } from "@/lib/admin/types"

export const dynamic = "force-dynamic"

const KEY = "gmh:applications"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const authError = requireAdminAuth(request)
  if (authError) return authError

  const { id } = await params
  const patch = (await request.json()) as Partial<Application>
  const redis = await getRedis()
  const raw = await redis.get(KEY)
  const apps: Application[] = raw ? JSON.parse(raw) : []
  const updated = apps.map((app) => (app.id === id ? { ...app, ...patch } : app))
  await redis.set(KEY, JSON.stringify(updated))
  const found = updated.find((a) => a.id === id) ?? null
  return NextResponse.json(found)
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const authError = requireAdminAuth(request)
  if (authError) return authError

  const { id } = await params
  const redis = await getRedis()
  const raw = await redis.get(KEY)
  const apps: Application[] = raw ? JSON.parse(raw) : []
  const updated = apps.filter((app) => app.id !== id)
  await redis.set(KEY, JSON.stringify(updated))
  return NextResponse.json({ ok: true })
}
