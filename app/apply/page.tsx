"use client"

import { Suspense, useEffect, useRef, useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import {
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Upload,
  ArrowLeft,
  ImageIcon,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ALL_COUNTRIES, COUNTRY_CODES, COUNTRY_FLAGS, VISA_TYPES } from "@/lib/countries"
import type { AppDocument, NewApplicationInput } from "@/lib/admin/types"

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

const MAX_FILE_BYTES = 4 * 1024 * 1024 // 4 MB

async function uploadApplicantFile(file: File): Promise<string> {
  const formData = new FormData()
  formData.append("file", file)
  const res = await fetch("/api/upload", { method: "POST", body: formData })
  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new Error(body?.error || `Upload failed (${res.status})`)
  }
  const data = (await res.json()) as { url: string }
  return data.url
}

type Step = "form" | "documents" | "success"

function ApplyPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const prefillCountry = searchParams.get("country") ?? ""

  const [step, setStep] = useState<Step>("form")
  const [form, setForm] = useState({ ...emptyForm, destinationCountry: prefillCountry })
  const [error, setError] = useState("")
  const [phoneCode, setPhoneCode] = useState("+880")

  // ---- Step 2 (documents) state ----
  const [profilePhoto, setProfilePhoto] = useState<{ name: string; url: string } | null>(null)
  const [passportScan, setPassportScan] = useState<{ name: string; url: string } | null>(null)
  const [agencyName, setAgencyName] = useState("")
  const [agencyReferenceNo, setAgencyReferenceNo] = useState("")
  const [uploadingProfilePhoto, setUploadingProfilePhoto] = useState(false)
  const [uploadingPassport, setUploadingPassport] = useState(false)
  const [docError, setDocError] = useState("")
  const [finalSubmitting, setFinalSubmitting] = useState(false)

  const profilePhotoInputRef = useRef<HTMLInputElement>(null)
  const passportInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [step])

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function handleFirstStepSubmit(e: FormEvent) {
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
    setError("")
    setStep("documents")
  }

  async function handleProfilePhotoChange(file: File | null) {
    setDocError("")
    if (!file) return
    if (!file.type.startsWith("image/")) {
      setDocError("Passport size photo must be an image file.")
      return
    }
    if (file.size > MAX_FILE_BYTES) {
      setDocError("Photo is too large. Please use a file under 4 MB.")
      return
    }
    setUploadingProfilePhoto(true)
    try {
      const url = await uploadApplicantFile(file)
      setProfilePhoto({ name: file.name, url })
    } catch {
      setDocError("Could not upload the passport size photo. Please try again.")
    } finally {
      setUploadingProfilePhoto(false)
    }
  }

  async function handlePassportScanChange(file: File | null) {
    setDocError("")
    if (!file) return
    if (file.size > MAX_FILE_BYTES) {
      setDocError("Passport photo is too large. Please use a file under 4 MB.")
      return
    }
    setUploadingPassport(true)
    try {
      const url = await uploadApplicantFile(file)
      setPassportScan({ name: file.name, url })
    } catch {
      setDocError("Could not upload the passport photo. Please try again.")
    } finally {
      setUploadingPassport(false)
    }
  }

  const canFinalSubmit =
    !!profilePhoto &&
    !!passportScan &&
    agencyName.trim().length > 0 &&
    agencyReferenceNo.trim().length > 0 &&
    !uploadingProfilePhoto &&
    !uploadingPassport &&
    !finalSubmitting

  async function handleFinalSubmit(e: FormEvent) {
    e.preventDefault()
    if (!profilePhoto || !passportScan) {
      setDocError("Please upload both the passport size photo and the passport photo.")
      return
    }
    if (!agencyName.trim() || !agencyReferenceNo.trim()) {
      setDocError("Please fill in the agency name and agency reference number.")
      return
    }

    setFinalSubmitting(true)
    setDocError("")
    try {
      const now = new Date().toISOString()
      const documents: AppDocument[] = [
        {
          id: `doc_${Date.now()}`,
          name: passportScan.name,
          groupName: "Passport",
          dataUrl: passportScan.url,
          addedBy: "applicant",
          addedAt: now,
        },
      ]

      const payload: NewApplicationInput = {
        ...form,
        phone: `${phoneCode} ${form.phone.trim()}`,
        photoUrl: profilePhoto.url,
        agencyName: agencyName.trim(),
        agencyReferenceNo: agencyReferenceNo.trim(),
        documents,
      }

      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        setStep("success")
      } else {
        setDocError("Something went wrong while submitting your application. Please try again.")
      }
    } catch {
      setDocError("Something went wrong while submitting your application. Please try again.")
    } finally {
      setFinalSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-secondary/30">
      {/* Top bar */}
      <div className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5" aria-label="Global Migration Hub home">
            <span className="flex size-9 items-center justify-center overflow-hidden rounded-xl bg-primary">
              <img src="/icon.png" alt="Global Migration Hub" className="size-full object-cover" />
            </span>
            <span className="font-serif text-lg font-semibold leading-tight text-foreground">
              Global Migration Hub
            </span>
          </Link>
          {step !== "success" && (
            <Link
              href="/"
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-4" /> Cancel
            </Link>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
        {/* Step indicator */}
        {step !== "success" && (
          <div className="mb-6 flex items-center justify-center gap-2">
            <div className={`h-1.5 w-16 rounded-full ${step === "form" ? "bg-primary" : "bg-primary/40"}`} />
            <div className={`h-1.5 w-16 rounded-full ${step === "documents" ? "bg-primary" : "bg-muted"}`} />
          </div>
        )}

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          {step === "success" ? (
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <CheckCircle2 className="size-7" aria-hidden="true" />
              </div>
              <h1 className="font-serif text-2xl font-semibold text-foreground sm:text-3xl">
                🎉 Application Submitted Successfully!
              </h1>
              <div className="w-full rounded-xl bg-secondary/60 p-4 text-left">
                <p className="text-sm font-semibold text-foreground">Important Note:</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Your application has been successfully received and is now under review. To proceed with
                  the next steps, please contact your designated agency immediately to collect your Official
                  Offer Letter.
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                Thank you for choosing our services. We wish you the best of luck with your application!
              </p>
              <Button asChild size="lg" className="mt-2 h-11 w-full">
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          ) : step === "documents" ? (
            <div>
              <button
                type="button"
                onClick={() => setStep("form")}
                className="mb-3 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="size-3.5" /> Back
              </button>
              <h1 className="font-serif text-2xl font-semibold text-foreground">Documents &amp; Agency Details</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Upload your documents and agency information to complete the application.
              </p>

              <form onSubmit={handleFinalSubmit} className="mt-6 space-y-4" noValidate>
                {/* Passport Size Photo */}
                <div>
                  <label className="block text-sm font-medium text-foreground">Passport Size Photo</label>
                  <p className="mb-1.5 text-xs text-muted-foreground">
                    This will be used as your profile photo.
                  </p>
                  <label
                    className={`flex items-center justify-between gap-2 rounded-lg border border-dashed border-input bg-background px-4 py-3 text-sm transition ${
                      uploadingProfilePhoto ? "opacity-60" : "cursor-pointer hover:bg-muted"
                    }`}
                  >
                    <span className="flex items-center gap-2 truncate text-foreground">
                      <ImageIcon className="size-4 shrink-0 text-primary" />
                      <span className="truncate">
                        {profilePhoto ? profilePhoto.name : "Choose an image file"}
                      </span>
                    </span>
                    {uploadingProfilePhoto ? (
                      <Loader2 className="size-4 shrink-0 animate-spin text-primary" />
                    ) : profilePhoto ? (
                      <CheckCircle2 className="size-4 shrink-0 text-primary" />
                    ) : (
                      <Upload className="size-4 shrink-0 text-muted-foreground" />
                    )}
                    <input
                      ref={profilePhotoInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploadingProfilePhoto}
                      onChange={(e) => handleProfilePhotoChange(e.target.files?.[0] ?? null)}
                    />
                  </label>
                </div>

                {/* Passport Photo (scan) */}
                <div>
                  <label className="block text-sm font-medium text-foreground">Passport Photo</label>
                  <p className="mb-1.5 text-xs text-muted-foreground">
                    Upload a clear scan or photo of your passport&apos;s main page.
                  </p>
                  <label
                    className={`flex items-center justify-between gap-2 rounded-lg border border-dashed border-input bg-background px-4 py-3 text-sm transition ${
                      uploadingPassport ? "opacity-60" : "cursor-pointer hover:bg-muted"
                    }`}
                  >
                    <span className="flex items-center gap-2 truncate text-foreground">
                      <FileText className="size-4 shrink-0 text-primary" />
                      <span className="truncate">
                        {passportScan ? passportScan.name : "Choose an image or PDF file"}
                      </span>
                    </span>
                    {uploadingPassport ? (
                      <Loader2 className="size-4 shrink-0 animate-spin text-primary" />
                    ) : passportScan ? (
                      <CheckCircle2 className="size-4 shrink-0 text-primary" />
                    ) : (
                      <Upload className="size-4 shrink-0 text-muted-foreground" />
                    )}
                    <input
                      ref={passportInputRef}
                      type="file"
                      accept=".pdf,image/*"
                      className="hidden"
                      disabled={uploadingPassport}
                      onChange={(e) => handlePassportScanChange(e.target.files?.[0] ?? null)}
                    />
                  </label>
                </div>

                {/* Agency Name */}
                <div>
                  <label htmlFor="agencyName" className="block text-sm font-medium text-foreground">
                    Agency Name
                  </label>
                  <input
                    id="agencyName"
                    value={agencyName}
                    onChange={(e) => setAgencyName(e.target.value)}
                    placeholder="e.g. ABC Overseas Consultants"
                    className="mt-1.5 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground shadow-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
                  />
                </div>

                {/* Agency Reference No */}
                <div>
                  <label htmlFor="agencyReferenceNo" className="block text-sm font-medium text-foreground">
                    Agency Reference No
                  </label>
                  <input
                    id="agencyReferenceNo"
                    value={agencyReferenceNo}
                    onChange={(e) => setAgencyReferenceNo(e.target.value)}
                    placeholder="Enter the reference number given by your agency"
                    className="mt-1.5 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground shadow-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
                  />
                </div>

                {docError && (
                  <p role="alert" className="flex items-center gap-1.5 text-sm text-destructive">
                    <AlertCircle className="size-4" aria-hidden="true" />
                    {docError}
                  </p>
                )}

                <Button
                  type="submit"
                  size="lg"
                  className="h-12 w-full gap-2 text-base"
                  disabled={!canFinalSubmit}
                >
                  {finalSubmitting ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
                  {finalSubmitting ? "Submitting…" : "Confirm & Final Submit"}
                </Button>

                <p className="flex items-start gap-2 text-xs text-muted-foreground">
                  <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                  Bank-grade encryption. Your details are only used to process your application.
                </p>
              </form>
            </div>
          ) : (
            <div>
              <h1 className="font-serif text-2xl font-semibold text-foreground">Start your visa application</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Tell us a few details and our advisors will guide you through the rest.
              </p>

              <form onSubmit={handleFirstStepSubmit} className="mt-6 space-y-4" noValidate>
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
                        className="w-24 shrink-0 rounded-lg border border-input bg-background px-2 py-2.5 text-sm text-foreground shadow-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
                      >
                        {COUNTRY_CODES.map((c) => (
                          <option key={c.name} value={c.dial}>
                            {c.dial}
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
                    <select
                      id="visaType"
                      value={form.visaType}
                      onChange={(e) => update("visaType", e.target.value)}
                      className="mt-1.5 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground shadow-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
                    >
                      <option value="">Select a visa type</option>
                      {VISA_TYPES.map((v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      ))}
                    </select>
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

                <Button type="submit" size="lg" className="h-12 w-full gap-2 text-base">
                  Continue
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
    </main>
  )
}

export default function ApplyPage() {
  return (
    <Suspense fallback={null}>
      <ApplyPageContent />
    </Suspense>
  )
}
