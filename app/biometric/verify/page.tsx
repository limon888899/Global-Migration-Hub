"use client"

import { Suspense, useEffect, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import { startRegistration, browserSupportsWebAuthn } from "@simplewebauthn/browser"
import { Camera, CheckCircle2, Fingerprint, Loader2, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { BiometricAppointment } from "@/lib/biometric/types"

const MAX_PHOTO_BYTES = 4 * 1024 * 1024 // 4 MB

function VerifyContent() {
  const searchParams = useSearchParams()
  const id = searchParams.get("id")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [appointment, setAppointment] = useState<BiometricAppointment | null>(null)
  const [loading, setLoading] = useState(true)
  const [verifying, setVerifying] = useState(false)
  const [error, setError] = useState("")
  const [supported, setSupported] = useState(true)

  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [photoError, setPhotoError] = useState("")

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

  async function handlePhotoSelected(file: File | null) {
    if (!file || !id) return
    setPhotoError("")

    if (file.size > MAX_PHOTO_BYTES) {
      setPhotoError("ছবির সাইজ ৪ MB এর কম হতে হবে")
      return
    }

    setUploadingPhoto(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData })
      if (!uploadRes.ok) {
        const body = await uploadRes.json().catch(() => null)
        throw new Error(body?.error || "আপলোড ব্যর্থ হয়েছে")
      }
      const { url } = (await uploadRes.json()) as { url: string }

      const patchRes = await fetch(`/api/biometric/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fingerPhotoUrl: url }),
      })
      if (!patchRes.ok) throw new Error("সেভ করতে সমস্যা হয়েছে")
      const updated = await patchRes.json()
      setAppointment(updated)
    } catch (err) {
      setPhotoError(err instanceof Error ? err.message : "কিছু একটা সমস্যা হয়েছে")
    } finally {
      setUploadingPhoto(false)
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

        {/* WebAuthn identity verify */}
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

        {/* Camera finger photo capture */}
        <div className="mt-6 border-t border-border pt-6">
          <p className="mb-1 text-sm font-medium text-foreground">আঙুলের ছবি (রেফারেন্স)</p>
          <p className="mb-3 text-xs text-muted-foreground">
            এটি শুধু রেকর্ডের জন্য একটি রেফারেন্স ছবি — সরকারি বায়োমেট্রিক স্ক্যানের বিকল্প নয়। আসল বায়োমেট্রিক সেন্টারে গিয়েই দিতে হবে।
          </p>

          {appointment.fingerPhotoUrl ? (
            <div className="flex items-center gap-3 rounded-xl bg-secondary/50 p-3">
              <img
                src={appointment.fingerPhotoUrl}
                alt="আঙুলের ছবি"
                className="size-14 shrink-0 rounded-lg object-cover"
              />
              <div className="flex-1 text-left text-xs text-muted-foreground">ছবি জমা হয়েছে</div>
              <CheckCircle2 className="size-5 shrink-0 text-primary" />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => !uploadingPhoto && fileInputRef.current?.click()}
              disabled={uploadingPhoto}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-input bg-background px-4 py-3 text-sm font-medium text-foreground transition hover:bg-muted/50 disabled:opacity-50"
            >
              {uploadingPhoto ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <>
                  <Camera className="size-4" /> ক্যামেরা দিয়ে ছবি তুলুন
                </>
              )}
            </button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => handlePhotoSelected(e.target.files?.[0] ?? null)}
          />

          {photoError && <p className="mt-2 text-xs text-destructive">{photoError}</p>}
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
