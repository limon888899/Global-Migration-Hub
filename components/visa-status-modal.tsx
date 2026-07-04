"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type FormEvent,
  type ReactNode,
} from "react"
import {
  Lock,
  X,
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  ShieldCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"

type Step = {
  label: string
  state: "done" | "current" | "upcoming"
}

type ApplicationRecord = {
  name: string
  visaType: string
  status: string
  statusTone: "progress" | "approved" | "action"
  updated: string
  steps: Step[]
}

// Demo records — in production this would be a secure, authenticated API lookup.
const RECORDS: Record<string, ApplicationRecord> = {
  "P1234567": {
    name: "A. Okafor",
    visaType: "Skilled Worker Visa",
    status: "In Review",
    statusTone: "progress",
    updated: "July 2, 2026",
    steps: [
      { label: "Application received", state: "done" },
      { label: "Documents verified", state: "done" },
      { label: "Under review by caseworker", state: "current" },
      { label: "Decision issued", state: "upcoming" },
    ],
  },
  "P7654321": {
    name: "L. Fernández",
    visaType: "Intra-Company Transfer",
    status: "Approved",
    statusTone: "approved",
    updated: "June 29, 2026",
    steps: [
      { label: "Application received", state: "done" },
      { label: "Documents verified", state: "done" },
      { label: "Reviewed by caseworker", state: "done" },
      { label: "Decision issued — Approved", state: "done" },
    ],
  },
  "P9012345": {
    name: "R. Haddad",
    visaType: "Family Dependant Permit",
    status: "Action Required",
    statusTone: "action",
    updated: "July 1, 2026",
    steps: [
      { label: "Application received", state: "done" },
      { label: "Additional documents requested", state: "current" },
      { label: "Documents verified", state: "upcoming" },
      { label: "Decision issued", state: "upcoming" },
    ],
  },
}

type ModalContextValue = {
  open: () => void
  close: () => void
}

const VisaStatusModalContext = createContext<ModalContextValue | null>(null)

export function useVisaStatusModal() {
  const ctx = useContext(VisaStatusModalContext)
  if (!ctx) {
    throw new Error("useVisaStatusModal must be used within VisaStatusModalProvider")
  }
  return ctx
}

export function VisaStatusModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])

  return (
    <VisaStatusModalContext.Provider value={{ open, close }}>
      {children}
      {isOpen && <VisaStatusModal onClose={close} />}
    </VisaStatusModalContext.Provider>
  )
}

function VisaStatusModal({ onClose }: { onClose: () => void }) {
  const [passport, setPassport] = useState("")
  const [result, setResult] = useState<ApplicationRecord | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // Close on Escape and lock body scroll while open.
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

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const key = passport.trim().toUpperCase()
    if (!key) {
      setError("Please enter your passport number.")
      setResult(null)
      return
    }
    setLoading(true)
    setError("")
    // Simulate a secure lookup
    setTimeout(() => {
      const record = RECORDS[key]
      if (record) {
        setResult(record)
        setError("")
      } else {
        setResult(null)
        setError("No record found for that passport number. Please check and try again.")
      }
      setLoading(false)
    }, 500)
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="visa-modal-title"
    >
      {/* Background overlay — clicking it closes the popup */}
      <button
        type="button"
        aria-label="Close dialog"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-primary/40 backdrop-blur-sm"
      />

      {/* Floating centered card */}
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-border p-6">
          <div>
            <div className="flex items-center gap-2 text-primary">
              <Lock className="size-5" aria-hidden="true" />
              <span className="text-sm font-semibold">Secure lookup</span>
            </div>
            <h2
              id="visa-modal-title"
              className="mt-2 font-serif text-2xl font-semibold text-foreground"
            >
              Check your visa status
            </h2>
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

        <div className="max-h-[70vh] overflow-y-auto p-6">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Enter your passport number to securely view real-time updates on your
            application. Your information stays private and encrypted.
          </p>

          <form onSubmit={handleSubmit} className="mt-5" noValidate>
            <label htmlFor="passport-number" className="block text-sm font-medium text-foreground">
              Passport Number
            </label>
            <input
              id="passport-number"
              name="passport-number"
              type="text"
              autoComplete="off"
              inputMode="text"
              placeholder="Enter your passport number"
              value={passport}
              onChange={(e) => setPassport(e.target.value)}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "passport-error" : undefined}
              className="mt-2 w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground shadow-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
            />

            {error && (
              <p
                id="passport-error"
                role="alert"
                className="mt-2 flex items-center gap-1.5 text-sm text-destructive"
              >
                <AlertCircle className="size-4" aria-hidden="true" />
                {error}
              </p>
            )}

            <Button type="submit" size="lg" className="mt-5 h-12 w-full text-base" disabled={loading}>
              {loading ? "Checking…" : "Enquire Now"}
            </Button>
          </form>

          <p className="mt-5 flex items-start gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
            Bank-grade encryption on every lookup. Demo passport numbers: P1234567,
            P7654321, P9012345.
          </p>

          {result && (
            <div className="mt-6 border-t border-border pt-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-serif text-lg font-semibold text-foreground">
                    {result.visaType}
                  </p>
                  <p className="text-sm text-muted-foreground">Applicant: {result.name}</p>
                </div>
                <StatusBadge tone={result.statusTone} label={result.status} />
              </div>

              <p className="mt-2 text-xs text-muted-foreground">
                Last updated {result.updated}
              </p>

              <ol className="mt-6 space-y-4">
                {result.steps.map((step) => (
                  <li key={step.label} className="flex items-start gap-3">
                    {step.state === "done" ? (
                      <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                    ) : step.state === "current" ? (
                      <Clock className="mt-0.5 size-5 shrink-0 text-accent-foreground" aria-hidden="true" />
                    ) : (
                      <Circle className="mt-0.5 size-5 shrink-0 text-muted-foreground/40" aria-hidden="true" />
                    )}
                    <span
                      className={
                        step.state === "upcoming"
                          ? "text-sm text-muted-foreground"
                          : "text-sm font-medium text-foreground"
                      }
                    >
                      {step.label}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ tone, label }: { tone: ApplicationRecord["statusTone"]; label: string }) {
  const styles =
    tone === "approved"
      ? "bg-primary text-primary-foreground"
      : tone === "action"
        ? "bg-accent text-accent-foreground"
        : "bg-secondary text-primary"
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${styles}`}>{label}</span>
  )
}
