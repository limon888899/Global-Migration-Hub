import { NextResponse } from "next/server"
import { getRedis } from "@/lib/admin/redis"
import { BIOMETRIC_CENTERS } from "@/lib/biometric/centers"
import { getSlotsForDate, WORKING_HOURS } from "@/lib/biometric/slots"
import type { BiometricAppointment } from "@/lib/biometric/types"

export const dynamic = "force-dynamic"

const KEY = "gmh:biometric:appointments"

export async function POST(request: Request) {
  const body = await request.json()
  const { fullName, passportNumber, phone, email, centerId, date, time } = body as {
    fullName?: string
    passportNumber?: string
    phone?: string
    email?: string
    centerId?: string
    date?: string
    time?: string
  }

  if (!fullName || !passportNumber || !phone || !centerId || !date || !time) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  const center = BIOMETRIC_CENTERS.find((c) => c.id === centerId)
  if (!center) {
    return NextResponse.json({ error: "Unknown center" }, { status: 404 })
  }
  if (!WORKING_HOURS.includes(time)) {
    return NextResponse.json({ error: "Invalid time slot" }, { status: 400 })
  }

  const redis = await getRedis()
  const raw = await redis.get(KEY)
  const appointments: BiometricAppointment[] = raw ? JSON.parse(raw) : []

  const slots = getSlotsForDate(centerId, date, appointments)
  const slot = slots.find((s) => s.time === time)
  if (!slot || slot.available <= 0) {
    return NextResponse.json({ error: "slot_full" }, { status: 409 })
  }

  const newAppointment: BiometricAppointment = {
    id: `bio_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    fullName: fullName.trim(),
    passportNumber: passportNumber.trim().toUpperCase(),
    phone: phone.trim(),
    email: (email || "").trim(),
    centerId,
    centerName: center.name,
    date,
    time,
    status: "booked",
    webauthnVerified: false,
    createdAt: new Date().toISOString(),
  }

  const updated = [newAppointment, ...appointments]
  await redis.set(KEY, JSON.stringify(updated))

  return NextResponse.json(newAppointment, { status: 201 })
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const passport = searchParams.get("passport")?.trim().toUpperCase()
  if (!passport) {
    return NextResponse.json({ error: "Missing passport number" }, { status: 400 })
  }

  const redis = await getRedis()
  const raw = await redis.get(KEY)
  const appointments: BiometricAppointment[] = raw ? JSON.parse(raw) : []
  const matches = appointments.filter((a) => a.passportNumber === passport)

  return NextResponse.json(matches)
}
