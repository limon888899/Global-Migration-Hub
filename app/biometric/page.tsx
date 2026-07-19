"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Building2, Calendar, Clock, Fingerprint, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CustomSelect } from "@/components/custom-select"
import { BIOMETRIC_CENTERS } from "@/lib/biometric/centers"

function fieldClass() {
  return "mt-1.5 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground shadow-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
}

interface Slot {
  time: string
  capacity: number
  bookedCount: number
  available: number
}

export default function BiometricAppointmentPage() {
  const router = useRouter()
  const [centerId, setCenterId] = useState("")
  const [dates, setDates] = useState<string[]>([])
  const [date, setDate] = useState("")
  const [slots, setSlots] = useState<Slot[]>([])
  const [time, setTime] = useState("")
  const [loadingDates, setLoadingDates] = useState(false)
  const [loadingSlots, setLoadingSlots] = useState(false)

  const [fullName, setFullName] = useState("")
  const [passportNumber, setPassportNumber] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  const centerOptions = useMemo(
    () => BIOMETRIC_CENTERS.map((c) => ({ value: c.id, label: c.name, subtitle: c.city })),
    [],
  )

  useEffect(() => {
    if (!centerId) return
    setLoadingDates(true)
    setDate("")
    setTime("")
    setSlots([])
    fetch(`/api/biometric/slots?centerId=${centerId}`)
      .then((res) => res.json())
      .then((data) => setDates(data.dates ?? []))
      .finally(() => setLoadingDates(false))
  }, [centerId])

  useEffect(() => {
    if (!centerId || !date) return
    setLoadingSlots(true)
    setTime("")
    fetch(`/api/biometric/slots?centerId=${centerId}&date=${date}`)
      .then((res) => res.json())
      .then((data) => setSlots(data.slots ?? []))
      .finally(() => setLoadingSlots(false))
  }, [centerId, date])

  async function handleSubmit() {
    setError("")
    if (!fullName || !passportNumber || !phone) {
      setError("অনুগ্রহ করে সব আবশ্যক তথ্য পূরণ করুন")
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch("/api/biometric/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, passportNumber, phone, email, centerId, date, time }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(
          body?.error === "slot_full" ? "এই স্লটটি পূর্ণ হয়ে গেছে, অন্য সময় বেছে নিন" : "বুকিং ব্যর্থ হয়েছে",
        )
      }
      const appointment = await res.json()
      router.push(`/biometric/verify?id=${appointment.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "কিছু একটা সমস্যা হয়েছে")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <div className="mb-8 text-center">
        <span className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Fingerprint className="size-7" />
        </span>
        <h1 className="font-serif text-2xl font-semibold text-foreground sm:text-3xl">
          বায়োমেট্রিক অ্যাপয়েন্টমেন্ট বুকিং
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          আপনার পছন্দের সেন্টার ও সময় বেছে বায়োমেট্রিক অ্যাপয়েন্টমেন্ট বুক করুন
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Building2 className="size-4" /> সেন্টার বেছে নিন
          </label>
          <CustomSelect
            value={centerId}
            onChange={setCenterId}
            options={centerOptions}
            placeholder="সেন্টার নির্বাচন করুন"
            className="mt-1.5"
          />
        </div>

        {centerId && (
          <div className="mt-6">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Calendar className="size-4" /> তারিখ বেছে নিন
            </label>
            {loadingDates ? (
              <p className="mt-2 text-sm text-muted-foreground">লোড হচ্ছে...</p>
            ) : (
              <div className="mt-2 flex flex-wrap gap-2">
                {dates.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDate(d)}
                    className={`rounded-lg border px-3 py-2 text-xs font-medium transition ${
                      date === d
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-input bg-background text-foreground hover:border-primary/50"
                    }`}
                  >
                    {new Date(d).toLocaleDateString("bn-BD", { day: "numeric", month: "short", weekday: "short" })}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {date && (
          <div className="mt-6">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Clock className="size-4" /> সময় বেছে নিন
            </label>
            {loadingSlots ? (
              <p className="mt-2 text-sm text-muted-foreground">লোড হচ্ছে...</p>
            ) : (
              <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
                {slots.map((s) => (
                  <button
                    key={s.time}
                    type="button"
                    disabled={s.available <= 0}
                    onClick={() => setTime(s.time)}
                    className={`rounded-lg border px-3 py-2 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${
                      time === s.time
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-input bg-background text-foreground hover:border-primary/50"
                    }`}
                  >
                    {s.time}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {time && (
          <div className="mt-8 space-y-4 border-t border-border pt-6">
            <div>
              <label className="text-sm font-medium text-foreground">পূর্ণ নাম *</label>
              <input className={fieldClass()} value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">পাসপোর্ট নম্বর *</label>
              <input className={fieldClass()} value={passportNumber} onChange={(e) => setPassportNumber(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground">ফোন নম্বর *</label>
                <input className={fieldClass()} value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">ইমেইল</label>
                <input className={fieldClass()} value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button className="w-full" disabled={submitting} onClick={handleSubmit}>
              {submitting ? <Loader2 className="size-4 animate-spin" /> : "অ্যাপয়েন্টমেন্ট নিশ্চিত করুন"}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
