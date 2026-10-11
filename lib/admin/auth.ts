/**
 * Thin client-side helpers for the admin panel.
 *
 * Real authentication happens on the server:
 *   - POST /api/admin/login checks ADMIN_USERNAME / ADMIN_PASSWORD (env vars)
 *     and sets an httpOnly signed session cookie.
 *   - Every /api/admin/* data route verifies that cookie via
 *     lib/admin/require-auth.ts before touching any data.
 *
 * These helpers just call those endpoints; no secret ever ships to the browser.
 */

/** Returns null on success, otherwise a message to show the user. */
export async function login(username: string, password: string): Promise<string | null> {
  try {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ username, password }),
    })
    if (res.ok) return null
    if (res.status === 401) return "Incorrect username or password."
    const data = await res.json().catch(() => ({}))
    return data?.error || `Login failed (${res.status}).`
  } catch {
    return "Network error. Please try again."
  }
}

export async function logout(): Promise<void> {
  await fetch("/api/admin/logout", { method: "POST" })
}

export async function isLoggedIn(): Promise<boolean> {
  const res = await fetch("/api/admin/session", { cache: "no-store" })
  return res.ok
}
