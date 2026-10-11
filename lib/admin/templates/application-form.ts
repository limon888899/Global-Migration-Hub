import { Builder, clean, formatDate } from "../pdf-builder"
import type { Application } from "../types"
import { AGENCY } from "./agency-info"

/**
 * TEMPLATE: Visa Application Form.
 * Draws a structured form from the applicant's details.
 */
export async function buildApplicationForm(app: Application): Promise<Uint8Array> {
  const b = await Builder.create("Visa Application Form")
  b.title("Visa Application Form", `${clean(app.visaType || "Visa")}  |  ${clean(app.destinationCountry)}`)

  b.section("Applicant details")
  b.fields([
    ["Full name", app.fullName],
    ["Passport number", app.passportNumber],
    ["Passport type", app.passportType],
    ["Date of birth", formatDate(app.dateOfBirth)],
    ["National ID", app.nationalId],
    ["Nationality", app.nationality],
    ["Email", app.email],
    ["Phone", app.phone],
  ])

  b.section("Application details")
  b.fields([
    ["Destination country", app.destinationCountry],
    ["Visa type", app.visaType],
    ["Applying method", app.applyingMethod === "agency" ? "Through an agency" : "Self"],
    ["Travel date", formatDate(app.travelDate)],
    ["Employer", app.employerName],
    ["Agency name", app.agencyName],
    ["Agency country", app.agencyCountry],
    ["Agency reference no.", app.agencyReferenceNo],
  ])

  if (app.visaDetails && Object.keys(app.visaDetails).length > 0) {
    b.section("Visa-specific details")
    const rows: [string, string | undefined][] = Object.entries(app.visaDetails).map(([k, v]) => [
      k.replace(/([A-Z])/g, " $1").replace(/[_-]+/g, " ").replace(/^./, (c) => c.toUpperCase()),
      v,
    ])
    b.fields(rows)
  }

  b.section("Declaration")
  b.paragraph(
    `I, ${clean(app.fullName)}, declare that the information given in this application form is true, complete and ` +
      "correct to the best of my knowledge and belief. I understand that providing false or misleading information " +
      "may result in my application being refused or cancelled.",
  )

  b.signatures(["Applicant signature", "Date", `${AGENCY.name} (agent)`])
  return b.finish()
}
