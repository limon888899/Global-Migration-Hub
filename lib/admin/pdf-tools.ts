"use client"

import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFImage, type PDFPage } from "pdf-lib"
import { stageLabel, type Application } from "./types"
import { SLOT_NAMES, VISA_DOCUMENT_SLOTS } from "./document-slots"

/**
 * Browser-side PDF helpers for Admin → Documents.
 *
 * What lives here:
 *  - the agency's OWN documents (application form, service agreement, document checklist)
 *  - combining the uploaded files of an application into one multi-page PDF
 *
 * Official documents (visa grant, police clearance, medical report, ...) are never
 * generated — they are uploaded as the original files issued by the authority.
 *
 * Optional branding, if the files exist in /public:
 *  - /templates/letterhead.png  → drawn as a full-page background on every page
 *  - /favicon-192x192.png       → small logo in the default header
 */

const PAGE_W = 595.28
const PAGE_H = 841.89
const MARGIN = 48
const INK = rgb(0.09, 0.09, 0.13)
const MUTED = rgb(0.42, 0.42, 0.48)
const BRAND = rgb(0.13, 0.09, 0.21)
const LINE = rgb(0.86, 0.86, 0.89)

// Standard PDF fonts only support Latin characters — anything else is replaced with "?".
const clean = (s: unknown) =>
  String(s ?? "")
    .replace(/[\r\n\t]+/g, " ")
    .replace(/[^\x20-\x7E\u00A0-\u00FF]/g, "?")
    .trim()

async function fetchBytes(url: string): Promise<Uint8Array | null> {
  try {
    const res = await fetch(url)
    if (!res.ok) return null
    const type = res.headers.get("content-type") ?? ""
    if (type.includes("text/html")) return null
    return new Uint8Array(await res.arrayBuffer())
  } catch {
    return null
  }
}

async function embedAny(pdf: PDFDocument, bytes: Uint8Array): Promise<PDFImage | null> {
  try {
    if (bytes[0] === 0x89 && bytes[1] === 0x50) return await pdf.embedPng(bytes)
    if (bytes[0] === 0xff && bytes[1] === 0xd8) return await pdf.embedJpg(bytes)
  } catch {
    // fall through
  }
  return null
}

function formatDate(value?: string) {
  if (!value) return "-"
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return clean(value)
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
}

function humanizeKey(key: string) {
  const spaced = key.replace(/([A-Z])/g, " $1").replace(/[_-]+/g, " ").trim()
  return spaced.charAt(0).toUpperCase() + spaced.slice(1)
}

class Builder {
  pdf!: PDFDocument
  font!: PDFFont
  bold!: PDFFont
  page!: PDFPage
  y = 0
  top = 0
  bottom = 60
  letterhead: PDFImage | null = null
  logo: PDFImage | null = null

  static async create(title: string) {
    const b = new Builder()
    b.pdf = await PDFDocument.create()
    b.pdf.setTitle(title)
    b.pdf.setProducer("Global Migration Hub")
    b.font = await b.pdf.embedFont(StandardFonts.Helvetica)
    b.bold = await b.pdf.embedFont(StandardFonts.HelveticaBold)

    const lh = await fetchBytes("/templates/letterhead.png")
    if (lh) b.letterhead = await embedAny(b.pdf, lh)
    if (!b.letterhead) {
      const logo = await fetchBytes("/favicon-192x192.png")
      if (logo) b.logo = await embedAny(b.pdf, logo)
    }
    b.newPage()
    return b
  }

  newPage() {
    this.page = this.pdf.addPage([PAGE_W, PAGE_H])
    if (this.letterhead) {
      this.page.drawImage(this.letterhead, { x: 0, y: 0, width: PAGE_W, height: PAGE_H })
      this.y = PAGE_H - 140
      this.bottom = 90
      return
    }
    const headerTop = PAGE_H - MARGIN
    let textX = MARGIN
    if (this.logo) {
      this.page.drawImage(this.logo, { x: MARGIN, y: headerTop - 34, width: 34, height: 34 })
      textX = MARGIN + 44
    }
    this.page.drawText("Global Migration Hub", { x: textX, y: headerTop - 15, size: 14, font: this.bold, color: BRAND })
    this.page.drawText("Registered Migration Agent  |  MARN 1069227", {
      x: textX,
      y: headerTop - 29,
      size: 8.5,
      font: this.font,
      color: MUTED,
    })
    this.page.drawLine({
      start: { x: MARGIN, y: headerTop - 44 },
      end: { x: PAGE_W - MARGIN, y: headerTop - 44 },
      thickness: 0.8,
      color: LINE,
    })
    this.y = headerTop - 72
    this.bottom = 60
  }

