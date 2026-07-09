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
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (files: FileList | null) => {
    if (!files) return
    
    setUploading(true)
    try {
      Array.from(files).forEach((file) => {
        onAddDocument(app.id, file.name)
      })
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 sticky top-0 bg-white">
          <div>
            <h3 className="font-bold text-lg text-slate-900">Application Details</h3>
            <p className="text-xs text-slate-500 mt-1">Ref: {app.passportNumber}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 space-y-6">
          
          {/* Applicant Info Card */}
          <section className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200">
            <h4 className="text-sm font-semibold text-slate-900 mb-4">📋 Applicant Information</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-slate-600 font-medium">Full Name</p>
                <p className="text-sm font-semibold text-slate-900 mt-1">{app.fullName}</p>
              </div>
              <div>
                <p className="text-xs text-slate-600 font-medium">Passport No.</p>
                <p className="text-sm font-semibold text-slate-900 mt-1">{app.passportNumber}</p>
              </div>
              <div>
                <p className="text-xs text-slate-600 font-medium">Nationality</p>
                <p className="text-sm font-semibold text-slate-900 mt-1">{app.nationality}</p>
              </div>
              <div>
                <p className="text-xs text-slate-600 font-medium">Destination</p>
                <p className="text-sm font-semibold text-slate-900 mt-1">{app.destinationCountry}</p>
              </div>
              <div>
                <p className="text-xs text-slate-600 font-medium">Email</p>
                <p className="text-sm font-semibold text-slate-900 mt-1 truncate">{app.email}</p>
              </div>
              <div>
                <p className="text-xs text-slate-600 font-medium">Phone</p>
                <p className="text-sm font-semibold text-slate-900 mt-1">{app.phone}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-xs text-slate-600 font-medium">Visa Type</p>
                <p className="text-sm font-semibold text-slate-900 mt-1">{app.visaType}</p>
              </div>
            </div>
          </section>

          {/* Status Update Section */}
          <section className="border border-slate-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-4">🎯 Update Visa Status</h4>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-600">Current Status</label>
                <select
                  value={statusSelect}
                  onChange={(e) => setStatusSelect(e.target.value as ManualStatus)}
                  className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="auto">Auto (time-based)</option>
                  <option value="0">Submitted</option>
                  <option value="1">Processing</option>
                  <option value="2">Document Verified</option>
                  <option value="3">Visa Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600">Note (shown if Rejected)</label>
                <textarea
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="e.g., Missing bank statement - please resubmit"
                  rows={3}
                  className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                />
              </div>
              <Button
                onClick={() => onUpdateStatus(app.id, statusSelect, statusNote)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                💾 Update Status
              </Button>
            </div>
          </section>

          {/* Documents Section */}
          <section className="border border-slate-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-4">📄 Documents</h4>
            
            {/* Uploaded Documents List */}
            {app.documents.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-slate-600 font-medium mb-2">Uploaded Documents:</p>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {app.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center gap-3 p-2 bg-slate-50 rounded border border-slate-200 text-sm"
                    >
                      <FileText className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 truncate">{doc.name}</p>
                        <p className="text-xs text-slate-500">
                          {doc.addedBy === "admin" ? "Added by staff" : "From applicant"} • {new Date(doc.addedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Area */}
            <div
              className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center hover:border-blue-400 hover:bg-blue-50 transition cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                onChange={(e) => handleFileUpload(e.currentTarget.files)}
                className="hidden"
              />
              <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
              <p className="font-medium text-slate-900 text-sm">Upload Documents</p>
              <p className="text-xs text-slate-500 mt-1">PDF, Images, or Office files</p>
              {uploading && <p className="text-xs text-blue-600 mt-2">Uploading...</p>}
            </div>
          </section>

          {/* Internal Notes */}
          <section className="border border-slate-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-2">🔒 Internal Notes</h4>
            <p className="text-xs text-slate-500 mb-3 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> Private - never shown to applicant
            </p>
            <textarea
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              placeholder="Add internal notes for staff..."
              rows={4}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
            />
          </section>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 border-t border-slate-200 px-6 py-4 bg-slate-50 sticky bottom-0">
          <button
            onClick={() => {
              if (confirm("🗑️ Delete this application? This cannot be undone.")) {
                onDelete(app.id)
                onClose()
              }
            }}
            className="px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded transition"
          >
            Delete
          </button>
          <div className="flex gap-2">
            <Button
              onClick={() => onSaveNotes(app.id, internalNotes)}
              variant="outline"
              className="px-4"
            >
              Save Notes
            </Button>
            <Button onClick={onClose} className="px-4 bg-blue-600 hover:bg-blue-700">
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
