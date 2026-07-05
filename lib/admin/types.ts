export type ManualStatus = "auto" | "0" | "1" | "2" | "3" | "rejected"

export const STAGE_LABELS = ["Submitted", "Processing", "Document Verified", "Visa Approved"] as const

export type DocumentCategory =
  | "passport_copy"
  | "job_letter"
  | "medical_certificate"
  | "fingerprint"
  | "other"

export const DOCUMENT_CATEGORY_LABELS: Record<DocumentCategory, string> = {
  passport_copy: "Passport Copy",
  job_letter: "Job Letter",
  medical_certificate: "Medical Certificate",
  fingerprint: "Fingerprint Form",
  other: "Other Document",
}

export interface AppDocument {
  id: string
  name: string
  category?: DocumentCategory
  /** Base64 data URL of the uploaded file, so it can be previewed/downloaded. */
  dataUrl?: string
  addedBy: "applicant" | "admin"
  addedAt: string
}

export interface Application {
  id: string
  fullName: string
  passportNumber: string
  nationality: string
  email: string
  phone: string
  destinationCountry: string
  visaType: string
  travelDate: string
  /** Base64 data URL of the applicant's photo, set by the admin. */
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

/**
 * Resolves the stage an application should display.
 * - If an admin has manually forced a stage (or "rejected"), that wins.
 * - Otherwise ("auto"), the stage progresses automatically over time from submission,
 *   which is a placeholder for a real processing pipeline.
 */
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
