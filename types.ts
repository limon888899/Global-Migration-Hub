export type ManualStatus = "auto" | "0" | "1" | "2" | "3" | "rejected"

export const STAGE_LABELS = ["Submitted", "Processing", "Document Verified", "Visa Approved"] as const

export interface AppDocument {
  id: string
  name: string
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
  submittedAt: string
  manualStatus: ManualStatus
  statusNote: string
  internalNotes: string
  documents: AppDocument[]
}

export type NewApplicationInput = Omit<
  Application,
  "id" | "submittedAt" | "manualStatus" | "statusNote" | "internalNotes" | "documents"
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
