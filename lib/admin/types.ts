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

export interface AppDocument {
  id: string
  name: string
  groupName: string
  dataUrl?: string
  addedBy: "applicant" | "admin"
  addedAt: string
}

export interface Application {
  id: string
  fullName: string
  passportNumber: string
  passportType: string
  dateOfBirth: string
  nationalId: string
  nationality: string
  email: string
  phone: string
  destinationCountry: string
  visaType: string
  applyingMethod: ApplyingMethod
  agencyCountry: string
  agencyName: string
  agencyReferenceNo: string
  visaDetails: Record<string, string>
  travelDate: string
  companyName?: string
  companyLogo?: string
  employerName?: string
  employerLogoUrl?: string
  photoUrl: string
  submittedAt: string
  manualStatus: ManualStatus
  statusNote: string
  internalNotes: string
  documents: AppDocument[]
}

export type NewApplicationInput = Omit<
  Application,
  "id" | "submittedAt" | "manualStatus" | "statusNote" | "internalNotes"
>

export function effectiveStage(app: Application): number | "rejected" {
  if (app.manualStatus === "rejected") return "rejected"
  if (app.manualStatus !== "auto") return Number(app.manualStatus)

  const submitted = new Date(app.submittedAt).getTime()
  const daysElapsed = Math.max(0, (Date.now() - submitted) / (1000 * 60 * 60 * 24))
  const stage = Math.min(3, Math.floor(daysElapsed / 2))
  return stage
}

export function stageLabel(app: Application): string {
  const stage = effectiveStage(app)
  if (stage === "rejected") return "Rejected"
  return STAGE_LABELS[stage]
}
