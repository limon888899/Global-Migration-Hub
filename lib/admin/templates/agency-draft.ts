import { Builder, clean, formatDate } from "../pdf-builder"
import type { Application } from "../types"
import { AGENCY } from "./agency-info"

const OFFICIAL_DOCUMENT_NOTICE =
  "INTERNAL DRAFT — NOT AN OFFICIAL GOVERNMENT, EMPLOYER, MEDICAL, POLICE, AIRLINE OR VISA DOCUMENT. Replace this draft with the original document issued by the authorised organisation."

export async function buildAgencyDraft(app: Application, documentTitle: string): Promise<Uint8Array> {
  const b = await Builder.create(`${documentTitle} - Internal Draft`)
  b.title(`${documentTitle} - Internal Draft`, `${clean(app.visaType || "Visa")}  |  ${clean(app.destinationCountry)}`)
  b.paragraph(OFFICIAL_DOCUMENT_NOTICE, { bold: true, gap: 12 })

  b.section("Applicant details")
  b.fields([
    ["Full name", app.fullName],
    ["Passport number", app.passportNumber],
    ["Date of birth", formatDate(app.dateOfBirth)],
    ["Nationality", app.nationality],
    ["Email", app.email],
    ["Phone", app.phone],
  ])

  b.section("Application details")
  b.fields([
    ["Destination country", app.destinationCountry],
    ["Visa type", app.visaType],
    ["Travel date", formatDate(app.travelDate)],
    ["Employer", app.employerName],
    ["Agency name", app.agencyName],
    ["Agency reference no.", app.agencyReferenceNo],
  ])

  if (app.visaDetails && Object.keys(app.visaDetails).length > 0) {
    b.section("Additional information")
    b.fields(
      Object.entries(app.visaDetails).map(([key, value]) => [
        key.replace(/([A-Z])/g, " $1").replace(/[_-]+/g, " ").replace(/^./, (character) => character.toUpperCase()),
        value,
      ]),
    )
  }

  b.section("Agency review")
  b.paragraph(
    `Prepared for internal case management by ${AGENCY.name}. Verify all information and attach the original ${clean(documentTitle)} issued by the authorised organisation before relying on it.`,
  )
  b.signatures(["Prepared by", "Reviewed by", "Date"])
  return b.finish()
}
