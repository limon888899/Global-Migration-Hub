"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { X, ShieldCheck, ArrowRight, Loader2, Globe2 } from "lucide-react"
import { ALL_COUNTRIES, COUNTRY_FLAGS } from "@/lib/countries"

interface EnquireModalProps {
  country?: string
  open: boolean
  onClose: () => void
}

export function EnquireModal({ country, open, onClose }: EnquireModalProps) {
  const router = useRouter()
  const [selectedCountry, setSelectedCountry] = useState("")
  const [passport, setPassport] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  if (!open) return null

  const activeCountry = country || selectedCountry

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!activeCountry) {
      setError("Please select a destination country.")
      return
    }
    if (!passport.trim()) {
      setError("Please enter your passport number.")
      return
    }
    setError("")
    setLoading(true)
    const params = new URLSearchParams({ country: activeCountry, passport: passport.trim() })
    router.push(`/track?${params.toString()}`)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="enquire-modal-title"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/50 to-primary/70 backdrop-blur-md animate-in fade-in-0 duration-300"
      />

      {/* Floating card */}
      <div className="relative z-10 w-full max-w-sm animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-6 duration-500">
        <div className="animate-float relative overflow-hidden rounded-[2rem] border border-white/20 bg-card/95 shadow-[0_25px_70px_-12px_rgba(0,0,0,0.55)] backdrop-blur-xl">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-px rounded-[2rem] bg-gradient-to-br from-accent/40 via-transparent to-primary/40 opacity-60"
          />

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 z-10 flex size-8 items-center justify-center rounded-full bg-background/70 text-muted-foreground backdrop-blur transition hover:bg-background hover:text-foreground"
          >
            <X className="size-4" />
          </button>

          <div className="relative px-7 pb-8 pt-8 text-center sm:px-9">
            <div className="flex items-center justify-center gap-2">
              <span className="flex size-8 items-center justify-center overflow-hidden rounded-lg bg-primary shadow-md">
                <img src="/icon.png" alt="" className="size-full object-cover" />
              </span>
              <span className="font-serif text-sm font-semibold tracking-wide text-foreground">
                Global Migration Hub
              </span>
            </div>

            <div className="mt-6 flex flex-col items-center">
              {activeCountry ? (
                <span className="text-6xl leading-none drop-shadow-sm" aria-hidden="true">
                  {COUNTRY_FLAGS[activeCountry]}
                </span>
              ) : (
                <span className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Globe2 className="size-8" aria-hidden="true" />
                </span>
              )}
              <h2 id="enquire-modal-title" className="mt-3 font-serif text-2xl font-bold text-foreground">
                {activeCountry || "Track Your Visa"}
              </h2>
              <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
                {activeCountry
                  ? `Real-time, secure updates on your journey to ${activeCountry} — enter your passport number to begin.`
                  : "Select your destination and enter your passport number for a real-time status update."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-3.5 text-left" noValidate>
              {!country && (
                <div>
                  <label htmlFor="enquire-country" className="block text-xs font-medium text-foreground">
                    Destination Country
                  </label>
                  <select
                    id="enquire-country"
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground shadow-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
                  >
                    <option value="">Select a country</option>
                    {ALL_COUNTRIES.map((c) => (
                      <option key={c} value={c}>
                        {COUNTRY_FLAGS[c]} {c}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label htmlFor="enquire-passport" className="block text-xs font-medium text-foreground">
                  Passport Number
                </label>
                <input
                  id="enquire-passport"
                  value={passport}
                  onChange={(e) => setPassport(e.target.value)}
                  autoFocus
                  placeholder="e.g. A12345678"
                  className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-center font-mono text-sm tracking-wider text-foreground shadow-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
                />
              </div>

              {error && (
                <p role="alert" className="text-center text-xs text-destructive">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-accent text-sm font-semibold text-accent-foreground shadow-lg shadow-accent/30 transition hover:bg-accent/90 disabled:opacity-70"
              >
                {loading ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                ) : (
                  <>
                    Check My Status
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
              <ShieldCheck className="size-3.5 text-primary" aria-hidden="true" />
              Bank-grade encryption. Your details stay private.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
