import { Builder, clean } from "../pdf-builder"
import { VISA_DOCUMENT_SLOTS } from "../document-slots"
import type { Application } from "../types"
import { AGENCY } from "./agency-info"

/**
 * TEMPLATE: Document Checklist.
 * Lists every document slot and whether the file has been received.
 */
export async function buildChecklist(app: Application): Promise<Uint8Array> {
  const b = await Builder.create("Document Checklist")
  b.title("Document Checklist", `${clean(app.fullName)}  |  ${clean(app.visaType || "Visa")}  |  ${clean(app.destinationCountry)}`)

  const received = new Set((app.documents ?? []).filter((d) => d.dataUrl).map((d) => d.groupName?.trim()))
  b.section("Document status")
  let missing = 0
  for (const slot of VISA_DOCUMENT_SLOTS) {
    const done = received.has(slot.name)
    if (!done) missing++
    b.checkRow(slot.name, done ? "Received" : "Pending", done)
  }

  b.y -= 4
  if (missing > 0) {
    b.paragraph(
      `${missing} item${missing === 1 ? " is" : "s are"} still pending. Please send any documents that are waiting on you to ${AGENCY.supportEmail}, or reply to your advisor.`,
    )
  } else {
    b.paragraph("All listed documents have been received.")
  }
  return b.finish()
}
