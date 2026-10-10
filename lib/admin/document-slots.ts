/**
 * Document sections shown on every application in Admin → Documents.
 * The `name` is also stored as the document's `groupName`, so the same section
 * title appears on the applicant's /track page.
 */
export const VISA_DOCUMENT_SLOTS = [
  { name: "Application Form", hint: "Generate it below, or upload the signed copy." },
  { name: "Job Offer Letter", hint: "Upload the signed original from the employer." },
  { name: "Police Clearance", hint: "Upload the original certificate from the police authority." },
  { name: "E-Medical Report", hint: "Upload the original report from the panel physician." },
  { name: "Visa Grant", hint: "Upload the official grant notice from the immigration authority." },
  { name: "Visa Notification", hint: "Upload the official notification from the immigration authority." },
  { name: "Plane Ticket", hint: "Upload the ticket or e-ticket issued by the airline." },
  { name: "Visa", hint: "Upload the official visa issued by the authority." },
] as const

export const SLOT_NAMES: string[] = VISA_DOCUMENT_SLOTS.map((s) => s.name)

/** Section names used for documents created by the agency generator. */
export const GROUP_APPLICATION_FORM = "Application Form"
export const GROUP_SERVICE_AGREEMENT = "Service Agreement"
export const GROUP_CHECKLIST = "Document Checklist"
export const GROUP_COMBINED = "Combined Documents"

/** Generated files start with these prefixes, so re-generating replaces the old copy. */
export const PREFIX_APPLICATION_FORM = "Application-Form-"
export const PREFIX_SERVICE_AGREEMENT = "Service-Agreement-"
export const PREFIX_CHECKLIST = "Document-Checklist-"
export const PREFIX_COMBINED = "Combined-Documents-"
