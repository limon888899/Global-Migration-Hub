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
      setError("Please fill in all required fields")
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch("/api/biometric/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, passportNumber, phone, email, centerId, date, time }),
      })
      const text = await res.text()
      if (!res.ok) {
        console.error("Booking failed:", res.status, text)
        let msg = `Booking failed (${res.status})`
        try {
          const body = JSON.parse(text)
          if (body?.error === "slot_full") msg = "This slot is full, please choose another time"
          else if (body?.error) msg = `Booking failed: ${body.error}`
        } catch {
          msg = `Booking failed (${res.status}): ${text.slice(0, 200)}`
        }
        throw new Error(msg)
      }
      const appointment = JSON.parse(text)
      router.push(`/biometric/verify?id=${appointment.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <div className="mb-8 text-center">
        <img
          src="/images/vfs-global-logo.png"
          alt="VFS.GLOBAL"
          className="mx-auto mb-5 h-12 w-auto object-contain"
        />
        <span className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Fingerprint className="size-7" />
        </span>
        <h1 className="font-serif text-2xl font-semibold text-foreground sm:text-3xl">
          Biometric Appointment Booking
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Choose your preferred center and time to book a biometric appointment
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Building2 className="size-4" /> Choose a center
          </label>
          <CustomSelect
            value={centerId}
            onChange={setCenterId}
            options={centerOptions}
            placeholder="Select a center"
            className="mt-1.5"
          />
        </div>

        {centerId && (
          <div className="mt-6">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Calendar className="size-4" /> Choose a date
            </label>
            {loadingDates ? (
              <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
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
                    {new Date(d).toLocaleDateString("en-US", { day: "numeric", month: "short", weekday: "short" })}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {date && (
          <div className="mt-6">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Clock className="size-4" /> Choose a time
            </label>
            {loadingSlots ? (
              <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
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
              <label className="text-sm font-medium text-foreground">Full name *</label>
              <input className={fieldClass()} value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Passport number *</label>
              <input className={fieldClass()} value={passportNumber} onChange={(e) => setPassportNumber(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground">Phone number *</label>
                <input className={fieldClass()} value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Email</label>
                <input className={fieldClass()} value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button className="w-full" disabled={submitting} onClick={handleSubmit}>
              {submitting ? <Loader2 className="size-4 animate-spin" /> : "Confirm appointment"}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
