"use client"

import { useState, useRef } from "react"
import { X, Pencil, Trash2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DOCUMENT_CATEGORY_LABELS,
  effectiveStage,
  stageLabel,
  type Application,
  type DocumentCategory,
  type ManualStatus,
} from "@/lib/admin/types"

const MAX_FILE_BYTES = 800 * 1024

function formatDate(iso: string) {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
}

function toDateTimeLocalValue(iso: string) {
  if (!iso) return ""
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ""
  const offsetMs = d.getTimezoneOffset() * 60000
  return new Date(d.getTime() - offsetMs).toISOString().slice(0, 16)
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error("Could not read file"))
    reader.readAsDataURL(file)
  })
}

function stagePillClass(app: Application) {
  const stage = effectiveStage(app)
  if (stage === "rejected") return "bg-destructive/10 text-destructive"
  if (stage === 3) return "bg-tip-green text-tip-green-foreground"
  if (stage === 0) return "bg-muted text-muted-foreground"
  return "bg-tip-yellow text-tip-yellow-foreground"
}

const DOC_CATEGORIES: { key: DocumentCategory; label: string }[] = [
  { key: "passport_copy", label: "Passport Copy" },
  { key: "job_letter", label: "Job Letter" },
  { key: "medical_certificate", label: "Medical Certificate" },
  { key: "fingerprint", label: "Fingerprint Form" },
  { key: "other", label: "Other Document" },
]

