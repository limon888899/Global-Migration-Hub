import { NextResponse } from "next/server"
import { redis } from "@/lib/admin/redis"
import type { Application } from "@/lib/admin/types"
export const dynamic = "force-dynamic"

const KEY = "gmh:applications"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const patch = (await request.json()) as Partial<Application>
  const apps = (await redis.get<Application[]>(KEY)) ?? []
  const updated = apps.map((app) => (app.id === id ? { ...app, ...patch } : app))
  await redis.set(KEY, updated)
  const found = updated.find((a) => a.id === id) ?? null
  return NextResponse.json(found)
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const apps = (await redis.get<Application[]>(KEY)) ?? []
  const updated = apps.filter((app) => app.id !== id)
  await redis.set(KEY, updated)
  return NextResponse.json({ ok: true })
}
