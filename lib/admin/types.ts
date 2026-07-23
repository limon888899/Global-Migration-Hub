export type ManualStatus = "auto" | "0" | "1" | "2" | "3" | "rejected"

export const STAGE_LABELS = ["Submitted", "Processing", "Document Verified", "Visa Approved"] as const

export const DEFAULT_DOCUMENT_GROUPS = [
  "Passport",
  "Job Offer Letter",
  "Police Clearance Certificate",
  "Offer Letter / Admission Letter",
  "Hotel Booking / Invitation Letter",
  "Trade License / Invitation Letter",
  "Medical Invitation / Appointment",
  "Relationship Proof",
  "Supporting Document",
  "Other Document",
]

export type ApplyingMethod = "self" | "agency"

export type AppDocument = {
  id: string
  name: string
  groupName: string
  dataUrl: string
  addedBy: "applicant" | "admin"
  addedAt: string
}

export type NewApplicationInput = {
  fullName: string
  passportNumber: string
  passportType: string
  dateOfBirth: string
  nationalId?: string
  nationality: string
  email: string
  phone: string
  destinationCountry: string
  visaType: string
  applyingMethod: ApplyingMethod
  agencyCountry?: string
  agencyName?: string
  agencyReferenceNo?: string
  visaDetails?: Record<string, string>
  travelDate?: string
  employerName?: string
  employerLogoUrl?: string
  photoUrl?: string
  documents: AppDocument[]
}

export function effectiveStage(app: { manualStatus?: string; submittedAt: string }): number | "rejected" {
  if (app.manualStatus === "rejected") return "rejected"
  if (app.manualStatus && app.manualStatus !== "auto") return Number(app.manualStatus)

  const submitted = new Date(app.submittedAt).getTime()
  const daysElapsed = Math.max(0, (Date.now() - submitted) / (1000 * 60 * 60 * 24))
  const stage = Math.min(3, Math.floor(daysElapsed / 2))
  return stage
}

export function stageLabel(app: { manualStatus?: string; submittedAt: string }): string {
  const stage = effectiveStage(app)
  if (stage === "rejected") return "Rejected"
  return STAGE_LABELS[stage]
}
