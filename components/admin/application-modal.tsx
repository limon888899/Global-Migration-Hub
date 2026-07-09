"use client"

import { useState, useRef } from "react"
import { X } from "lucide-react"
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
  const [status, setStatus] = useState(app.manualStatus)
  const [note, setNote] = useState(app.statusNote)
  const [notes, setNotes] = useState(app.internalNotes)
  const fileRef = useRef<HTMLInputElement>(null)

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="font-bold text-lg">{app.fullName}</h3>
          <button onClick={onClose}><X /></button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-blue-50 p-4 rounded">
            <p><strong>Passport:</strong> {app.passportNumber}</p>
            <p><strong>Country:</strong> {app.destinationCountry}</p>
            <p><strong>Visa:</strong> {app.visaType}</p>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value as ManualStatus)} className="w-full border p-2 rounded">
              <option value="auto">Auto</option>
              <option value="0">Submitted</option>
              <option value="1">Processing</option>
              <option value="2">Verified</option>
              <option value="3">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Note</label>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} className="w-full border p-2 rounded" rows={2} />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Documents ({app.documents.length})</label>
            <input ref={fileRef} type="file" multiple className="hidden" onChange={(e) => {
              if(e.target.files) Array.from(e.target.files).forEach(f => onAddDocument(app.id, f.name))
            }} />
            <button onClick={() => fileRef.current?.click()} className="w-full border-2 border-dashed p-4 rounded text-center hover:bg-blue-50">
              Upload Document
            </button>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Notes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full border p-2 rounded" rows={3} />
          </div>
        </div>

        <div className="flex justify-between items-center p-6 border-t bg-gray-50">
          <button onClick={() => { if(confirm("Delete?")) onDelete(app.id) }} className="text-red-600">Delete</button>
          <div className="flex gap-2">
            <button onClick={() => onSaveNotes(app.id, notes)} className="px-4 py-2 border rounded hover:bg-gray-100">Save Notes</button>
            <button onClick={() => onUpdateStatus(app.id, status, note)} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Update</button>
            <button onClick={onClose} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">Close</button>
          </div>
        </div>
      </div>
    </div>
  )
}
