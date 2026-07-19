import { NextResponse } from "next/server"
import { getRedis } from "@/lib/admin/redis"
import { BIOMETRIC_CENTERS } from "@/lib/biometric/centers"
import { getAvailableDates, getSlotsForDate } from "@/lib/biometric/slots"
import type { BiometricAppointment } from "@/lib/biometric/types"

export const dynamic = "force-dynamic"

const APPT_KEY = "gmh:biometric:appointments"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const centerId = searchParams.get("centerId")
  const date = searchParams.get("date")

  if (!centerId) {
    return NextResponse.json({ error: "Missing centerId" }, { status: 400 })
  }
  if (!BIOMETRIC_CENTERS.some((c) => c.id === centerId)) {
    return NextResponse.json({ error: "Unknown center" }, { status: 404 })
  }

  if (!date) {
    return NextResponse.json({ dates: getAvailableDates() })
  }

  const redis = await getRedis()
  const raw = await redis.get(APPT_KEY)
  const appointments: BiometricAppointment[] = raw ? JSON.parse(raw) : []

  const slots = getSlotsForDate(centerId, date, appointments)
  return NextResponse.json({ slots })
}
