import { NextResponse } from "next/server"
import { getRedis } from "@/lib/admin/redis"
import type { Application, NewApplicationInput } from "@/lib/admin/types"

export const dynamic = "force-dynamic"

const KEY = "gmh:applications"

export async function POST(request: Request) {
  const input = (await request.json()) as NewApplicationInput

  if (
    !input?.fullName?.trim() ||
    !input?.passportNumber?.trim() ||
    !input?.nationality?.trim() ||
    !input?.email?.trim() ||
    !input?.phone?.trim() ||
    !input?.destinationCountry?.trim() ||
    !input?.visaType?.trim()
  ) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  const redis = await getRedis()
  const raw = await redis.get(KEY)
  const apps: Application[] = raw ? JSON.parse(raw) : []

  const newApp: Application = {
    ...input,
    photoUrl: "",
    documents: input.documents ?? [],
    id: `app_${Date.now()}`,
    submittedAt: new Date().toISOString(),
    manualStatus: "auto",
    statusNote: "",
    internalNotes: "",
  }

  const updated = [newApp, ...apps]
  await redis.set(KEY, JSON.stringify(updated))

  return NextResponse.json({ ok: true, id: newApp.id }, { status: 201 })
}
