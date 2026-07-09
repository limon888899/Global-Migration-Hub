cat > components/admin/application-modal.tsx << 'EOF'
"use client"

import { useState, useRef } from "react"
import { X, Upload, FileText, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Application, ManualStatus } from "@/lib/admin/types"

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
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-lg">
        
        <div className="flex items-center justify-between border-b px-6 py-4 sticky top-0 bg-white">
          <h3 className="font-bold text-lg">Application: {app.passportNumber}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-6">
          
          <section className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h4 className="text-sm font-semibold mb-4">Applicant Info</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-600 font-medium">Name</p>
                <p className="text-sm font-bold mt-1">{app.fullName}</p>
              </div>
              <div>
                <p className="text-xs text-slate-600 font-medium">Passport</p>
                <p className="text-sm font-bold mt-1">{app.passportNumber}</p>
              </div>
              <div>
                <p className="text-xs text-slate-600 font-medium">Country</p>
                <p className="text-sm font-bold mt-1">{app.destinationCountry}</p>
              </div>
              <div>
                <p className="text-xs text-slate-600 font-medium">Visa Type</p>
                <p className="text-sm font-bold mt-1">{app.visaType}</p>
              </div>
            </div>
          </section>

          <section className="border rounded-lg p-4">
            <h4 className="text-sm font-semibold mb-4">Update Status</h4>
            <div className="space-y-3">
              <select
                value={statusSelect}
                onChange={(e) => setStatusSelect(e.target.value as ManualStatus)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="auto">Auto</option>
                <option value="0">Submitted</option>
                <option value="1">Processing</option>
                <option value="2">Verified</option>
                <option value="3">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <textarea
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                placeholder="Note..."
                rows={2}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <Button
                onClick={() => onUpdateStatus(app.id, statusSelect, statusNote)}
                className="w-full bg-blue-600 text-white"
              >
                Update Status
              </Button>
            </div>
          </section>

          <section className="border rounded-lg p-4">
            <h4 className="text-sm font-semibold mb-4">Documents</h4>
            
            {app.documents.length > 0 && (
              <div className="mb-4 space-y-2">
                {app.documents.map((doc) => (
                  <div key={doc.id} className="flex items-center gap-2 p-2 bg-slate-50 rounded">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">{doc.name}</span>
                  </div>
                ))}
              </div>
            )}

            <div
              className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-blue-50"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={(e) => {
                  if (e.currentTarget.files) {
                    Array.from(e.currentTarget.files).forEach((file) => {
                      onAddDocument(app.id, file.name)
                    })
                  }
                }}
                className="hidden"
              />
              <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
              <p className="font-medium">Upload Document</p>
            </div>
          </section>

          <section className="border rounded-lg p-4">
            <h4 className="text-sm font-semibold mb-2">Internal Notes</h4>
            <textarea
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              placeholder="Private notes..."
              rows={4}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </section>
        </div>

        <div className="flex items-center justify-between gap-3 border-t px-6 py-4 bg-slate-50">
          <button
            onClick={() => {
              if (confirm("Delete this application?")) {
                onDelete(app.id)
              }
            }}
            className="text-sm text-red-600 hover:bg-red-50 px-3 py-2 rounded"
          >
            Delete
          </button>
          <div className="flex gap-2">
            <Button
              onClick={() => onSaveNotes(app.id, internalNotes)}
              variant="outline"
            >
              Save Notes
            </Button>
            <Button onClick={onClose} className="bg-blue-600">
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
EOF
