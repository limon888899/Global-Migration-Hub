"use client"

import { Suspense, useEffect, useMemo, useState } from "react"
import Image from "next/image"
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
  Globe,
  Mail,
  Phone,
  FileText,
  User,
  Search,
  Building2,
  Hash,
  CreditCard,
  CalendarClock,
  X,
} from "lucide-react"
import { EnquireModal } from "@/components/enquire-modal"
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

/**
 * A detailed, solid airplane silhouette (the kind used in real flight-tracker
 * apps like FlightRadar) — deliberately more realistic than a generic line
 * icon. Nose points right by default, matching the left-to-right progress bar.
 */
function RealisticPlaneIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2.5 1.5V22l4-1 4 1v-1.5L13 19v-5.5l8 2.5z" />
    </svg>
  )
}

function TrackPageContent() {
  const searchParams = useSearchParams()
  const expectedCountry = searchParams.get("country") || ""
  const passportParam = searchParams.get("passport") || ""

  const [result, setResult] = useState<Application | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    if (!passportParam) return
    let cancelled = false

    async function run() {
      setLoading(true)
      setError("")
      setHasSearched(false)
      try {
        const params = new URLSearchParams({ passport: passportParam })
        if (expectedCountry) params.set("country", expectedCountry)
        const res = await fetch(`/api/visa-status?${params.toString()}`)
        if (cancelled) return
        if (res.ok) {
          setResult(await res.json())
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
        if (!cancelled) {
          setResult(null)
          setError("Something went wrong. Please try again.")
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
          setHasSearched(true)
        }
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [passportParam, expectedCountry])

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-secondary">
      {/* Portal watermark — sits behind the entire /track page */}
      <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <Image
          src="/images/track-watermark.webp"
          alt=""
          fill
          sizes="1280px"
          quality={60}
          className="object-cover opacity-[0.22]"
        />
        <div className="absolute inset-0 bg-secondary/80" />
      </div>

      <div className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <Link href="/" className="flex min-w-0 items-center gap-2.5" aria-label="Global Migration Hub home">
            <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primary">
              <img src="/icon.png" alt="Global Migration Hub" className="size-full object-cover" />
            </span>
            <span className="truncate font-serif text-lg font-semibold leading-tight text-foreground">
              Global Migration Hub
            </span>
          </Link>
          {result ? (
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="flex shrink-0 items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <Search className="size-4" /> New search
            </button>
          ) : (
            <Link
              href="/"
              className="flex shrink-0 items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-4" /> Back home
            </Link>
          )}
        </div>
      </div>

      {loading ? (
        <div className="mx-auto flex min-h-[calc(100vh-73px)] max-w-md animate-in flex-col items-center justify-center px-4 py-14 text-center fade-in-0 duration-500">
          <Loader2 className="size-8 animate-spin text-primary" aria-hidden="true" />
          <p className="mt-4 text-sm text-muted-foreground">
            Checking your {expectedCountry ? `${expectedCountry} ` : ""}application status…
          </p>
        </div>
      ) : result ? (
        <ApplicantProfile app={result} />
      ) : passportParam && hasSearched ? (
        <div className="mx-auto flex min-h-[calc(100vh-73px)] max-w-md animate-in flex-col items-center justify-center px-4 py-14 text-center fade-in-0 slide-in-from-bottom-4 duration-700 sm:px-6">
          <div className="flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertCircle className="size-7" aria-hidden="true" />
          </div>
          <h1 className="mt-5 font-serif text-2xl font-semibold text-foreground">No application found</h1>
          <p className="mt-2 text-sm text-muted-foreground">{error}</p>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="mt-6 flex h-12 w-full items-center justify-center rounded-full bg-accent px-7 text-base font-semibold text-accent-foreground transition hover:bg-accent/90"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="mx-auto flex min-h-[calc(100vh-73px)] max-w-md animate-in flex-col items-center justify-center px-4 py-14 text-center fade-in-0 slide-in-from-bottom-4 duration-700 sm:px-6">
          <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ShieldCheck className="size-7" aria-hidden="true" />
          </div>
          <h1 className="mt-5 font-serif text-3xl font-semibold text-foreground">Track your application</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {expectedCountry
              ? `Check your ${expectedCountry} application status using your passport number.`
              : "Enter the passport number used on your application to view real-time status updates."}
          </p>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="mt-8 flex h-12 w-full items-center justify-center rounded-full bg-accent px-7 text-base font-semibold text-accent-foreground transition hover:bg-accent/90"
          >
            Check My Status
          </button>
          <p className="mt-5 flex items-start justify-center gap-2 text-center text-xs text-muted-foreground">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
            Bank-grade encryption on every lookup.
          </p>
        </div>
      )}

      <EnquireModal
        country={expectedCountry || undefined}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </main>
  )
}

function ApplicantProfile({ app }: { app: Application }) {
  const stage = effectiveStage(app)
  const isRejected = stage === "rejected"
  const stageIndex = typeof stage === "number" ? stage : STAGE_LABELS.length - 1
  const progressPercent = isRejected ? 100 : (stageIndex / (STAGE_LABELS.length - 1)) * 100

  const [viewDoc, setViewDoc] = useState<{ doc: AppDocument; label: string } | null>(null)

  const groupedDocuments = useMemo(() => {
    const map = new Map<string, AppDocument[]>()
    for (const doc of app.documents) {
      const key = doc.groupName?.trim() || "Other"
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(doc)
    }
    return Array.from(map.entries())
  }, [app.documents])

  useEffect(() => {
    if (!viewDoc) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [viewDoc])

  const dobFormatted = app.dateOfBirth
    ? new Date(app.dateOfBirth).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
    : "—"

  const details: { icon: typeof Mail; label: string; value: string }[] = [
    { icon: Globe, label: "Nationality", value: app.nationality || "—" },
    { icon: Mail, label: "Email", value: app.email || "—" },
    { icon: Phone, label: "Phone", value: app.phone || "—" },
    { icon: CreditCard, label: "Passport Type", value: app.passportType || "—" },
    { icon: Hash, label: "App. ID", value: app.id.slice(0, 8).toUpperCase() },
    {
      icon: Clock,
      label: "Submitted",
      value: new Date(app.submittedAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    },
    ...(app.travelDate
      ? [
          {
            icon: CalendarClock,
            label: "Travel Date",
            value: new Date(app.travelDate).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            }),
          },
        ]
      : []),
    ...(app.applyingMethod === "agency" && app.agencyName
      ? [{ icon: Building2, label: "Agency Name", value: app.agencyName }]
      : []),
    ...(app.applyingMethod === "agency" && app.agencyReferenceNo
      ? [{ icon: Hash, label: "Agency Reference No.", value: app.agencyReferenceNo }]
      : []),
  ]

  return (
    <div className="mx-auto max-w-4xl animate-in px-4 py-10 fade-in-0 slide-in-from-bottom-4 duration-700 sm:px-6 sm:py-14">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card text-card-foreground shadow-xl">
        <Image
          src="/images/gmh-watermark.webp"
          alt=""
          fill
          sizes="896px"
          quality={70}
          aria-hidden="true"
          className="pointer-events-none object-cover opacity-[0.2]"
        />

        <div className="relative flex flex-col items-center gap-5 p-6 text-center sm:p-8">
          <div className="absolute right-4 top-4 hidden flex-col items-center gap-1 rounded-lg bg-background/95 p-1.5 shadow-md ring-1 ring-border sm:flex">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=88x88&margin=0&data=${encodeURIComponent(
                typeof window !== "undefined" ? `${window.location.origin}/track` : "https://globalmigrationhub.com/track",
              )}`}
              alt="QR code to return to this tracking page"
              width={64}
              height={64}
              className="size-16"
            />
            <span className="text-[9px] font-medium uppercase tracking-wide text-muted-foreground">Scan to track</span>
          </div>

          <div className="relative">
            <div className="flex size-24 items-center justify-center overflow-hidden rounded-full border-4 border-primary/20 bg-primary/10 text-2xl font-semibold text-primary shadow-xl sm:size-28">
              {app.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={app.photoUrl} alt={app.fullName} className="size-full object-cover" />
              ) : (
                <span>{initials(app.fullName) || <User className="size-10" />}</span>
              )}
            </div>
            <span className="absolute -bottom-1 -right-1 flex size-8 items-center justify-center rounded-full border-2 border-card bg-tip-green text-tip-green-foreground shadow-md">
              <ShieldCheck className="size-4" aria-hidden="true" />
            </span>
          </div>

          <div className="min-w-0 max-w-full">
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Applicant</p>
            <h1 className="mt-1 break-words font-serif text-2xl font-semibold leading-tight text-foreground sm:text-3xl">
              {app.fullName}
            </h1>
            <p className="mt-1.5 break-all font-mono text-sm tracking-widest text-muted-foreground">
              {app.passportNumber}
            </p>
          </div>

          <div className="grid w-full grid-cols-1 gap-4 border-t border-dashed border-border pt-5 text-left sm:grid-cols-3">
            <div>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Date of Birth</p>
              <p className="mt-0.5 text-sm font-semibold text-foreground">{dobFormatted}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Visa Type</p>
              <p className="mt-0.5 text-sm font-semibold text-foreground">{app.visaType || "—"}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Destination</p>
              <p className="mt-0.5 break-words text-sm font-semibold text-foreground">
                {app.destinationCountry ? `${COUNTRY_FLAGS[app.destinationCountry] || ""} ${app.destinationCountry}` : "—"}
              </p>
            </div>
          </div>

          {(app.employerName || app.employerLogoUrl) && (
            <div className="flex w-full items-center justify-center gap-3 border-t border-dashed border-border pt-5">
              <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-white p-2 shadow-sm">
                {app.employerLogoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={app.employerLogoUrl}
                    alt={app.employerName || "Company logo"}
                    className="size-full object-contain"
                  />
                ) : (
                  <Building2 className="size-5 text-muted-foreground" aria-hidden="true" />
                )}
              </div>
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Working At</p>
                <p className="text-sm font-semibold text-foreground">{app.employerName || "—"}</p>
              </div>
            </div>
          )}
        </div>

        <div className="relative border-t border-dashed border-border">
          <span className="absolute -left-3 top-1/2 size-6 -translate-y-1/2 rounded-full bg-secondary" />
          <span className="absolute -right-3 top-1/2 size-6 -translate-y-1/2 rounded-full bg-secondary" />
        </div>

        <div className="relative flex items-center justify-center gap-2 bg-secondary/40 px-6 py-3 text-xs font-medium text-muted-foreground sm:px-8">
          {isRejected ? (
            <>
              <XCircle className="size-3.5 text-destructive" aria-hidden="true" /> Application Rejected
            </>
          ) : (
            <>
              <CheckCircle2 className="size-3.5 text-primary" aria-hidden="true" /> Current Stage: {STAGE_LABELS[stageIndex]}
            </>
          )}
        </div>
      </div>

      <div className="mt-10 animate-in overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm fade-in-0 slide-in-from-bottom-4 duration-700 fill-mode-both sm:p-8" style={{ animationDelay: "150ms" }}>
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
            <div className="relative flex size-9 items-center justify-center">
              {!isRejected && stageIndex < STAGE_LABELS.length - 1 && (
                <span className="absolute inset-0 animate-ping rounded-full bg-primary/50" aria-hidden="true" />
              )}
              <div
                className={`relative flex size-9 items-center justify-center rounded-full shadow-lg ring-2 ring-card ${
                  isRejected
                    ? "bg-gradient-to-br from-destructive to-destructive/80 text-destructive-foreground"
                    : "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground"
                }`}
              >
                <RealisticPlaneIcon className="size-5 rotate-90 drop-shadow-sm" />
              </div>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-4 gap-1.5 sm:gap-2">
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
                    className={`mt-2 text-[10px] font-medium leading-tight sm:text-xs ${
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

      <div className="mt-6 grid animate-in grid-cols-1 gap-3 fade-in-0 slide-in-from-bottom-4 duration-700 fill-mode-both sm:grid-cols-2" style={{ animationDelay: "250ms" }}>
        {details.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex min-w-0 items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon className="size-4" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
              <p className="break-words text-sm font-medium text-foreground">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div
        className="mt-6 animate-in rounded-2xl border border-border bg-card p-6 shadow-sm fade-in-0 slide-in-from-bottom-4 duration-700 fill-mode-both sm:p-8"
        style={{ animationDelay: "350ms" }}
      >
        <h3 className="mb-4 text-sm font-semibold text-foreground">Documents</h3>
        {app.documents.length === 0 ? (
          <p className="text-sm text-muted-foreground">No documents have been added yet.</p>
        ) : (
          <div className="space-y-7">
            {groupedDocuments.map(([groupName, docs]) => (
              <div key={groupName}>
                <h4 className="mb-3 font-serif text-lg font-bold text-foreground sm:text-xl">{groupName}</h4>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {docs.map((doc, index) => {
                    const label = docs.length > 1 ? `${groupName} ${index + 1}` : groupName
                    return (
                      <DocumentThumbnail key={doc.id} doc={doc} label={label} onOpen={() => setViewDoc({ doc, label })} />
                    )
                  })}
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

      {viewDoc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden overscroll-none bg-black/80 p-4"
          onClick={() => setViewDoc(null)}
        >
          <div
            className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-card shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3">
              <span className="truncate text-sm font-semibold text-foreground">{viewDoc.label}</span>
              <button
                type="button"
                onClick={() => setViewDoc(null)}
                aria-label="Close"
                className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="flex flex-1 items-center justify-center overflow-auto overscroll-contain bg-secondary/20 p-2">
              {viewDoc.doc.dataUrl && isImageDataUrl(viewDoc.doc.dataUrl) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={viewDoc.doc.dataUrl}
                  alt={viewDoc.label}
                  className="max-h-[75vh] w-auto max-w-full rounded-md object-contain"
                />
              ) : viewDoc.doc.dataUrl && isPdfDataUrl(viewDoc.doc.dataUrl) ? (
                <embed src={viewDoc.doc.dataUrl} type="application/pdf" className="h-[75vh] w-full" />
              ) : (
                <div className="flex items-center justify-center p-16">
                  <FileText className="size-10 text-muted-foreground" aria-hidden="true" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function DocumentThumbnail({ doc, label, onOpen }: { doc: AppDocument; label: string; onOpen: () => void }) {
  if (!doc.dataUrl) {
    return (
      <div className="flex aspect-[3/4] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/30 p-3 text-center">
        <FileText className="size-6 text-muted-foreground" aria-hidden="true" />
        <p className="text-xs font-medium leading-tight text-muted-foreground">{label}</p>
        <p className="text-[10px] text-muted-foreground">Pending upload</p>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex aspect-[3/4] flex-col overflow-hidden rounded-xl border border-border bg-secondary/20 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative flex-1 overflow-hidden bg-muted/30">
        {isImageDataUrl(doc.dataUrl) ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={doc.dataUrl}
            alt={label}
            className="absolute inset-0 size-full object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <FileText className="size-8 text-muted-foreground" aria-hidden="true" />
          </div>
        )}
      </div>
      <div className="flex items-center gap-1.5 border-t border-border bg-card px-2.5 py-2">
        <FileText className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
        <span className="truncate text-xs font-medium text-foreground">{label}</span>
      </div>
    </button>
  )
}

export default function TrackPage() {
  return (
    <Suspense fallback={null}>
      <TrackPageContent />
    </Suspense>
  )
}
