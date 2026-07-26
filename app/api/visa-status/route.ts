import { NextResponse } from "next/server"
import { getRedis } from "@/lib/admin/redis"
import type { Application } from "@/lib/admin/types"

export const dynamic = "force-dynamic"

const KEY = "gmh:applications"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const passport = searchParams.get("passport")?.trim().toUpperCase()
  const nationalId = searchParams.get("nationalId")?.trim().toUpperCase()
  const country = searchParams.get("country")?.trim().toLowerCase()

  if (!passport && !nationalId) {
    return NextResponse.json({ error: "Missing passport number or national ID" }, { status: 400 })
  }

  const redis = await getRedis()
  const raw = await redis.get(KEY)
  const apps: Application[] = raw ? JSON.parse(raw) : []

  // Match by whichever identifier was provided: passport number OR national ID number
  const match = apps.find((a) => {
    if (passport && a.passportNumber.trim().toUpperCase() === passport) return true
    if (nationalId && (a.nationalId ?? "").trim().toUpperCase() === nationalId) return true
    return false
  })

  if (!match) {
    return NextResponse.json({ error: "not_found" }, { status: 404 })
  }

  if (country && match.destinationCountry.trim().toLowerCase() !== country) {
    return NextResponse.json({ error: "country_mismatch" }, { status: 404 })
  }

  return NextResponse.json(match)
}
