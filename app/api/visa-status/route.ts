import { NextResponse } from "next/server"
import { getRedis } from "@/lib/admin/redis"
import type { Application } from "@/lib/admin/types"

export const dynamic = "force-dynamic"

const KEY = "gmh:applications"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const passport = searchParams.get("passport")?.trim().toUpperCase()
  const country = searchParams.get("country")?.trim().toLowerCase()

  if (!passport) {
    return NextResponse.json({ error: "Missing passport number" }, { status: 400 })
  }

  const redis = await getRedis()
  const raw = await redis.get(KEY)
  const apps: Application[] = raw ? JSON.parse(raw) : []
  const match = apps.find((a) => a.passportNumber.trim().toUpperCase() === passport)

  if (!match) {
    return NextResponse.json({ error: "not_found" }, { status: 404 })
  }

  if (country && match.destinationCountry.trim().toLowerCase() !== country) {
    return NextResponse.json({ error: "country_mismatch" }, { status: 404 })
  }

  return NextResponse.json(match)
}
