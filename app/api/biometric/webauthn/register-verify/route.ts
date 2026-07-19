import { NextResponse } from "next/server"
import { verifyRegistrationResponse, type RegistrationResponseJSON } from "@simplewebauthn/server"
import { getRedis } from "@/lib/admin/redis"
import type { BiometricAppointment } from "@/lib/biometric/types"

export const dynamic = "force-dynamic"

const KEY = "gmh:biometric:appointments"

export async function POST(request: Request) {
  const { appointmentId, response } = (await request.json()) as {
    appointmentId?: string
    response?: RegistrationResponseJSON
  }

  if (!appointmentId || !response) {
    return NextResponse.json({ error: "Missing appointmentId or response" }, { status: 400 })
  }

  const redis = await getRedis()
  const raw = await redis.get(KEY)
  const appointments: BiometricAppointment[] = raw ? JSON.parse(raw) : []
  const appointment = appointments.find((a) => a.id === appointmentId)

  if (!appointment || !appointment.pendingChallenge) {
    return NextResponse.json({ error: "not_found" }, { status: 404 })
  }

  const url = new URL(request.url)

  try {
    const result = await verifyRegistrationResponse({
      response,
      expectedChallenge: appointment.pendingChallenge,
      expectedOrigin: url.origin,
      expectedRPID: url.hostname,
    })

    if (!result.verified || !result.registrationInfo) {
      return NextResponse.json({ verified: false }, { status: 400 })
    }

    const { credential } = result.registrationInfo

    const updated = appointments.map((a) => {
      if (a.id !== appointmentId) return a
      const { pendingChallenge, ...rest } = a
      return {
        ...rest,
        status: "verified" as const,
        webauthnVerified: true,
        webauthnCredentialId: credential.id,
        webauthnPublicKey: Buffer.from(credential.publicKey).toString("base64"),
        webauthnCounter: credential.counter,
        verifiedAt: new Date().toISOString(),
      }
    })
    await redis.set(KEY, JSON.stringify(updated))

    return NextResponse.json({ verified: true })
  } catch (err) {
    console.error("WebAuthn verification error", err)
    return NextResponse.json({ error: "verification_failed" }, { status: 400 })
  }
}
