import { NextResponse } from "next/server"
import { getRedis } from "@/lib/admin/redis"
import type { BiometricAppointment } from "@/lib/biometric/types"

export const dynamic = "force-dynamic"

const KEY = "gmh:biometric:appointments"

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const redis = await getRedis()
  const raw = await redis.get(KEY)
  const appointments: BiometricAppointment[] = raw ? JSON.parse(raw) : []
  const appointment = appointments.find((a) => a.id === id)

  if (!appointment) {
    return NextResponse.json({ error: "not_found" }, { status: 404 })
  }

  // sensitive/internal fields ক্লায়েন্টে পাঠানো হবে না
  const { pendingChallenge, webauthnPublicKey, webauthnCounter, ...safe } = appointment
  return NextResponse.json(safe)
}
