"use client"

import { Suspense, useState, type FormEvent } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import {
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Circle,
  Clock,
  XCircle,
  Plane,
  Globe,
  Mail,
  Phone,
  FileText,
  User,
  Search,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { COUNTRY_FLAGS } from "@/lib/countries"
import { effectiveStage, STAGE_LABELS, type Application, type AppDocument } from "@/lib/admin/types"

function isImageDataUrl(url?: string) {
  if (!url) return false
  if (url.startsWith("data:image/")) return true
  return /\.(png|jpe?g|gif|webp|avif|svg)(\?.*)?$/i.test(url)
}

function isPdfDataUrl(url?: string) {
  if (!url) return false
  if (url.startsWith("data:application/pdf")) return true
  return /\.pdf(\?.*)?$/i.test(url)
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
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

function TrackPageContent() {
  const searchParams = useSearchParams()
  const expectedCountry = searchParams.get("country")

  const [passport, setPassport] = useState("")
  const [result, setResult] = useState<Application | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

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
    <main className="min-h-screen bg-secondary">
      <div className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5" aria-label="Global Migration Hub home">
            <span className="flex size-9 items-center justify-center overflow-hidden rounded-xl bg-primary">
              <img src="/icon.png" alt="Global Migration Hub" className="size-full object-cover" />
            </span>
            <span className="font-serif text-lg font-semibold leading-tight text-foreground">
              Global Migration Hub
            </span>
          </Link>
          {result ? (
            <button
              type="button"
              onClick={handleNewSearch}
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <Search className="size-4" /> New search
            </button>
          ) : (
            <Link
              href="/"
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-4" /> Back home
            </Link>
          )}
        </div>
      </div>

      {!result ? (
        <div className="mx-auto flex min-h-[calc(100vh-73px)] max-w-md flex-col justify-center px-4 py-14 sm:px-6">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ShieldCheck className="size-7" aria-hidden="true" />
          </div>
          <h1 className="mt-5 text-center font-serif text-3xl font-semibold text-foreground">
            Track your application
          </h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            {expectedCountry
              ? `Enter your passport number to check your ${expectedCountry} application status.`
              : "Enter the passport number used on your application to view real-time status updates."}
          </p>

          <form onSubmit={handleSubmit} className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8" noValidate>
            <label htmlFor="passport-number" className="block text-sm font-medium text-foreground">
              Passport Number
            </label>
            <input
              id="passport-number"
              name="passport-number"
              type="text"
              autoComplete="off"
              autoFocus
              placeholder="e.g. A12345678"
              value={passport}
              onChange={(e) => setPassport(e.target.value)}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "passport-error" : undefined}
              className="mt-2 w-full rounded-lg border border-input bg-background px-4 py-3 font-mono text-sm tracking-wider text-foreground shadow-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
            />
            {error && (
              <p id="passport-error" role="alert" className="mt-2 flex items-center gap-1.5 text-sm text-destructive">
                <AlertCircle className="size-4" aria-hidden="true" />
                {error}
              </p>
            )}
            <Button type="submit" size="lg" className="mt-5 h-12 w-full text-base" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" /> Checking…
                </span>
              ) : (
                "Track Status"
              )}
            </Button>
          </form>

          <p className="mt-5 flex items-start justify-center gap-2 text-center text-xs text-muted-foreground">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
            Bank-grade encryption on every lookup.
          </p>
        </div>
      ) : (
        <ApplicantProfile app={result} />
      )}
    </main>
  )
}