  ensure(height: number) {
    if (this.y - height < this.bottom) this.newPage()
  }

  wrap(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
    const words = clean(text).split(" ").filter(Boolean)
    const lines: string[] = []
    let line = ""
    for (const word of words) {
      const test = line ? `${line} ${word}` : word
      if (font.widthOfTextAtSize(test, size) <= maxWidth) {
        line = test
        continue
      }
      if (line) lines.push(line)
      let rest = word
      while (font.widthOfTextAtSize(rest, size) > maxWidth && rest.length > 1) {
        let cut = rest.length - 1
        while (cut > 1 && font.widthOfTextAtSize(rest.slice(0, cut), size) > maxWidth) cut--
        lines.push(rest.slice(0, cut))
        rest = rest.slice(cut)
      }
      line = rest
    }
    if (line) lines.push(line)
    return lines.length ? lines : [""]
  }

  title(text: string, sub?: string) {
    this.ensure(60)
    this.page.drawText(clean(text), { x: MARGIN, y: this.y, size: 20, font: this.bold, color: BRAND })
    this.y -= 20
    if (sub) {
      this.page.drawText(clean(sub), { x: MARGIN, y: this.y, size: 10, font: this.font, color: MUTED })
      this.y -= 14
    }
    this.y -= 10
  }

  section(text: string) {
    this.ensure(46)
    this.y -= 6
    this.page.drawText(clean(text).toUpperCase(), { x: MARGIN, y: this.y, size: 10, font: this.bold, color: BRAND })
    this.y -= 6
    this.page.drawLine({
      start: { x: MARGIN, y: this.y },
      end: { x: PAGE_W - MARGIN, y: this.y },
      thickness: 0.6,
      color: LINE,
    })
    this.y -= 16
  }

  fields(rows: [string, string | undefined][]) {
    const gap = 18
    const colW = (PAGE_W - MARGIN * 2 - gap) / 2
    for (let i = 0; i < rows.length; i += 2) {
      const pair = rows.slice(i, i + 2)
      const wrapped = pair.map(([, v]) => this.wrap(v && clean(v) ? v : "-", this.font, 10.5, colW).slice(0, 3))
      const maxLines = Math.max(...wrapped.map((w) => w.length))
      const height = 12 + maxLines * 13 + 8
      this.ensure(height)
      pair.forEach(([label], c) => {
        const x = MARGIN + c * (colW + gap)
        this.page.drawText(clean(label).toUpperCase(), { x, y: this.y, size: 7.5, font: this.bold, color: MUTED })
        wrapped[c].forEach((ln, li) => {
          this.page.drawText(ln, { x, y: this.y - 13 - li * 13, size: 10.5, font: this.font, color: INK })
        })
      })
      this.y -= height
    }
  }

  paragraph(text: string, opts: { size?: number; bold?: boolean; indent?: number; gap?: number; color?: ReturnType<typeof rgb> } = {}) {
    const size = opts.size ?? 10
    const indent = opts.indent ?? 0
    const font = opts.bold ? this.bold : this.font
    const lines = this.wrap(text, font, size, PAGE_W - MARGIN * 2 - indent)
    const lineH = size * 1.45
    for (const ln of lines) {
      this.ensure(lineH + 2)
      this.page.drawText(ln, { x: MARGIN + indent, y: this.y, size, font, color: opts.color ?? INK })
      this.y -= lineH
    }
    this.y -= opts.gap ?? 6
  }

  numbered(n: number, heading: string, body: string) {
    this.ensure(40)
    this.page.drawText(`${n}.  ${clean(heading)}`, { x: MARGIN, y: this.y, size: 10.5, font: this.bold, color: BRAND })
    this.y -= 15
    this.paragraph(body, { indent: 16, gap: 8 })
  }

