"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { startRegistration, browserSupportsWebAuthn } from "@simplewebauthn/browser"
import { CheckCircle2, Fingerprint, Loader2, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { BiometricAppointment } from "@/lib/biometric/types"

function VerifyContent() {
  const searchParams = useSearchParams()
  const id = searchParams.get("id")

  const [appointment, setAppointment] = useState<BiometricAppointment | null>(null)
  const [loading, setLoading] = useState(true)
  const [verifying, setVerifying] = useState(false)
  const [error, setError] = useState("")
  const [supported, setSupported] = useState(true)

  useEffect(() => {
    if (!id) return
    fetch(`/api/biometric/appointments/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("not_found")
        return res.json()
      })
      .then((data) => setAppointment(data))
      .catch(() => setError("অ্যাপয়েন্টমেন্ট খুঁজে পাওয়া যায়নি"))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    setSupported(browserSupportsWebAuthn())
  }, [])

  async function handleVerify() {
    if (!id) return
    setError("")
    setVerifying(true)
    try {
      const optionsRes = await fetch("/api/biometric/webauthn/register-options", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentId: id }),
      })
      if (!optionsRes.ok) throw new Error("options_failed")
      const options = await optionsRes.json()

      const attResp = await startRegistration({ optionsJSON: options })

      const verifyRes = await fetch("/api/biometric/webauthn/register-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentId: id, response: attResp }),
      })
      const result = await verifyRes.json()
      if (!verifyRes.ok || !result.verified) throw new Error("verification_failed")

      setAppointment((prev) => (prev ? { ...prev, webauthnVerified: true, status: "verified" } : prev))
    } catch {
      setError("ভেরিফিকেশন ব্যর্থ হয়েছে। আপনার ডিভাইসে ফিঙ্গারপ্রিন্ট/ফেস আনলক সেটআপ করা আছে কিনা দেখে আবার চেষ্টা করুন।")
    } finally {
      setVerifying(false)
    }
  }

  if (loading) return <p className="py-20 text-center text-sm text-muted-foreground">লোড হচ্ছে...</p>
  if (!appointment) return <p className="py-20 text-center text-sm text-destructive">অ্যাপয়েন্টমেন্ট খুঁজে পাওয়া যায়নি</p>

  return (
    <div className="mx-auto max-w-lg px-4 py-12 sm:px-6">
      <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm sm:p-8">
        <span className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Fingerprint className="size-7" />
        </span>
        <h1 className="font-serif text-xl font-semibold text-foreground sm:text-2xl">অ্যাপয়েন্টমেন্ট নিশ্চিত হয়েছে</h1>

        <div className="mt-6 space-y-1.5 rounded-xl bg-secondary/50 p-4 text-left text-sm">
          <p><span className="text-muted-foreground">নাম:</span> {appointment.fullName}</p>
          <p><span className="text-muted-foreground">সেন্টার:</span> {appointment.centerName}</p>
          <p><span className="text-muted-foreground">তারিখ ও সময়:</span> {appointment.date} — {appointment.time}</p>
        </div>

        <div className="mt-6">
          {appointment.webauthnVerified ? (
            <div className="flex items-center justify-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
              <CheckCircle2 className="size-5" /> ফিঙ্গারপ্রিন্ট দিয়ে ভেরিফাইড
            </div>
          ) : supported ? (
            <>
              <p className="mb-3 text-xs text-muted-foreground">
                আপনার ডিভাইসের ফিঙ্গারপ্রিন্ট/ফেস আনলক দিয়ে পরিচয় নিশ্চিত করুন। এটি সেন্টারে গিয়ে দেওয়া সরকারি বায়োমেট্রিকের বিকল্প নয় — শুধু আপনার অ্যাপয়েন্টমেন্টের পরিচয় যাচাই।
              </p>
              <Button className="w-full" onClick={handleVerify} disabled={verifying}>
                {verifying ? <Loader2 className="size-4 animate-spin" /> : "ফিঙ্গারপ্রিন্ট দিয়ে ভেরিফাই করুন"}
              </Button>
            </>
          ) : (
            <div className="flex items-center justify-center gap-2 rounded-xl bg-amber-50 px-4 py-3 text-xs font-medium text-amber-700">
              <ShieldAlert className="size-4" /> আপনার ব্রাউজার/ডিভাইস এই ফিচার সাপোর্ট করে না
            </div>
          )}
          {error && <p className="mt-3 text-xs text-destructive">{error}</p>}
        </div>
      </div>
    </div>
  )
}

export default function BiometricVerifyPage() {
  return (
    <Suspense fallback={<p className="py-20 text-center text-sm text-muted-foreground">লোড হচ্ছে...</p>}>
      <VerifyContent />
    </Suspense>
  )
}
