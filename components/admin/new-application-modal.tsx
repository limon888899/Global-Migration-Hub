"use client"

import { useState } from "react"
import { X, Upload, Image as ImageIcon, FileText, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { AppDocument, DocumentCategory, NewApplicationInput } from "@/lib/admin/types"
import { DESTINATION_COUNTRIES } from "@/lib/countries"

const MAX_FILE_BYTES = 800 * 1024 // 800 KB per file — keep uploads small

const emptyForm: Omit<NewApplicationInput, "photoUrl" | "documents"> = {
  fullName: "",
  passportNumber: "",
  nationality: "",
  email: "",
  phone: "",
  destinationCountry: "",
  visaType: "",
  travelDate: "",
}

const DOC_CATEGORIES: { key: DocumentCategory; label: string }[] = [
  { key: "passport_copy", label: "Passport Copy" },
  { key: "job_letter", label: "Job Letter" },
  { key: "medical_certificate", label: "Medical Certificate" },
  { key: "fingerprint", label: "Fingerprint Form" },
]

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error("Could not read file"))
    reader.readAsDataURL(file)
  })
}

type SlotFile = { name: string; dataUrl: string } | null

export function NewApplicationModal({
  onClose,
  onCreate,
}: {
  onClose: () => void
  onCreate: (input: NewApplicationInput) => void
}) {
  const [form, setForm] = useState(emptyForm)
  const [photo, setPhoto] = useState<SlotFile>(null)
  const [categoryFiles, setCategoryFiles] = useState<Record<DocumentCategory, SlotFile>>({
    passport_copy: null,
    job_letter: null,
    medical_certificate: null,
    fingerprint: null,
    other: null,
  })
  const [otherDocs, setOtherDocs] = useState<SlotFile[]>([])
  const [fileError, setFileError] = useState("")

  function update<K extends keyof typeof emptyForm>(key: K, value: (typeof emptyForm)[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handlePhotoChange(file: File | null) {
    setFileError("")
    if (!file) {
      setPhoto(null)
      return
    }
    if (file.size > MAX_FILE_BYTES) {
      setFileError("Photo is too large. Please use a file under 800 KB.")
      return
    }
    const dataUrl = await readFileAsDataUrl(file)
    setPhoto({ name: file.name, dataUrl })
  }

  async function handleCategoryFileChange(category: DocumentCategory, file: File | null) {
    setFileError("")
    if (!file) {
      setCategoryFiles((c) => ({ ...c, [category]: null }))
      return
    }
    if (file.size > MAX_FILE_BYTES) {
      setFileError("One of the documents is too large. Please use files under 800 KB each.")
      return
    }
    const dataUrl = await readFileAsDataUrl(file)
    setCategoryFiles((c) => ({ ...c, [category]: { name: file.name, dataUrl } }))
  }

  function addOtherDocSlot() {
    setOtherDocs((docs) => [...docs, null])
  }

  async function handleOtherDocChange(index: number, file: File | null) {
    setFileError("")
    if (!file) return
    if (file.size > MAX_FILE_BYTES) {
      setFileError("One of the documents is too large. Please use files under 800 KB each.")
      return
    }
    const dataUrl = await readFileAsDataUrl(file)
    setOtherDocs((docs) => docs.map((d, i) => (i === index ? { name: file.name, dataUrl } : d)))
  }

  function removeOtherDocSlot(index: number) {
    setOtherDocs((docs) => docs.filter((_, i) => i !== index))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.fullName || !form.passportNumber || !form.destinationCountry) return

    const now = new Date().toISOString()
    const documents: AppDocument[] = []

    for (const { key } of DOC_CATEGORIES) {
      const file = categoryFiles[key]
      if (file) {
        documents.push({
          id: `doc_${Date.now()}_${key}`,
          name: file.name,
          category: key,
          dataUrl: file.dataUrl,
          addedBy: "admin",
          addedAt: now,
        })
      }
    }

    otherDocs.forEach((file, i) => {
      if (file) {
        documents.push({
          id: `doc_${Date.now()}_other_${i}`,
          name: file.name,
          category: "other",
          dataUrl: file.dataUrl,
          addedBy: "admin",
          addedAt: now,
        })
      }
    })

    onCreate({
      ...form,
      photoUrl: photo?.dataUrl ?? "",
      documents,
    })
    onClose()
  }

  const fields: { key: keyof typeof emptyForm; label: string; type?: string }[] = [
    { key: "fullName", label: "Full Name" },
    { key: "passportNumber", label: "Passport No." },
    { key: "nationality", label: "Nationality" },
    { key: "email", label: "Email", type: "email" },
    { key: "phone", label: "Phone" },
    { key: "visaType", label: "Visa Type" },
    { key: "travelDate", label: "Travel Date", type: "date" },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in-0 duration-200">
      <form
        onSubmit={handleSubmit}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-card shadow-xl animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 duration-300"
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h3 className="font-serif text-lg font-semibold text-foreground">Submit New Application</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="px-6 py-5">
          <h4 className="mb-3 text-sm font-semibold text-foreground">Applicant Photo</h4>
          <div className="flex items-center gap-4">
            <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-muted">
              {photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photo.dataUrl} alt="Applicant" className="size-full object-cover" />
              ) : (
                <ImageIcon className="size-6 text-muted-foreground" />
              )}
            </div>
            <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground hover:bg-muted">
              <Upload className="size-4" />
              {photo ? "Change Photo" : "Upload Photo"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handlePhotoChange(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 px-6 py-5">
          {fields.map(({ key, label, type }) => (
            <div key={key} className="col-span-1">
              <label htmlFor={key} className="mb-1.5 block text-sm font-medium text-foreground">
                {label}
                {(key === "fullName" || key === "passportNumber") && <span className="text-destructive"> *</span>}
              </label>
              <input
                id={key}
                type={type ?? "text"}
                value={form[key]}
                onChange={(e) => update(key, e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </div>
          ))}<div className="col-span-1">
  <label htmlFor="destinationCountry" className="mb-1.5 block text-sm font-medium text-foreground">
    Destination Country
    <span className="text-destructive"> *</span>
  </label>
  <select
    id="destinationCountry"
    required
    value={form.destinationCountry}
    onChange={(e) => update("destinationCountry", e.target.value)}
    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
  >
    <option value="" disabled>
      Select a country
    </option>
    {DESTINATION_COUNTRIES.map((country) => (
      <option key={country} value={country}>
        {country}
      </option>
    ))}
  </select>
</div>
        </div>

        <div className="border-t border-border px-6 py-5">
          <h4 className="mb-1 text-sm font-semibold text-foreground">Visa Documents</h4>
          <p className="mb-3 text-xs text-muted-foreground">
            Upload the applicant&apos;s documents. These will be visible on their profile once the
            application is created.
          </p>

          <div className="space-y-3">
            {DOC_CATEGORIES.map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between gap-3 rounded-md border border-border p-3">
                <div className="flex min-w-0 items-center gap-2 text-sm text-foreground">
                  <FileText className="size-4 shrink-0 text-muted-foreground" />
                  <span className="shrink-0">{label}</span>
                  {categoryFiles[key] && (
                    <span className="truncate text-xs text-muted-foreground">— {categoryFiles[key]?.name}</span>
                  )}
                </div>
                <label className="inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-md border border-input bg-background px-2.5 py-1.5 text-xs text-foreground hover:bg-muted">
                  <Upload className="size-3.5" />
                  {categoryFiles[key] ? "Replace" : "Upload"}
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    className="hidden"
                    onChange={(e) => handleCategoryFileChange(key, e.target.files?.[0] ?? null)}
                  />
                </label>
              </div>
            ))}

            {otherDocs.map((file, index) => (
              <div key={index} className="flex items-center justify-between gap-3 rounded-md border border-border p-3">
                <div className="flex min-w-0 items-center gap-2 text-sm text-foreground">
                  <FileText className="size-4 shrink-0 text-muted-foreground" />
                  <span className="truncate">{file?.name ?? "Other Document"}</span>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <label className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-input bg-background px-2.5 py-1.5 text-xs text-foreground hover:bg-muted">
                    <Upload className="size-3.5" />
                    {file ? "Replace" : "Upload"}
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      className="hidden"
                      onChange={(e) => handleOtherDocChange(index, e.target.files?.[0] ?? null)}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => removeOtherDocSlot(index)}
                    aria-label="Remove document"
                    className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-destructive"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addOtherDocSlot}
            className="mt-3 text-sm font-medium text-primary hover:underline"
          >
            + Add another document
          </button>

          {fileError && <p className="mt-3 text-sm text-destructive">{fileError}</p>}
        </div>

        <div className="flex justify-end gap-2 border-t border-border px-6 py-4">
          <Button type="button" variant="outline" onClick={onClose} className="h-9 px-4 text-sm">
            Cancel
          </Button>
          <Button type="submit" className="h-9 px-4 text-sm">
            Create Application
          </Button>
        </div>
      </form>
    </div>
  )
}