  checkRow(label: string, status: string, done: boolean) {
    this.ensure(26)
    this.page.drawRectangle({
      x: MARGIN,
      y: this.y - 3,
      width: 11,
      height: 11,
      borderColor: done ? rgb(0.1, 0.55, 0.3) : MUTED,
      borderWidth: 1,
      color: done ? rgb(0.88, 0.97, 0.91) : undefined,
    })
    if (done) {
      this.page.drawText("x", { x: MARGIN + 2.8, y: this.y - 1, size: 9, font: this.bold, color: rgb(0.1, 0.55, 0.3) })
    }
    this.page.drawText(clean(label), { x: MARGIN + 20, y: this.y, size: 10.5, font: this.font, color: INK })
    const w = this.bold.widthOfTextAtSize(status, 9)
    this.page.drawText(status, {
      x: PAGE_W - MARGIN - w,
      y: this.y,
      size: 9,
      font: this.bold,
      color: done ? rgb(0.1, 0.55, 0.3) : rgb(0.7, 0.45, 0.05),
    })
    this.y -= 14
    this.page.drawLine({
      start: { x: MARGIN, y: this.y },
      end: { x: PAGE_W - MARGIN, y: this.y },
      thickness: 0.4,
      color: LINE,
    })
    this.y -= 12
  }

  signatures(labels: string[]) {
    this.ensure(70)
    this.y -= 30
    const gap = 24
    const w = (PAGE_W - MARGIN * 2 - gap * (labels.length - 1)) / labels.length
    labels.forEach((label, i) => {
      const x = MARGIN + i * (w + gap)
      this.page.drawLine({ start: { x, y: this.y }, end: { x: x + w, y: this.y }, thickness: 0.8, color: INK })
      this.page.drawText(clean(label), { x, y: this.y - 12, size: 8.5, font: this.font, color: MUTED })
    })
    this.y -= 30
  }

  async finish(): Promise<Uint8Array> {
    const pages = this.pdf.getPages()
    const stamp = `Generated ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`
    pages.forEach((p, i) => {
      const label = `Page ${i + 1} of ${pages.length}`
      const w = this.font.widthOfTextAtSize(label, 8)
      p.drawText(stamp, { x: MARGIN, y: 30, size: 8, font: this.font, color: MUTED })
      p.drawText(label, { x: PAGE_W - MARGIN - w, y: 30, size: 8, font: this.font, color: MUTED })
    })
    return await this.pdf.save()
  }
}

// ---------------------------------------------------------------------------
// Agency documents
// ---------------------------------------------------------------------------

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

export async function buildServiceAgreement(app: Application, opts: { fee?: string } = {}): Promise<Uint8Array> {
  const b = await Builder.create("Service Agreement")
  b.title("Service Agreement", `${clean(app.visaType || "Visa")} application  |  ${clean(app.destinationCountry)}`)

  b.section("Parties")
  b.fields([
    ["Service provider", "Global Migration Hub"],
    ["Registered migration agent", "Andrew John Kerr, MARN 1069227"],
    ["Provider address", "Level 15, 100 Queen Street, Melbourne, VIC 3000, Australia"],
    ["Provider contact", "info@globalmigrationhub.com"],
    ["Client", app.fullName],
    ["Client passport number", app.passportNumber],
    ["Client email", app.email],
    ["Client phone", app.phone],
  ])

  b.section("Terms")
  b.numbered(
    1,
    "Scope of services",
    `Global Migration Hub will assist the client with the ${clean(app.visaType || "visa")} application for ${clean(app.destinationCountry)}, ` +
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
    "Visa decisions are made solely by the relevant government authority. Global Migration Hub cannot guarantee any visa outcome or processing time.",
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
    "If you are unhappy with our service, please contact info@globalmigrationhub.com. Complaints about a registered migration agent can also be made to the Office of the Migration Agents Registration Authority (OMARA).",
  )

  b.paragraph("By signing below, both parties agree to these terms.", { bold: true, gap: 2 })
  b.signatures(["Client signature", "Date", "Agent signature"])
  return b.finish()
}

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
      `${missing} item${missing === 1 ? " is" : "s are"} still pending. Please send any documents that are waiting on you to support@globalmigrationhub.com, or reply to your advisor.`,
    )
  } else {
    b.paragraph("All listed documents have been received.")
  }
  return b.finish()
}

