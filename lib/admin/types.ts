export type ManualStatus = "auto" | "0" | "1" | "2" | "3" | "rejected"

export const STAGE_LABELS = ["Submitted", "Processing", "Document Verified", "Visa Approved"] as const

/**
 * Suggested document section names shown to the admin when creating a new
 * section. Admins are free to type any custom name instead — this is just
 * a convenience list, not a restriction.
 */
export const DEFAULT_DOCUMENT_GROUPS = [
  "Passport",
  "Job Letter",
  "Medical Certificate",
  "Fingerprint Form",
  "Other Document",
]

export interface AppDocument {
  id: string
  name: string
  /**
   * Free-text section/group name chosen by the admin (e.g. "Passport",
   * "Job Letter"). Multiple documents can share the same groupName so a
   * single document type can hold several files (e.g. 3-4 passport photos).
   */
  groupName: string
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
  /** Name of the agency the applicant applied through. */
  agencyName: string
  /** Manually typed agency reference number (not auto-generated). */
  agencyReferenceNo: string
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