function ApplicantProfile({ app }: { app: Application }) {
  const stage = effectiveStage(app)
  const isRejected = stage === "rejected"
  const stageIndex = typeof stage === "number" ? stage : STAGE_LABELS.length - 1
  const progressPercent = isRejected ? 100 : (stageIndex / (STAGE_LABELS.length - 1)) * 100

  const details: { icon: typeof Mail; label: string; value: string }[] = [
    { icon: Globe, label: "Nationality", value: app.nationality || "—" },
    { icon: Mail, label: "Email", value: app.email || "—" },
    { icon: Phone, label: "Phone", value: app.phone || "—" },
    {
      icon: Plane,
      label: "Destination",
      value: app.destinationCountry ? `${COUNTRY_FLAGS[app.destinationCountry] || ""} ${app.destinationCountry}` : "—",
    },
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
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      {/* Boarding-pass style header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-[oklch(0.32_0.09_275)] text-primary-foreground shadow-2xl">
        <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="flex items-center gap-4">
            <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-primary-foreground/30 bg-primary-foreground/10 text-lg font-semibold shadow-lg">
              {app.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={app.photoUrl} alt={app.fullName} className="size-full object-cover" />
              ) : (
                <span>{initials(app.fullName) || <User className="size-8" />}</span>
              )}
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-primary-foreground/60">Applicant</p>
              <h1 className="font-serif text-2xl font-semibold sm:text-3xl">{app.fullName}</h1>
              <p className="mt-1 font-mono text-sm tracking-widest text-primary-foreground/75">
                {app.passportNumber}
              </p>
            </div>
          </div>

          <StatusStamp isRejected={isRejected} label={isRejected ? "Rejected" : STAGE_LABELS[stageIndex]} />
        </div>

        {/* Perforated divider */}
        <div className="relative border-t border-dashed border-primary-foreground/25">
          <span className="absolute -left-3 top-1/2 size-6 -translate-y-1/2 rounded-full bg-secondary" />
          <span className="absolute -right-3 top-1/2 size-6 -translate-y-1/2 rounded-full bg-secondary" />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 text-xs text-primary-foreground/70 sm:px-8">
          <span>Destination: {app.destinationCountry || "—"}</span>
          <span>Visa Type: {app.visaType || "—"}</span>
          <span>App. ID: {app.id.slice(0, 8).toUpperCase()}</span>
        </div>
      </div>

      {/* Flight-path progress tracker */}
      <div className="mt-10 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <h2 className="mb-8 text-sm font-semibold text-foreground">Application Journey</h2>

        {isRejected && app.statusNote && (
          <p className="mb-6 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{app.statusNote}</p>
        )}

        <div className="relative">
          <div className="absolute left-0 right-0 top-4 h-0.5 border-t-2 border-dashed border-border" />
          <div
            className={`absolute left-0 top-4 h-0.5 border-t-2 transition-all duration-700 ${
              isRejected ? "border-destructive" : "border-primary"
            }`}
            style={{ width: `${progressPercent}%` }}
          />
          <div
            className="absolute top-0 -translate-x-1/2 -translate-y-1/2 transition-all duration-700"
            style={{ left: `${progressPercent}%` }}
          >
            <div
              className={`flex size-8 items-center justify-center rounded-full shadow-md ${
                isRejected ? "bg-destructive text-destructive-foreground" : "bg-primary text-primary-foreground"
              }`}
            >
              <Plane className="size-4" aria-hidden="true" />
            </div>
          </div>

          <div className="mt-10 grid grid-cols-4 gap-2">
            {STAGE_LABELS.map((label, i) => {
              const state = isRejected
                ? i <= 2
                  ? "done"
                  : "upcoming"
                : i < stageIndex
                  ? "done"
                  : i === stageIndex
                    ? "current"
                    : "upcoming"
              return (
                <div key={label} className="flex flex-col items-center text-center">
                  <span
                    className={`flex size-6 items-center justify-center rounded-full ${
                      state === "done"
                        ? "bg-primary/15 text-primary"
                        : state === "current"
                          ? "bg-accent/15 text-accent-foreground"
                          : "bg-muted text-muted-foreground/50"
                    }`}
                  >
                    {state === "done" ? (
                      <CheckCircle2 className="size-4" aria-hidden="true" />
                    ) : state === "current" ? (
                      <Clock className="size-3.5" aria-hidden="true" />
                    ) : (
                      <Circle className="size-3.5" aria-hidden="true" />
                    )}
                  </span>
                  <span
                    className={`mt-2 text-[11px] font-medium leading-tight sm:text-xs ${
                      state === "upcoming" ? "text-muted-foreground" : "text-foreground"
                    }`}
                  >
                    {i === 3 && isRejected ? "Rejected" : label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Details grid */}
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {details.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
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

      {/* Documents */}
      <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
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

function StatusStamp({ isRejected, label }: { isRejected: boolean; label: string }) {
  return (
    <div
      className={`flex shrink-0 -rotate-6 items-center gap-2 self-start rounded-lg border-2 px-4 py-2 sm:self-center ${
        isRejected ? "border-destructive/70 text-destructive-foreground" : "border-primary-foreground/50 text-primary-foreground"
      }`}
    >
      {isRejected ? <XCircle className="size-5" /> : <CheckCircle2 className="size-5" />}
      <span className="text-sm font-bold uppercase tracking-widest">{label}</span>
    </div>
  )
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

export default function TrackPage() {
  return (
    <Suspense fallback={null}>
      <TrackPageContent />
    </Suspense>
  )
}
