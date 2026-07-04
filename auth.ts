/**
 * ⚠️ DEMO AUTH ONLY — NOT SECURE FOR PRODUCTION.
 *
 * This check runs entirely in the browser and the "password" below ships inside
 * the JavaScript bundle, so anyone can read it from devtools. It exists only so
 * you can click through the admin panel UI before a real backend is wired up.
 *
 * Before handling real applicant data, replace this file with real authentication,
 * for example:
 *   - Firebase Auth (matches the admin-login.html / admin-dashboard.html design
 *     you already have, which references firebase-config.js), or
 *   - NextAuth.js / Auth.js with a proper user table, or
 *   - Your own backend API that verifies credentials server-side and sets an
 *     httpOnly session cookie.
 */

const SESSION_KEY = "vl_admin_session_v1"
const DEMO_USERNAME = "admin"
const DEMO_PASSWORD = "ChangeMe123!"

export function login(username: string, password: string): boolean {
  const ok = username.trim() === DEMO_USERNAME && password === DEMO_PASSWORD
  if (ok && typeof window !== "undefined") {
    window.localStorage.setItem(SESSION_KEY, "1")
  }
  return ok
}

export function logout(): void {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(SESSION_KEY)
  }
}

export function isLoggedIn(): boolean {
  if (typeof window === "undefined") return false
  return window.localStorage.getItem(SESSION_KEY) === "1"
}
