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

export async function login(username: string, password: string): Promise<boolean> {
  const res = await fetch("/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  })
  return res.ok
}

export async function logout(): Promise<void> {
  await fetch("/api/admin/logout", { method: "POST" })
}

export async function isLoggedIn(): Promise<boolean> {
  const res = await fetch("/api/admin/session", { cache: "no-store" })
  return res.ok
}
