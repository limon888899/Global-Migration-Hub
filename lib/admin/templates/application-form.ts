import { Builder, clean, formatDate, humanizeKey } from "../pdf-builder"
import { stageLabel, type Application } from "../types"

/**
 * TEMPLATE: Visa Application Form.
 * Filled in automatically from the application record. Edit the sections/fields below to
 * change the design or wording of this document.
 */
export async function buildApplicationForm(app: Application): Promise<Uint8Array> {
  const b = await Builder.create("Application Form")
  b.title("Application Form", `${clean(app.visaType || "Visa")} application  |  ${clean(app.destinationCountry)}`)

  b.section("Applicant details")
  b.fields([
    ["Full name", app.fullName],
    ["Date of birth", formatDate(app.dateOfBirth)],
    ["Nationality", app.nationality],
    ["Passport number", app.passportNumber],
    ["Passport type", app.passportType],
    ["National ID number", app.nationalId],
    ["Email", app.email],
    ["Phone", app.phone],
  ])

  b.section("Destination and visa")
  b.fields([
    ["Destination country", app.destinationCountry],
    ["Visa type", app.visaType],
    ["Applying method", app.applyingMethod === "agency" ? "Through an agency" : "Self-applied"],
    ["Planned travel date", formatDate(app.travelDate)],
    ...(app.employerName ? ([["Employer", app.employerName]] as [string, string][]) : []),
  ])

  if (app.applyingMethod === "agency") {
    b.section("Agency details")
    b.fields([
      ["Agency country", app.agencyCountry],
      ["Agency name", app.agencyName],
      ["Agency reference no.", app.agencyReferenceNo],
    ])
  }

  const extra = Object.entries(app.visaDetails ?? {}).filter(([, v]) => v && String(v).trim())
  if (extra.length) {
    b.section("Additional visa details")
    b.fields(extra.map(([k, v]) => [humanizeKey(k), v] as [string, string]))
  }

  b.section("Application record")
  b.fields([
    ["Submitted on", formatDate(app.submittedAt)],
    ["Current status", stageLabel(app)],
  ])

  b.section("Declaration")
  b.paragraph(
    "I declare that the information given in this application is true, complete and correct to the best of my knowledge. " +
      "I understand that providing false or misleading information may result in my application being refused.",
  )
  b.signatures(["Applicant signature", "Date", "Agent signature"])
  return b.finish()
}
