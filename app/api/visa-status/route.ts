import { NextResponse } from "next/server"
import { redis } from "@/lib/admin/redis"
import type { Application } from "@/lib/admin/types"

const KEY = "gmh:applications"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const passport = searchParams.get("passport")?.trim().toUpperCase()

  if (!passport) {
    return NextResponse.json({ error: "Missing passport number" }, { status: 400 })
  }

  const apps = (await redis.get<Application[]>(KEY)) ?? []
  const match = apps.find((a) => a.passportNumber.trim().toUpperCase() === passport)

  if (!match) {
    return NextResponse.json({ error: "not_found" }, { status: 404 })
  }

  return NextResponse.json(match)
}
