import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFImage, type PDFPage } from "pdf-lib"
import { AGENCY } from "./templates/agency-info"

/**
 * Shared PDF drawing engine (page layout, header, fields, paragraphs, signatures, footer).
 * The document designs themselves live in ./templates/ — one file per document.
 *
 * Standard PDF fonts only support Latin characters, so anything else becomes "?" (see clean()).
 */

export const PAGE_W = 595.28
export const PAGE_H = 841.89
export const MARGIN = 48
const INK = rgb(0.09, 0.09, 0.13)
const MUTED = rgb(0.42, 0.42, 0.48)
const BRAND = rgb(0.13, 0.09, 0.21)
const LINE = rgb(0.86, 0.86, 0.89)

// Standard PDF fonts only support Latin characters — anything else is replaced with "?".
export const clean = (s: unknown) =>
  String(s ?? "")
    .replace(/[\r\n\t]+/g, " ")
    .replace(/[^\x20-\x7E\u00A0-\u00FF]/g, "?")
    .trim()

export async function fetchBytes(url: string): Promise<Uint8Array | null> {
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

export function formatDate(value?: string) {
  if (!value) return "-"
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return clean(value)
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
}

export function humanizeKey(key: string) {
  const spaced = key.replace(/([A-Z])/g, " $1").replace(/[_-]+/g, " ").trim()
  return spaced.charAt(0).toUpperCase() + spaced.slice(1)
}

export class Builder {
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
    b.pdf.setProducer(AGENCY.name)
    b.font = await b.pdf.embedFont(StandardFonts.Helvetica)
    b.bold = await b.pdf.embedFont(StandardFonts.HelveticaBold)

    const lh = await fetchBytes(AGENCY.letterheadPath)
    if (lh) b.letterhead = await embedAny(b.pdf, lh)
    if (!b.letterhead) {
      const logo = await fetchBytes(AGENCY.logoPath)
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
    this.page.drawText(AGENCY.name, { x: textX, y: headerTop - 15, size: 14, font: this.bold, color: BRAND })
    this.page.drawText(`${AGENCY.registrationTitle}  |  MARN ${AGENCY.marn}`, {
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

