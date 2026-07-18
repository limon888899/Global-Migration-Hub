"use client"

import { CheckCircle2, Loader2, Upload, FileText } from "lucide-react"
import { useRef } from "react"

interface DocumentUploadProps {
  id: string
  label: string
  required?: boolean
  fileName?: string
  fileUrl?: string
  uploading?: boolean
  error?: string
  onFileSelected: (file: File | null) => void
}

export function DocumentUpload({
  id,
  label,
  required,
  fileName,
  fileUrl,
  uploading,
  error,
  onFileSelected,
}: DocumentUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const isImage = fileUrl ? /\.(jpe?g|png|webp|gif)$/i.test(fileUrl) : false

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </label>

      <div
        onClick={() => !uploading && inputRef.current?.click()}
        className="mt-1.5 flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-input bg-background px-4 py-3 text-sm shadow-sm transition hover:bg-muted/50"
      >
        {isImage && fileUrl ? (
          <img
            src={fileUrl}
            alt={fileName || label}
            className="size-10 shrink-0 rounded-md object-cover"
          />
        ) : (
          <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-secondary text-muted-foreground">
            {fileName ? <FileText className="size-4" /> : <Upload className="size-4" />}
          </span>
        )}

        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm text-foreground">
            {fileName || "Click to upload (image or PDF)"}
          </span>
          <span className="block text-xs text-muted-foreground">Max file size 4 MB</span>
        </span>

        <span className="shrink-0">
          {uploading ? (
            <Loader2 className="size-5 animate-spin text-primary" aria-hidden="true" />
          ) : fileName ? (
            <CheckCircle2 className="size-5 text-primary" aria-hidden="true" />
          ) : null}
        </span>
      </div>

      <input
        ref={inputRef}
        id={id}
        type="file"
        accept="image/*,.pdf"
        className="hidden"
        disabled={uploading}
        onChange={(e) => onFileSelected(e.target.files?.[0] ?? null)}
      />

      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  )
}
