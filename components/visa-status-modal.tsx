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
  Eye,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  effectiveStage,
  STAGE_LABELS,
  DOCUMENT_CATEGORY_LABELS,
  type Application,
  type AppDocument,
} from "@/lib/admin/types"

type ModalContextValue = {
  open: (expectedCountry?: string) => void
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
  const [expectedCountry, setExpectedCountry] = useState<string | null>(null)

  const open = useCallback((country?: string) => {
    setExpectedCountry(country ?? null)
    setIsOpen(true)
  }, [])
  const close = useCallback(() => setIsOpen(false), [])

  return (
    <VisaStatusModalContext.Provider value={{ open, close }}>
      {children}
      {isOpen && <VisaStatusModal onClose={close} expectedCountry={expectedCountry} />}
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

function isImageDataUrl(url?: string) {
  return Boolean(url && url.startsWith("data:image/"))
}

function isPdfDataUrl(url?: string) {
  return Boolean(url && url.startsWith("data:application/pdf"))
}

function VisaStatusModal({
  onClose,
  expectedCountry,
}: {
  onClose: () => void
  expectedCountry: string | null
}) {
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
      const params = new URLSearchParams({ passport: key })
      if (expectedCountry) params.set("country", expectedCountry)
      const res = await fetch(`/api/visa-status?${params.toString()}`)
      if (res.ok) {
        const app = (await res.json()) as Application
        setResult(app)
        setError("")
      } else {
        const body = await res.json().catch(() => null)
        setResult(null)
        if (body?.error === "country_mismatch" && expectedCountry) {
          setError(
            `No ${expectedCountry} application was found for that passport number. Please check the country you applied for and try again.`,
          )
        } else {
          setError("No record found for that passport number. Please check and try again.")
        }
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
        className="absolute inset-0 h-full w-full cursor-default bg-primary/40 backdrop-blur-sm animate-in fade-in-0 duration-300"
      />

      <div
        className={`relative z-10 w-full overflow-hidden rounded-2xl border border-border bg-card shadow-2xl transition-all duration-300 animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 ${
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
            <div key="search-form" className="animate-in fade-in-0 slide-in-from-left-3 duration-300">
              <p className="text-sm leading-relaxed text-muted-foreground">
                {expectedCountry
                  ? `Enter your passport number to check your ${expectedCountry} application status. Your information stays private and encrypted.`
                  : "Enter your passport number to securely view real-time updates on your application. Your information stays private and encrypted."}
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
            </div>
          ) : (
            <div key={result.id} className="animate-in fade-in-0 slide-in-from-right-3 duration-300">
              <ApplicantProfile app={result} />
            </div>
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
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {app.documents.map((doc) => (
              <DocumentPreviewCard key={doc.id} doc={doc} />
            ))}
          </div>
        )}
      </div>

      <p className="mt-6 flex items-start gap-2 text-xs text-muted-foreground">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
        This profile is only accessible with your correct passport number.
      </p>
    </div>
  )
}

function DocumentPreviewCard({ doc }: { doc: AppDocument }) {
  const [expanded, setExpanded] = useState(false)
  const label = doc.category ? DOCUMENT_CATEGORY_LABELS[doc.category] : "Document"

  if (!doc.dataUrl) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/30 p-4 text-center">
        <FileText className="size-6 text-muted-foreground" aria-hidden="true" />
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="text-[11px] text-muted-foreground">Pending upload</p>
      </div>
    )
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className="group flex flex-col overflow-hidden rounded-lg border border-border bg-secondary/40 text-left transition hover:border-primary/50 hover:shadow-md"
      >
        <div className="flex aspect-[4/3] w-full items-center justify-center overflow-hidden bg-muted">
          {isImageDataUrl(doc.dataUrl) ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={doc.dataUrl}
              alt={label}
              className="size-full object-cover transition duration-300 group-hover:scale-105"
            />
          ) : isPdfDataUrl(doc.dataUrl) ? (
            <embed src={doc.dataUrl} type="application/pdf" className="pointer-events-none size-full" />
          ) : (
            <FileText className="size-8 text-muted-foreground" aria-hidden="true" />
          )}
        </div>
        <div className="flex items-center justify-between gap-1 px-2.5 py-1.5">
          <span className="truncate text-xs font-medium text-foreground">{label}</span>
          <Eye className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
        </div>
      </button>

      {expanded && (
        <div
          className="fixed inset-0 z-[110] flex animate-in fade-in-0 items-center justify-center bg-black/70 p-4 backdrop-blur-sm duration-200"
          role="dialog"
          aria-modal="true"
          onClick={() => setExpanded(false)}
        >
          <div
            className="relative max-h-[85vh] w-full max-w-2xl animate-in fade-in-0 zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setExpanded(false)}
              aria-label="Close preview"
              className="absolute -top-10 right-0 rounded-md p-1.5 text-white/80 transition hover:text-white"
            >
              <X className="size-6" />
            </button>
            <div className="overflow-hidden rounded-xl border border-white/10 bg-card shadow-2xl">
              <div className="border-b border-border px-4 py-2 text-sm font-medium text-foreground">{label}</div>
              {isImageDataUrl(doc.dataUrl) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={doc.dataUrl} alt={label} className="max-h-[75vh] w-full object-contain" />
              ) : isPdfDataUrl(doc.dataUrl) ? (
                <embed src={doc.dataUrl} type="application/pdf" className="h-[75vh] w-full" />
              ) : null}
            </div>
          </div>
        </div>
      )}
    </>
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
