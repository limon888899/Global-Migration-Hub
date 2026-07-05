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
import {
  Lock,
  X,
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  ShieldCheck,
  ArrowLeft,
  Mail,
  Phone,
  Globe,
  Plane,
  FileText,
  Download,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  effectiveStage,
  STAGE_LABELS,
  DOCUMENT_CATEGORY_LABELS,
  type Application,
} from "@/lib/admin/types"

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

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
}

function VisaStatusModal({ onClose }: { onClose: () => void }) {
  const [passport, setPassport] = useState("")
  const [result, setResult] = useState<Application | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

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

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const key = passport.trim()
    if (!key) {
      setError("Please enter your passport number.")
      setResult(null)
      return
    }
    setLoading(true)
    setError("")
    try {
      const res = await fetch(`/api/visa-status?passport=${encodeURIComponent(key)}`)
      if (res.ok) {
        const app = (await res.json()) as Application
        setResult(app)
        setError("")
      } else {
        setResult(null)
        setError("No record found for that passport number. Please check and try again.")
      }
    } catch {
      setResult(null)
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  function handleNewSearch() {
    setResult(null)
    setPassport("")
    setError("")
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="visa-modal-title"
    >
      <button
        type="button"
        aria-label="Close dialog"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-primary/40 backdrop-blur-sm"
      />

      <div
        className={`relative z-10 w-full overflow-hidden rounded-2xl border border-border bg-card shadow-2xl transition-all ${
          result ? "max-w-xl" : "max-w-md"
        }`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-border p-6">
          <div>
            {result ? (
              <button
                type="button"
                onClick={handleNewSearch}
                className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
              >
                <ArrowLeft className="size-4" /> Search another passport
              </button>
            ) : (
              <div className="flex items-center gap-2 text-primary">
                <Lock className="size-5" aria-hidden="true" />
                <span className="text-sm font-semibold">Secure lookup</span>
              </div>
            )}
            <h2
              id="visa-modal-title"
              className="mt-2 font-serif text-2xl font-semibold text-foreground"
            >
              {result ? "Applicant Profile" : "Check your visa status"}
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

        <div className="max-h-[75vh] overflow-y-auto p-6">
          {!result ? (
            <>
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
                Bank-grade encryption on every lookup. Enter the passport number used on
                your application.
              </p>
            </>
          ) : (
            <ApplicantProfile app={result} />
          )}
        </div>
      </div>
    </div>
  )
}

function ApplicantProfile({ app }: { app: Application }) {
  const stage = effectiveStage(app)

  const steps =
    stage === "rejected"
      ? [
          { label: "Application received", state: "done" as const },
          { label: "Documents verified", state: "done" as const },
          { label: "Reviewed by caseworker", state: "done" as const },
          { label: "Decision issued — Rejected", state: "done" as const },
        ]
      : STAGE_LABELS.map((label, i) => ({
          label,
          state: (typeof stage === "number" && i < stage
            ? "done"
            : typeof stage === "number" && i === stage
              ? "current"
              : "upcoming") as "done" | "current" | "upcoming",
        }))

  const details: { icon: typeof Mail; label: string; value: string }[] = [
    { icon: Globe, label: "Nationality", value: app.nationality || "—" },
    { icon: Mail, label: "Email", value: app.email || "—" },
    { icon: Phone, label: "Phone", value: app.phone || "—" },
    { icon: Plane, label: "Destination", value: app.destinationCountry || "—" },
  ]

  return (
    <div>
      <div className="flex items-center gap-4">
        <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-secondary text-lg font-semibold text-primary">
          {app.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={app.photoUrl} alt={app.fullName} className="size-full object-cover" />
          ) : (
            <span>{initials(app.fullName) || <User className="size-7" />}</span>
          )}
        </div>
        <div>
          <p className="font-serif text-xl font-semibold text-foreground">{app.fullName}</p>
          <p className="text-sm text-muted-foreground">Passport: {app.passportNumber}</p>
          <StatusBadge
            tone={stage === "rejected" ? "action" : stage === 3 ? "approved" : "progress"}
            label={stage === "rejected" ? "Rejected" : STAGE_LABELS[stage as number]}
          />
        </div>
      </div>

      {stage === "rejected" && app.statusNote && (
        <p className="mt-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {app.statusNote}
        </p>
      )}

      <div className="mt-6 grid grid-cols-1 gap-3 rounded-lg border border-border p-4 sm:grid-cols-2">
        {details.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-start gap-2">
            <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
              <p className="text-sm font-medium text-foreground">{value}</p>
            </div>
          </div>
        ))}
        <div className="flex items-start gap-2">
          <FileText className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Visa Type</p>
            <p className="text-sm font-medium text-foreground">{app.visaType || "—"}</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Clock className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Submitted</p>
            <p className="text-sm font-medium text-foreground">
              {new Date(app.submittedAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="mb-3 text-sm font-semibold text-foreground">Application Progress</h3>
        <ol className="space-y-4">
          {steps.map((step) => (
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

      <div className="mt-6 border-t border-border pt-6">
        <h3 className="mb-3 text-sm font-semibold text-foreground">Documents</h3>
        {app.documents.length === 0 ? (
          <p className="text-sm text-muted-foreground">No documents have been added yet.</p>
        ) : (
          <ul className="space-y-2">
            {app.documents.map((doc) => (
              <li
                key={doc.id}
                className="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <FileText className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {doc.category ? DOCUMENT_CATEGORY_LABELS[doc.category] : doc.name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">{doc.name}</p>
                  </div>
                </div>
                {doc.dataUrl ? (
                  <a
                    href={doc.dataUrl}
                    download={doc.name}
                    className="flex shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline"
                  >
                    <Download className="size-4" /> View
                  </a>
                ) : (
                  <span className="shrink-0 text-xs text-muted-foreground">Pending upload</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="mt-6 flex items-start gap-2 text-xs text-muted-foreground">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
        This profile is only accessible with your correct passport number.
      </p>
    </div>
  )
}

function StatusBadge({ tone, label }: { tone: "progress" | "approved" | "action"; label: string }) {
  const styles =
    tone === "approved"
      ? "bg-primary text-primary-foreground"
      : tone === "action"
        ? "bg-accent text-accent-foreground"
        : "bg-secondary text-primary"
  return (
    <span className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-semibold ${styles}`}>{label}</span>
  )
}
