"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { login, isLoggedIn } from "@/lib/admin/auth"

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)

  useEffect(() => {
    isLoggedIn().then((ok) => {
      if (ok) router.replace("/admin/dashboard")
    })
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const ok = await login(username, password)
    if (ok) {
      router.push("/admin/dashboard")
    } else {
      setError(true)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-secondary/30 px-4 py-12">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-sm"
      >
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-tip-blue text-tip-blue-foreground">
          <Lock className="size-5" aria-hidden="true" />
        </div>
        <h1 className="text-center font-serif text-xl font-semibold text-foreground">Admin Access</h1>
        <p className="mt-1 text-center text-sm text-muted-foreground">Restricted area. Authorized staff only.</p>

        <div className="mt-6 space-y-4">
          <div>
            <label htmlFor="adminUser" className="mb-1.5 block text-sm font-medium text-foreground">
              Username
            </label>
            <input
              id="adminUser"
              name="adminUser"
              type="text"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => {
                setUsername(e.target.value)
                setError(false)
              }}
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>
          <div>
            <label htmlFor="adminPass" className="mb-1.5 block text-sm font-medium text-foreground">
              Password
            </label>
            <input
              id="adminPass"
              name="adminPass"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError(false)
              }}
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>
        </div>

        {error && (
          <p className="mt-4 text-sm text-destructive" role="alert">
            Incorrect username or password.
          </p>
        )}

        <Button type="submit" className="mt-6 h-10 w-full rounded-xl">
          Sign In
        </Button>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          <a href="/" className="hover:text-primary">
            ← Back to site
          </a>
        </p>
      </form>
    </main>
  )
}
