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
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { COUNTRY_FLAGS } from "@/lib/countries"
import {
  effectiveStage,
  STAGE_LABELS,
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
  if (!url) return false
  if (url.startsWith("data:image/")) return true // backward-compat with old base64 docs
  return /\.(png|jpe?g|gif|webp|avif|svg)(\?.*)?$/i.test(url)
}

function isPdfDataUrl(url?: string) {
  if (!url) return false
  if (url.startsWith("data:application/pdf")) return true // backward-compat with old base64 docs
  return /\.pdf(\?.*)?$/i.test(url)
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
  const resultStage = result ? effectiveStage(result) : null

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
          result ? "max-w-2xl" : "max-w-md"
        }`}
      >
        {result ? (
          <div className="relative bg-gradient-to-br from-primary to-primary/80 px-6 pb-7 pt-6 text-primary-foreground">
            <div className="flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={handleNewSearch}
                className="flex items-center gap-1.5 text-sm font-medium text-primary-foreground/80 transition-colors hover:text-primary-foreground"
              >
                <ArrowLeft className="size-4" /> Search another passport
              </button>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="rounded-md p-1.5 text-primary-foreground/70 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="mt-5 flex items-center gap-4">
              <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-primary-foreground/30 bg-primary-foreground/10 text-lg font-semibold shadow-lg">
                {result.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={result.photoUrl} alt={result.fullName} className="size-full object-cover" />
                ) : (
                  <span>{initials(result.fullName) || <User className="size-7" />}</span>
                )}
              </div>
              <div>
                <h2 id="visa-modal-title" className="font-serif text-2xl font-semibold">
                  {result.fullName}
                </h2>
                <p className="text-sm text-primary-foreground/70">Passport: {result.passportNumber}</p>
                <StatusBadge
                  tone={resultStage === "rejected" ? "action" : resultStage === 3 ? "approved" : "progress"}
                  label={resultStage === "rejected" ? "Rejected" : STAGE_LABELS[resultStage as number]}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-start justify-between gap-4 border-b border-border p-6">
            <div>
              <div className="flex items-center gap-2 text-primary">
                <Lock className="size-5" aria-hidden="true" />
                <span className="text-sm font-semibold">Secure lookup</span>
              </div>
              <h2 id="visa-modal-title" className="mt-2 font-serif text-2xl font-semibold text-foreground">
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
        )}

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
    { icon: Plane, label: "Destination", value: app.destinationCountry ? `${COUNTRY_FLAGS[app.destinationCountry]} ${app.destinationCountry}` : "—" },
    { icon: FileText, label: "Visa Type", value: app.visaType || "—" },
    {
      icon: Clock,
      label: "Submitted",
      value: new Date(app.submittedAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    },
  ]

  return (
    <div>
      {stage === "rejected" && app.statusNote && (
        <p className="mb-6 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          {app.statusNote}
        </p>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {details.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="flex items-start gap-3 rounded-xl border border-border bg-secondary/30 p-3"
          >
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon className="size-4" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
              <p className="text-sm font-medium text-foreground">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h3 className="mb-4 text-sm font-semibold text-foreground">Application Progress</h3>
        <ol className="relative space-y-6 border-l-2 border-dashed border-border pl-6">
          {steps.map((step) => (
            <li key={step.label} className="relative">
              <span
                className={`absolute -left-[31px] flex size-6 items-center justify-center rounded-full ${
                  step.state === "done"
                    ? "bg-primary text-primary-foreground"
                    : step.state === "current"
                      ? "bg-accent text-accent-foreground"
                      : "bg-muted text-muted-foreground/40"
                }`}
              >
                {step.state === "done" ? (
                  <CheckCircle2 className="size-4" aria-hidden="true" />
                ) : step.state === "current" ? (
                  <Clock className="size-3.5" aria-hidden="true" />
                ) : (
                  <Circle className="size-3.5" aria-hidden="true" />
                )}
              </span>
              <span
                className={
                  step.state === "upcoming"
                    ? "text-sm text-muted-foreground"
                    : "text-sm font-semibold text-foreground"
                }
              >
                {step.label}
              </span>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-8 border-t border-border pt-6">
        <h3 className="mb-4 text-sm font-semibold text-foreground">Documents</h3>
        {app.documents.length === 0 ? (
          <p className="text-sm text-muted-foreground">No documents have been added yet.</p>
        ) : (
          <div className="space-y-8">
            {groupDocuments(app.documents).map(([groupName, docs]) => (
              <div key={groupName}>
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {groupName} ({docs.length})
                </h4>
                <div className="space-y-4">
                  {docs.map((doc) => (
                    <DocumentFullView key={doc.id} doc={doc} />
                  ))}
                </div>
              </div>
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

function groupDocuments(documents: AppDocument[]): [string, AppDocument[]][] {
  const map = new Map<string, AppDocument[]>()
  for (const doc of documents) {
    const key = doc.groupName?.trim() || "Other"
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(doc)
  }
  return Array.from(map.entries())
}

function DocumentFullView({ doc }: { doc: AppDocument }) {
  const label = doc.name || "Document"

  if (!doc.dataUrl) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/30 p-10 text-center">
        <FileText className="size-8 text-muted-foreground" aria-hidden="true" />
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">Pending upload</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-secondary/20 shadow-sm">
      <div className="flex items-center gap-2 border-b border-border bg-secondary/40 px-4 py-2.5">
        <FileText className="size-4 text-muted-foreground" aria-hidden="true" />
        <span className="text-sm font-semibold text-foreground">{label}</span>
      </div>
      {isImageDataUrl(doc.dataUrl) ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={doc.dataUrl} alt={label} className="w-full object-contain" />
      ) : isPdfDataUrl(doc.dataUrl) ? (
        <embed src={doc.dataUrl} type="application/pdf" className="h-[80vh] w-full" />
      ) : (
        <div className="flex items-center justify-center p-10">
          <FileText className="size-8 text-muted-foreground" aria-hidden="true" />
        </div>
      )}
    </div>
  )
}

function StatusBadge({ tone, label }: { tone: "progress" | "approved" | "action"; label: string }) {
  const styles =
    tone === "approved"
      ? "bg-emerald-400 text-emerald-950"
      : tone === "action"
        ? "bg-accent text-accent-foreground"
        : "bg-primary-foreground/15 text-primary-foreground"
  return (
    <span className={`mt-1.5 inline-block rounded-full px-3 py-1 text-xs font-semibold ${styles}`}>{label}</span>
  )
}
