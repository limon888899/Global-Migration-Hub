import { NextResponse } from "next/server"
import { getRedis } from "@/lib/admin/redis"
import { getTrackingMethod, type Application } from "@/lib/admin/types"

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

  // Each application has its own tracking method (set by admin — see lib/admin/types.ts
  // -> getTrackingMethod). An application only matches a search that used ITS selected
  // identifier: if the admin set this application to be tracked by Passport Number,
  // a search by National ID will never match it (even if a National ID is on file for
  // it), and vice versa.
  const match = apps.find((a) => {
    const method = getTrackingMethod(a)
    if (method === "passport") {
      return !!passport && a.passportNumber.trim().toUpperCase() === passport
    }
    return !!nationalId && (a.nationalId ?? "").trim().toUpperCase() === nationalId
  })

  if (!match) {
    return NextResponse.json({ error: "not_found" }, { status: 404 })
  }

  if (country && match.destinationCountry.trim().toLowerCase() !== country) {
    return NextResponse.json({ error: "country_mismatch" }, { status: 404 })
  }

  return NextResponse.json(match)
}
