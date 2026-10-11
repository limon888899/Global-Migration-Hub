"use client"

import { PDFDocument } from "pdf-lib"
import type { Application } from "./types"
import { SLOT_NAMES } from "./document-slots"
import { AGENCY } from "./templates"
import { PAGE_W, PAGE_H, clean, fetchBytes } from "./pdf-builder"

/**
 * Browser-side PDF helpers for Admin -> Documents.
 *
 * - The agency's OWN documents (application form, service agreement, checklist) are designed in
 *   ./templates/ (one file per document) and drawn by ./pdf-builder.ts. They are re-exported here
 *   so existing imports from "@/lib/admin/pdf-tools" keep working.
 * - This file also combines the uploaded files of an application into one multi-page PDF.
 *
 * Official documents (visa grant, police clearance, medical report, ...) are never generated —
 * they are uploaded as the original files issued by the authority.
 */

export { buildAgencyDraft, buildApplicationForm, buildServiceAgreement, buildChecklist } from "./templates"

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
  out.setProducer(AGENCY.name)
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
