import { NextResponse } from "next/server"
import { getRedis } from "@/lib/admin/redis"
import { getTrackingMethod, type Application } from "@/lib/admin/types"

export const dynamic = "force-dynamic"

const KEY = "gmh:applications"

/** Normalizes a date value to its "YYYY-MM-DD" prefix so time/zone noise never breaks a match. */
function normalizeDate(value?: string) {
  return (value ?? "").trim().slice(0, 10)
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const passport = searchParams.get("passport")?.trim().toUpperCase()
  const nationalId = searchParams.get("nationalId")?.trim().toUpperCase()
  const dob = normalizeDate(searchParams.get("dob") ?? undefined)
  const country = searchParams.get("country")?.trim().toLowerCase()

  if (!passport && !nationalId) {
    return NextResponse.json({ error: "Missing passport number or national ID" }, { status: 400 })
  }
  if (!dob) {
    return NextResponse.json({ error: "Missing date of birth" }, { status: 400 })
  }

  const redis = await getRedis()
  const raw = await redis.get(KEY)
  const apps: Application[] = raw ? JSON.parse(raw) : []

  // Two-factor lookup: an application only matches when BOTH of these are correct —
  // 1) its own admin-selected identifier (Passport Number or National ID Number — see
  //    lib/admin/types.ts -> getTrackingMethod), and
  // 2) its Date of Birth on file.
  // A search using the "wrong" identifier type for that application (e.g. searching by
  // National ID when the admin set this application to track by Passport) never
  // matches, even if that value is technically on file. Same if the DOB doesn't match.
  const match = apps.find((a) => {
    const method = getTrackingMethod(a)
    const identifierMatches =
      method === "passport"
        ? !!passport && a.passportNumber.trim().toUpperCase() === passport
        : !!nationalId && (a.nationalId ?? "").trim().toUpperCase() === nationalId
    if (!identifierMatches) return false
    return normalizeDate(a.dateOfBirth) === dob
  })

  if (!match) {
    return NextResponse.json({ error: "not_found" }, { status: 404 })
  }

  if (country && match.destinationCountry.trim().toLowerCase() !== country) {
    return NextResponse.json({ error: "country_mismatch" }, { status: 404 })
  }

  return NextResponse.json(match)
}
