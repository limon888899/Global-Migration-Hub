import { NextResponse } from "next/server"
import { ADMIN_SESSION_COOKIE, verifySessionToken } from "@/lib/admin/session"

/**
 * Call this at the top of every /api/admin/* route handler.
 * Returns a 401 NextResponse if the request has no valid admin session,
 * or null if the request is authorized and the handler should continue.
 */
export function requireAdminAuth(request: Request): NextResponse | null {
  const cookieHeader = request.headers.get("cookie") ?? ""
  const match = cookieHeader.match(new RegExp(`${ADMIN_SESSION_COOKIE}=([^;]+)`))
  const token = match?.[1]

  if (!verifySessionToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  return null
}
