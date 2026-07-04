"use client"

import { useState, useRef } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Application, ManualStatus } from "@/lib/admin/types"

function formatDate(iso: string) {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
}

export function ApplicationModal({
  app,
  onClose,
  onUpdateStatus,
  onSaveNotes,
  onDelete,
  onAddDocument,
}: {
  app: Application
  onClose: () => void
  onUpdateStatus: (id: string, status: ManualStatus, note: string) => void
  onSaveNotes: (id: string, notes: string) => void
  onDelete: (id: string) => void
  onAddDocument: (id: string, name: string) => void
}) {
  const [statusSelect, setStatusSelect] = useState<ManualStatus>(app.manualStatus)
  const [statusNote, setStatusNote] = useState(app.statusNote)
  const [internalNotes, setInternalNotes] = useState(app.internalNotes)
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-card shadow-xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h3 className="font-serif text-lg font-semibold text-foreground">Application Details</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="space-y-6 px-6 py-5">
          <section>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Applicant Information</h4>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              {[
                ["Full Name", app.fullName],
                ["Passport No.", app.passportNumber],
                ["Nationality", app.nationality],
                ["Email", app.email],
                ["Phone", app.phone],
                ["Destination", app.destinationCountry],
                ["Visa Type", app.visaType],
                ["Travel Date", formatDate(app.travelDate)],
                ["Submitted", formatDate(app.submittedAt)],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
                  <dd className="font-medium text-foreground">{value || "—"}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Visa Status</h4>
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={statusSelect}
                onChange={(e) => setStatusSelect(e.target.value as ManualStatus)}
                className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
              >
                <option value="auto">Auto (time-based)</option>
                <option value="0">Submitted</option>
                <option value="1">Processing</option>
                <option value="2">Document Verified</option>
                <option value="3">Visa Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <Button
                type="button"
                onClick={() => onUpdateStatus(app.id, statusSelect, statusNote)}
                className="h-9 px-4 text-sm"
              >
                Update Status
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
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
              />
            </div>
          </section>

          <section>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Uploaded Documents</h4>
            {app.documents.length > 0 ? (
              <ul className="space-y-1.5 text-sm">
                {app.documents.map((doc) => (
                  <li key={doc.id} className="flex items-center justify-between rounded-md border border-border px-3 py-2">
                    <span className="text-foreground">{doc.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {doc.addedBy === "admin" ? "Added by staff" : "From applicant"} · {formatDate(doc.addedAt)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No documents yet.</p>
            )}
            <div className="mt-3 rounded-md border border-dashed border-border p-3">
              <p className="mb-2 text-sm font-medium text-foreground">Add a document on behalf of the applicant</p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,image/*"
                onChange={(e) => {
                  const files = e.target.files
                  if (!files) return
                  Array.from(files).forEach((f) => onAddDocument(app.id, f.name))
                  if (fileInputRef.current) fileInputRef.current.value = ""
                }}
                className="text-sm text-muted-foreground"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Demo mode: only the file name is stored, not the file itself.
              </p>
            </div>
          </section>

          <section>
            <h4 className="mb-1.5 text-sm font-semibold text-foreground">Internal Admin Notes</h4>
            <p className="mb-2 text-xs text-muted-foreground">Private — never shown to the applicant.</p>
            <textarea
              rows={3}
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              placeholder="Internal remarks for staff only"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
            />
          </section>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-border px-6 py-4">
          <button
            type="button"
            onClick={() => {
              if (confirm("Delete this entire application? This cannot be undone.")) onDelete(app.id)
            }}
            className="text-sm font-medium text-destructive hover:underline"
          >
            Delete Entire Application
          </button>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => onSaveNotes(app.id, internalNotes)} className="h-9 px-4 text-sm">
              Save Notes
            </Button>
            <Button type="button" onClick={onClose} className="h-9 px-4 text-sm">
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
