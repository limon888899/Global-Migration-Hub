import crypto from "crypto"

/**
 * Signed, httpOnly-cookie based session for the admin panel.
 * The token is: base64url(username.expiresAt.signature)
 * signature = HMAC-SHA256(username.expiresAt, ADMIN_SESSION_SECRET)
 *
 * This never ships the password to the browser and can't be forged
 * without knowing ADMIN_SESSION_SECRET (set only on the server).
 */

export const ADMIN_SESSION_COOKIE = "gmh_admin_session"
const SESSION_TTL_MS = 1000 * 60 * 60 * 12 // 12 hours

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret) {
    throw new Error(
      "ADMIN_SESSION_SECRET is not set. Add it in Vercel → Project → Settings → Environment Variables.",
    )
  }
  return secret
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", getSecret()).update(payload).digest("hex")
}

export function createSessionToken(username: string): string {
  const expiresAt = Date.now() + SESSION_TTL_MS
  const payload = `${username}.${expiresAt}`
  const signature = sign(payload)
  return Buffer.from(`${payload}.${signature}`).toString("base64url")
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token) return false
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8")
    const parts = decoded.split(".")
    if (parts.length !== 3) return false
    const [username, expiresAtStr, signature] = parts
    if (!username || !expiresAtStr || !signature) return false

    const expected = sign(`${username}.${expiresAtStr}`)
    const sigBuf = Buffer.from(signature)
    const expectedBuf = Buffer.from(expected)
    if (sigBuf.length !== expectedBuf.length) return false
    if (!crypto.timingSafeEqual(sigBuf, expectedBuf)) return false

    return Date.now() < Number(expiresAtStr)
  } catch {
    return false
  }
}
