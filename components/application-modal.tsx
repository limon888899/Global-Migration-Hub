"use client"

import {
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
  type FormEvent,
  type ReactNode,
} from "react"
import { X, CheckCircle2, ShieldCheck, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ALL_COUNTRIES, COUNTRY_CODES, COUNTRY_FLAGS } from "@/lib/countries"
import type { NewApplicationInput } from "@/lib/admin/types"

type ModalContextValue = {
  open: (expectedCountry?: string) => void
  close: () => void
}

const ApplicationModalContext = createContext<ModalContextValue | null>(null)

export function useApplicationModal() {
  const ctx = useContext(ApplicationModalContext)
  if (!ctx) {
    throw new Error("useApplicationModal must be used within ApplicationModalProvider")
  }
  return ctx
}

export function ApplicationModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [defaultCountry, setDefaultCountry] = useState<string | null>(null)

  const open = useCallback((country?: string) => {
    setDefaultCountry(country ?? null)
    setIsOpen(true)
  }, [])
  const close = useCallback(() => setIsOpen(false), [])

  return (
    <ApplicationModalContext.Provider value={{ open, close }}>
      {children}
      {isOpen && <ApplicationFormModal onClose={close} defaultCountry={defaultCountry} />}
    </ApplicationModalContext.Provider>
  )
}

const emptyForm = {
  fullName: "",
  passportNumber: "",
  nationality: "",
  email: "",
  phone: "",
  destinationCountry: "",
  visaType: "",
  travelDate: "",
}

function ApplicationFormModal({
  onClose,
  defaultCountry,
}: {
  onClose: () => void
  defaultCountry: string | null
}) {
  const [form, setForm] = useState({ ...emptyForm, destinationCountry: defaultCountry ?? "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [phoneCode, setPhoneCode] = useState("+880")

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose])

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (
      !form.fullName.trim() ||
      !form.passportNumber.trim() ||
      !form.nationality.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !phoneCode ||
      !form.destinationCountry.trim() ||
      !form.visaType.trim()
    ) {
      setError("Please fill in all required fields.")
      return
    }

    setLoading(true)
    setError("")
    try {
      const payload: NewApplicationInput = {
        ...form,
        phone: `${phoneCode} ${form.phone.trim()}`,
        photoUrl: "",
        documents: [],
      }
      const res = await fetch("/api/admin/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        setSubmitted(true)
      } else {
        setError("Something went wrong while submitting your application. Please try again.")
      }
    } catch {
      setError("Something went wrong while submitting your application. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="application-modal-title"
    >
      <button
        type="button"
        aria-label="Close dialog"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-primary/40 backdrop-blur-sm animate-in fade-in-0 duration-300"
      />

      <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-card shadow-2xl transition-all duration-300 animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4">
        {submitted ? (
          <div className="flex flex-col items-center gap-4 p-8 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <CheckCircle2 className="size-7" aria-hidden="true" />
            </div>
            <h2 id="application-modal-title" className="font-serif text-2xl font-semibold text-foreground">
              Application submitted
            </h2>
            <p className="text-sm text-muted-foreground">
              Thank you, {form.fullName.split(" ")[0]}. We&apos;ve received your application for a{" "}
              {form.visaType} visa to {COUNTRY_FLAGS[form.destinationCountry]} {form.destinationCountry}. Our team will review it and reach
              out to you at {form.email} shortly.
            </p>
            <p className="text-xs text-muted-foreground">
              Keep your passport number handy — you can use it anytime to check your application status.
            </p>
            <Button type="button" size="lg" className="mt-2 h-11 w-full" onClick={onClose}>
              Done
            </Button>
          </div>
        ) : (
          <div className="p-6">
            <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
              <div>
                <h2 id="application-modal-title" className="font-serif text-xl font-semibold text-foreground">
                  Start your visa application
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Tell us a few details and our advisors will guide you through the rest.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4" noValidate>
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-foreground">
                  Full Name
                </label>
                <input
                  id="fullName"
                  value={form.fullName}
                  onChange={(e) => update("fullName", e.target.value)}
                  placeholder="Your full legal name"
                  className="mt-1.5 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground shadow-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="passportNumber" className="block text-sm font-medium text-foreground">
                    Passport Number
                  </label>
                  <input
                    id="passportNumber"
                    value={form.passportNumber}
                    onChange={(e) => update("passportNumber", e.target.value)}
                    placeholder="e.g. A1234567"
                    className="mt-1.5 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground shadow-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
                  />
                </div>
                <div>
                  <label htmlFor="nationality" className="block text-sm font-medium text-foreground">
                    Nationality
                  </label>
                  <input
                    id="nationality"
                    value={form.nationality}
                    onChange={(e) => update("nationality", e.target.value)}
                    placeholder="e.g. Bangladeshi"
                    className="mt-1.5 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground shadow-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    placeholder="you@example.com"
                    className="mt-1.5 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground shadow-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-foreground">
                    Phone
                  </label>
                  <div className="mt-1.5 flex gap-2">
                    <select
                      id="phoneCode"
                      aria-label="Country code"
                      value={phoneCode}
                      onChange={(e) => setPhoneCode(e.target.value)}
                      className="w-[7.5rem] shrink-0 truncate rounded-lg border border-input bg-background px-2 py-2.5 text-sm text-foreground shadow-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={c.name} value={c.dial}>
                          {c.dial} {c.name}
                        </option>
                      ))}
                    </select>
                    <input
                      id="phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      placeholder="1XXX-XXXXXX"
                      className="w-full min-w-0 rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground shadow-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="destinationCountry" className="block text-sm font-medium text-foreground">
                    Destination Country
                  </label>
                  <select
                    id="destinationCountry"
                    value={form.destinationCountry}
                    onChange={(e) => update("destinationCountry", e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground shadow-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
                  >
                    <option value="">Select a country</option>
                    {ALL_COUNTRIES.map((c) => (
                      <option key={c} value={c}>
                        {COUNTRY_FLAGS[c]} {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="visaType" className="block text-sm font-medium text-foreground">
                    Visa Type
                  </label>
                  <input
                    id="visaType"
                    value={form.visaType}
                    onChange={(e) => update("visaType", e.target.value)}
                    placeholder="e.g. Skilled Worker"
                    className="mt-1.5 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground shadow-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="travelDate" className="block text-sm font-medium text-foreground">
                  Planned Travel Date <span className="text-muted-foreground">(optional)</span>
                </label>
                <input
                  id="travelDate"
                  type="date"
                  value={form.travelDate}
                  onChange={(e) => update("travelDate", e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground shadow-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
                />
              </div>

              {error && (
                <p role="alert" className="flex items-center gap-1.5 text-sm text-destructive">
                  <AlertCircle className="size-4" aria-hidden="true" />
                  {error}
                </p>
              )}

              <Button type="submit" size="lg" className="h-12 w-full gap-2 text-base" disabled={loading}>
                {loading ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
                {loading ? "Submitting…" : "Submit Application"}
              </Button>

              <p className="flex items-start gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                Bank-grade encryption. Your details are only used to process your application.
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
