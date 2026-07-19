import { NextResponse } from "next/server"
import { generateRegistrationOptions } from "@simplewebauthn/server"
import { getRedis } from "@/lib/admin/redis"
import type { BiometricAppointment } from "@/lib/biometric/types"

export const dynamic = "force-dynamic"

const KEY = "gmh:biometric:appointments"

export async function POST(request: Request) {
  const { appointmentId } = (await request.json()) as { appointmentId?: string }
  if (!appointmentId) {
    return NextResponse.json({ error: "Missing appointmentId" }, { status: 400 })
  }

  const redis = await getRedis()
  const raw = await redis.get(KEY)
  const appointments: BiometricAppointment[] = raw ? JSON.parse(raw) : []
  const appointment = appointments.find((a) => a.id === appointmentId)

  if (!appointment) {
    return NextResponse.json({ error: "not_found" }, { status: 404 })
  }

  const rpID = new URL(request.url).hostname

  const options = await generateRegistrationOptions({
    rpName: "Global Migration Hub",
    rpID,
    userName: appointment.passportNumber,
    userDisplayName: appointment.fullName,
    attestationType: "none",
    authenticatorSelection: {
      authenticatorAttachment: "platform",
      userVerification: "required",
      residentKey: "discouraged",
    },
  })

  const updated = appointments.map((a) =>
    a.id === appointmentId ? { ...a, pendingChallenge: options.challenge } : a,
  )
  await redis.set(KEY, JSON.stringify(updated))

  return NextResponse.json(options)
}