export function ApplicationModal({
  app,
  onClose,
  onUpdateStatus,
  onSaveNotes,
  onDelete,
  onAddDocument,
  onUpdateSubmittedAt,
}: {
  app: Application
  onClose: () => void
  onUpdateStatus: (id: string, status: ManualStatus, note: string) => void
  onSaveNotes: (id: string, notes: string) => void
  onDelete: (id: string) => void
  onAddDocument: (id: string, doc: { name: string; dataUrl?: string; category?: DocumentCategory }) => void
  onUpdateSubmittedAt: (id: string, submittedAt: string) => void
}) {
  const [statusSelect, setStatusSelect] = useState<ManualStatus>(app.manualStatus)
  const [statusNote, setStatusNote] = useState(app.statusNote)
  const [internalNotes, setInternalNotes] = useState(app.internalNotes)
  const [submittedInput, setSubmittedInput] = useState(toDateTimeLocalValue(app.submittedAt))
  const [dateSaved, setDateSaved] = useState(false)
  const [statusSaved, setStatusSaved] = useState(false)
  const [uploadCategory, setUploadCategory] = useState<DocumentCategory>("passport_copy")
  const [uploadError, setUploadError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleSaveSubmittedDate() {
    if (!submittedInput) return
    const iso = new Date(submittedInput).toISOString()
    onUpdateSubmittedAt(app.id, iso)
    setDateSaved(true)
    setTimeout(() => setDateSaved(false), 1500)
  }

  function handleUpdateStatusClick() {
    onUpdateStatus(app.id, statusSelect, statusNote)
    setStatusSaved(true)
    setTimeout(() => setStatusSaved(false), 1500)
  }

  async function handleFilesSelected(files: FileList | null) {
    if (!files || files.length === 0) return
    setUploadError("")
    for (const file of Array.from(files)) {
      if (file.size > MAX_FILE_BYTES) {
        setUploadError(`"${file.name}" is too large. Please use files under 800 KB.`)
        continue
      }
      try {
        const dataUrl = await readFileAsDataUrl(file)
        onAddDocument(app.id, { name: file.name, dataUrl, category: uploadCategory })
      } catch {
        setUploadError(`Could not read "${file.name}". Please try again.`)
      }
    }
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in-0 duration-200">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-card shadow-xl animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 duration-300">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h3 className="font-serif text-lg font-semibold text-foreground">Application Details</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="space-y-6 px-6 py-5">
          {/* Ref-style highlight card */}
          <section className="rounded-2xl bg-gradient-to-br from-tip-peach via-tip-yellow to-tip-green p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="font-serif text-lg font-semibold text-foreground">
                  Ref: {app.passportNumber || "—"}
                </div>
                <div className="text-sm text-muted-foreground">
                  {app.visaType || "Visa"} Application · {app.destinationCountry}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
                  onClick={() => document.getElementById("submittedAtInput")?.focus()}
                >
                  <Pencil className="size-3.5" /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Delete this entire application? This cannot be undone.")) onDelete(app.id)
                  }}
                  className="flex items-center gap-1.5 rounded-full border border-destructive/30 bg-card px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="size-3.5" /> Delete
                </button>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">Stage</span>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${stagePillClass(app)}`}>
                {stageLabel(app)}
              </span>
            </div>

            <div className="mt-4 rounded-xl bg-card/70 p-4 text-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-muted">
                  {app.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={app.photoUrl} alt={app.fullName} className="size-full object-cover" />
                  ) : (
                    <span className="text-[10px] text-muted-foreground">No photo</span>
                  )}
                </div>
                <dl className="grid flex-1 grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  {[
                    ["Full Name", app.fullName],
                    ["Passport No.", app.passportNumber],
                    ["Nationality", app.nationality],
                    ["Email", app.email],
                    ["Phone", app.phone],
                    ["Travel Date", formatDate(app.travelDate)],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
                      <dd className="font-medium text-foreground">{value || "—"}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-dashed border-border p-4">
            <label htmlFor="submittedAtInput" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Submitted Date (editable)
            </label>
            <div className="flex flex-wrap items-center gap-2">
              <input
                id="submittedAtInput"
                type="datetime-local"
                value={submittedInput}
                onChange={(e) => setSubmittedInput(e.target.value)}
                className="rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              />
              <Button type="button" onClick={handleSaveSubmittedDate} className="h-9 rounded-xl px-4 text-sm">
                {dateSaved ? "Saved ✓" : "Save Date"}
              </Button>
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground">
              Currently showing on the applicant&apos;s profile as: {formatDate(app.submittedAt)}
            </p>
          </section>

          <section className="rounded-2xl border border-border p-4">
            <h4 className="mb-3 text-sm font-semibold text-foreground">Visa Status</h4>
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={statusSelect}
                onChange={(e) => setStatusSelect(e.target.value as ManualStatus)}
                className="rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground"
              >
                <option value="auto">Auto (time-based)</option>
                <option value="0">Submitted</option>
                <option value="1">Processing</option>
                <option value="2">Document Verified</option>
                <option value="3">Visa Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <Button type="button" onClick={handleUpdateStatusClick} className="h-9 rounded-xl px-4 text-sm">
                {statusSaved ? "Updated ✓" : "Update Status"}
              </Button>
            </div>
            <div className="mt-3">
              <label htmlFor="miStatusNote" className="mb-1.5 block text-sm font-medium text-foreground">
                Note shown to applicant (only visible if status is Rejected)
              </label>
              <textarea
                id="miStatusNote"
                rows={2}
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                placeholder="e.g. Missing bank statement — please resubmit with updated documents."
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground"
              />
            </div>
          </section>

          <section className="rounded-2xl border border-border p-4">
            <h4 className="mb-3 text-sm font-semibold text-foreground">Uploaded Documents</h4>
            {app.documents.length > 0 ? (
              <ul className="space-y-1.5 text-sm">
                {app.documents.map((doc) => (
                  <li key={doc.id} className="flex items-center justify-between rounded-xl border border-border px-3 py-2">
                    <span className="text-foreground">
                      {doc.category ? `${DOCUMENT_CATEGORY_LABELS[doc.category]} — ` : ""}
                      {doc.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {doc.addedBy === "admin" ? "Added by staff" : "From applicant"} · {formatDate(doc.addedAt)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No documents yet.</p>
            )}

            <div className="mt-3 rounded-xl border border-dashed border-border p-3">
              <p className="mb-2 text-sm font-medium text-foreground">Add a document on behalf of the applicant</p>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <label htmlFor="uploadCategory" className="text-xs font-medium text-muted-foreground">
                  Document type:
                </label>
                <select
                  id="uploadCategory"
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value as DocumentCategory)}
                  className="rounded-lg border border-input bg-background px-2 py-1.5 text-xs text-foreground"
                >
                  {DOC_CATEGORIES.map((c) => (
                    <option key={c.key} value={c.key}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground hover:bg-muted">
                <Upload className="size-4" />
                Choose file(s)
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,image/*"
                  className="hidden"
                  onChange={(e) => handleFilesSelected(e.target.files)}
                />
              </label>
              {uploadError && <p className="mt-2 text-xs text-destructive">{uploadError}</p>}
              <p className="mt-1 text-xs text-muted-foreground">
                Max 800 KB per file. The actual file is stored so it shows correctly on the applicant&apos;s status page.
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-border p-4">
            <h4 className="mb-1.5 text-sm font-semibold text-foreground">Internal Admin Notes</h4>
            <p className="mb-2 text-xs text-muted-foreground">Private — never shown to the applicant.</p>
            <textarea
              rows={3}
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              placeholder="Internal remarks for staff only"
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground"
            />
          </section>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-border px-6 py-4">
          <Button type="button" variant="outline" onClick={() => onSaveNotes(app.id, internalNotes)} className="h-9 rounded-xl px-4 text-sm">
            Save Notes
          </Button>
          <Button type="button" onClick={onClose} className="h-9 rounded-xl px-4 text-sm">
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}
