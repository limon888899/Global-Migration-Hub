import crypto from "crypto"

/**
 * Signed, httpOnly-cookie based session for the admin panel.
 * Token = base64url(JSON{u,e}) + "." + HMAC-SHA256(payload, secret)
 *
 * The secret is ADMIN_SESSION_SECRET. If it is not set, a secret is derived
 * from ADMIN_PASSWORD so login still works (set ADMIN_SESSION_SECRET anyway
 * for best security).
 */

export const ADMIN_SESSION_COOKIE = "gmh_admin_session"
const SESSION_TTL_MS = 1000 * 60 * 60 * 12 // 12 hours

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET?.trim()
  if (secret) return secret
  const pass = process.env.ADMIN_PASSWORD?.trim()
  if (pass) return crypto.createHash("sha256").update(`gmh-session:${pass}`).digest("hex")
  throw new Error("Neither ADMIN_SESSION_SECRET nor ADMIN_PASSWORD is set.")
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", getSecret()).update(payload).digest("hex")
}

export function createSessionToken(username: string): string {
  const payload = Buffer.from(JSON.stringify({ u: username, e: Date.now() + SESSION_TTL_MS })).toString("base64url")
  return `${payload}.${sign(payload)}`
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token) return false
  try {
    const [payload, signature, extra] = token.split(".")
    if (!payload || !signature || extra !== undefined) return false
    const expected = sign(payload)
    const sigBuf = Buffer.from(signature)
    const expectedBuf = Buffer.from(expected)
    if (sigBuf.length !== expectedBuf.length) return false
    if (!crypto.timingSafeEqual(sigBuf, expectedBuf)) return false
    const { e } = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"))
    return typeof e === "number" && Date.now() < e
  } catch {
    return false
  }
}
