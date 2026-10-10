import { Builder, clean } from "../pdf-builder"
import type { Application } from "../types"
import { AGENCY } from "./agency-info"

/**
 * TEMPLATE: Client Service Agreement.
 * Agency details come from ./agency-info.ts. Edit the numbered terms below to change the wording.
 * Have the terms reviewed by a qualified professional before relying on them.
 */
export async function buildServiceAgreement(app: Application, opts: { fee?: string } = {}): Promise<Uint8Array> {
  const b = await Builder.create("Service Agreement")
  b.title("Service Agreement", `${clean(app.visaType || "Visa")} application  |  ${clean(app.destinationCountry)}`)

  b.section("Parties")
  b.fields([
    ["Service provider", AGENCY.name],
    ["Registered migration agent", `${AGENCY.agentName}, MARN ${AGENCY.marn}`],
    ["Provider address", AGENCY.address],
    ["Provider contact", AGENCY.contactEmail],
    ["Client", app.fullName],
    ["Client passport number", app.passportNumber],
    ["Client email", app.email],
    ["Client phone", app.phone],
  ])

  b.section("Terms")
  b.numbered(
    1,
    "Scope of services",
    `${AGENCY.name} will assist the client with the ${clean(app.visaType || "visa")} application for ${clean(app.destinationCountry)}, ` +
      "including reviewing documents, preparing and lodging the application, communicating with the relevant authority where permitted, " +
      "and keeping the client informed of progress through the client portal.",
  )
  b.numbered(
    2,
    "Fees and payment",
    `Service fee: ${opts.fee && opts.fee.trim() ? clean(opts.fee) : "as agreed in writing between the parties"}. ` +
      "Government charges, medical examinations, police checks, translations and courier costs are separate and payable by the client unless agreed otherwise in writing.",
  )
  b.numbered(
    3,
    "Client responsibilities",
    "The client will provide true, complete and current information and documents, will tell us promptly about any change in circumstances, and will respond to requests within the time needed to meet deadlines.",
  )
  b.numbered(
    4,
    "No guarantee of outcome",
    `Visa decisions are made solely by the relevant government authority. ${AGENCY.name} cannot guarantee any visa outcome or processing time.`,
  )
  b.numbered(
    5,
    "Confidentiality",
    "We will keep the client's personal information confidential and will only share it where needed to progress the application or where the law requires it.",
  )
  b.numbered(
    6,
    "Ending this agreement",
    "Either party may end this agreement by written notice. Fees for work already completed remain payable. Any refund will be handled under the fee arrangement agreed in writing and applicable law.",
  )
  b.numbered(
    7,
    "Complaints",
    `If you are unhappy with our service, please contact ${AGENCY.contactEmail}. Complaints about a registered migration agent can also be made to the Office of the Migration Agents Registration Authority (OMARA).`,
  )

  b.paragraph("By signing below, both parties agree to these terms.", { bold: true, gap: 2 })
  b.signatures(["Client signature", "Date", "Agent signature"])
  return b.finish()
}
