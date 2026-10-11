import crypto from "crypto"
import { NextResponse } from "next/server"
import { ADMIN_SESSION_COOKIE, createSessionToken } from "@/lib/admin/session"
import { rateLimit } from "@/lib/rate-limit"

export const dynamic = "force-dynamic"

/** Constant-time string comparison (hashes first so lengths always match). */
function safeEqual(a: string, b: string) {
  const ha = crypto.createHash("sha256").update(a).digest()
  const hb = crypto.createHash("sha256").update(b).digest()
  return crypto.timingSafeEqual(ha, hb)
}

export async function POST(request: Request) {
  // Max 15 login attempts per IP every 15 minutes.
  const limited = await rateLimit(request, "admin-login", 15, 15 * 60)
  if (limited) return limited

  let body: { username?: string; password?: string } = {}
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  // Trim env values: a trailing space/newline pasted into Vercel is a very common cause of "correct password rejected".
  const validUsername = process.env.ADMIN_USERNAME?.trim()
  const validPassword = process.env.ADMIN_PASSWORD?.trim()

  if (!validUsername || !validPassword) {
    return NextResponse.json(
      { error: "Admin credentials are not configured on the server (ADMIN_USERNAME / ADMIN_PASSWORD)." },
      { status: 500 },
    )
  }

  const userOk = safeEqual((body.username ?? "").trim(), validUsername)
  const passOk = safeEqual((body.password ?? "").trim(), validPassword)
  if (!userOk || !passOk) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  }

  try {
    const token = createSessionToken(validUsername)
    const response = NextResponse.json({ ok: true })
    response.cookies.set(ADMIN_SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 12,
    })
    return response
  } catch (err) {
    console.error("Admin session creation failed", err)
    return NextResponse.json({ error: "Could not create session on the server." }, { status: 500 })
  }
}
