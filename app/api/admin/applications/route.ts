import { NextResponse } from "next/server"
import { getRedis } from "@/lib/admin/redis"
import type { Application, NewApplicationInput } from "@/lib/admin/types"

export const dynamic = "force-dynamic"

const KEY = "gmh:applications"

export async function GET() {
  const redis = await getRedis()
  const raw = await redis.get(KEY)
  const apps: Application[] = raw ? JSON.parse(raw) : []
  return NextResponse.json(apps)
}

export async function POST(request: Request) {
  const input = (await request.json()) as NewApplicationInput
  const redis = await getRedis()
  const raw = await redis.get(KEY)
  const apps: Application[] = raw ? JSON.parse(raw) : []

  const newApp: Application = {
    ...input,
    id: `app_${Date.now()}`,
    submittedAt: new Date().toISOString(),
    manualStatus: "auto",
    statusNote: "",
    internalNotes: "",
    documents: [],
  }

  const updated = [newApp, ...apps]
  await redis.set(KEY, JSON.stringify(updated))

  return NextResponse.json(newApp, { status: 201 })
}
