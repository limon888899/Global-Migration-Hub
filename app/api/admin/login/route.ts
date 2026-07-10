import { NextResponse } from "next/server"
import { ADMIN_SESSION_COOKIE, createSessionToken } from "@/lib/admin/session"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  const { username, password } = (await request.json()) as {
    username?: string
    password?: string
  }

  const validUsername = process.env.ADMIN_USERNAME
  const validPassword = process.env.ADMIN_PASSWORD

  if (!validUsername || !validPassword) {
    return NextResponse.json(
      { error: "Admin credentials are not configured on the server." },
      { status: 500 },
    )
  }

  if (username?.trim() !== validUsername || password !== validPassword) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  }

  const token = createSessionToken(validUsername)
  const response = NextResponse.json({ ok: true })
  response.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12, // 12 hours, matches session.ts TTL
  })
  return response
}
