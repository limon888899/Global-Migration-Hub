import { NextResponse } from "next/server"
import { redis } from "@/lib/admin/redis"
import type { Application, NewApplicationInput } from "@/lib/admin/types"
export const dynamic = "force-dynamic"

const KEY = "gmh:applications"

export async function GET() {
  const apps = (await redis.get<Application[]>(KEY)) ?? []
  return NextResponse.json(apps)
}

export async function POST(request: Request) {
  const input = (await request.json()) as NewApplicationInput
  const apps = (await redis.get<Application[]>(KEY)) ?? []

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
  await redis.set(KEY, updated)

  return NextResponse.json(newApp, { status: 201 })
}