// ---------------------------------------------------------------------------
// Combine uploaded files (PDFs + images) into one PDF
// ---------------------------------------------------------------------------

async function imageToJpeg(bytes: Uint8Array): Promise<{ data: Uint8Array; w: number; h: number }> {
  const bitmap = await createImageBitmap(new Blob([bytes as BlobPart]))
  const scale = Math.min(1, 1800 / Math.max(bitmap.width, bitmap.height))
  const w = Math.max(1, Math.round(bitmap.width * scale))
  const h = Math.max(1, Math.round(bitmap.height * scale))
  const canvas = document.createElement("canvas")
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Canvas not available")
  ctx.fillStyle = "#ffffff"
  ctx.fillRect(0, 0, w, h)
  ctx.drawImage(bitmap, 0, 0, w, h)
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.8))
  if (!blob) throw new Error("Could not encode image")
  return { data: new Uint8Array(await blob.arrayBuffer()), w, h }
}

export async function combineDocuments(
  app: Application,
): Promise<{ bytes: Uint8Array; files: number; pages: number; skipped: string[] }> {
  const docs = (app.documents ?? []).filter((d) => d.dataUrl)
  const order = (d: (typeof docs)[number]) => {
    const i = SLOT_NAMES.indexOf(d.groupName?.trim())
    return i === -1 ? SLOT_NAMES.length : i
  }
  // Skip previously combined files so they don't get merged into themselves.
  const sorted = docs
    .filter((d) => d.groupName?.trim() !== "Combined Documents")
    .sort((a, b) => order(a) - order(b))
  if (sorted.length === 0) throw new Error("There are no uploaded files to combine yet.")

  const out = await PDFDocument.create()
  out.setTitle(`Combined documents - ${clean(app.fullName)}`)
  out.setProducer("Global Migration Hub")
  const skipped: string[] = []
  let files = 0

  for (const doc of sorted) {
    const url = doc.dataUrl as string
    const bytes = await fetchBytes(url)
    if (!bytes) {
      skipped.push(doc.name)
      continue
    }
    try {
      const isPdf = /\.pdf(\?.*)?$/i.test(url) || /\.pdf$/i.test(doc.name) || (bytes[0] === 0x25 && bytes[1] === 0x50)
      if (isPdf) {
        const src = await PDFDocument.load(bytes, { ignoreEncryption: true })
        const copied = await out.copyPages(src, src.getPageIndices())
        copied.forEach((p) => out.addPage(p))
      } else {
        const { data, w, h } = await imageToJpeg(bytes)
        const img = await out.embedJpg(data)
        const page = out.addPage([PAGE_W, PAGE_H])
        const pad = 24
        const ratio = Math.min((PAGE_W - pad * 2) / w, (PAGE_H - pad * 2) / h)
        const dw = w * ratio
        const dh = h * ratio
        page.drawImage(img, { x: (PAGE_W - dw) / 2, y: (PAGE_H - dh) / 2, width: dw, height: dh })
      }
      files++
    } catch {
      skipped.push(doc.name)
    }
  }

  if (files === 0) throw new Error("None of the uploaded files could be read. Check that they are PDFs or images.")
  return { bytes: await out.save(), files, pages: out.getPageCount(), skipped }
}

// ---------------------------------------------------------------------------
// Download helpers
// ---------------------------------------------------------------------------

export function safeFileName(value: string) {
  return clean(value).replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "applicant"
}

export function downloadBytes(bytes: Uint8Array, filename: string) {
  const blob = new Blob([bytes as BlobPart], { type: "application/pdf" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 2000)
}

export async function downloadFromUrl(url: string, filename: string) {
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error("fetch failed")
    const blob = await res.blob()
    const objectUrl = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = objectUrl
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    setTimeout(() => URL.revokeObjectURL(objectUrl), 2000)
  } catch {
    window.open(url, "_blank", "noopener,noreferrer")
  }
}
