"use client"

import { useRef, useState } from "react"
import { Loader2, CheckCircle2, AlertCircle, Upload, X, FileText, FileUp, Eye } from "lucide-react"

export interface DocumentUploadProps {
  id: string
  label: string
  required?: boolean
  fileName?: string
  uploading?: boolean
  error?: string
  onFileSelected: (file: File | null) => void
  fileUrl?: string
  acceptedFormats?: string
}

export function DocumentUpload({
  id,
  label,
  required,
  fileName,
  uploading,
  error,
  onFileSelected,
  fileUrl,
  acceptedFormats = "image/*,.pdf",
}: DocumentUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)
  const [preview, setPreview] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (acceptedFormats.split(",").some(format => {
        if (format.startsWith(".")) return file.name.endsWith(format)
        return file.type.includes(format.replace("*", ""))
      })) {
        onFileSelected(file)
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelected(e.target.files[0])
    }
  }

  const getFileIcon = () => {
    if (!fileName) return <Upload className="size-5" />
    if (fileName.endsWith(".pdf")) return <FileText className="size-5" />
    return <FileUp className="size-5" />
  }

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-foreground mb-2">
        {label} {required && <span className="text-destructive">*</span>}
      </label>

      {/* Main Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative rounded-xl border-2 transition-all duration-200 p-6 text-center cursor-pointer group ${
          dragActive
            ? "border-accent bg-accent/10"
            : "border-dashed border-border bg-secondary/20 hover:border-accent/50 hover:bg-secondary/40"
        } ${error ? "border-destructive/50 bg-destructive/5" : ""}`}
      >
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={acceptedFormats}
          className="hidden"
          disabled={uploading}
          onChange={handleChange}
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="size-8 animate-spin text-accent" />
            <p className="text-sm font-medium text-foreground">Uploading...</p>
          </div>
        ) : fileName ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-accent/10">
                {getFileIcon()}
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-foreground truncate max-w-xs">{fileName}</p>
                <p className="text-xs text-accent">File uploaded</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {fileUrl && (
                <button
                  type="button"
                  onClick={() => setPreview(true)}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                  aria-label="Preview file"
                >
                  <Eye className="size-4 text-muted-foreground hover:text-foreground" />
                </button>
              )}
              <CheckCircle2 className="size-6 text-accent" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-full bg-accent/10">
              <Upload className="size-6 text-accent" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Drag and drop your file</p>
              <p className="text-xs text-muted-foreground mt-1">or click to browse</p>
            </div>
            <p className="text-xs text-muted-foreground mt-2">PDF or Image (max 4 MB)</p>
          </div>
        )}

        {!uploading && !fileName && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="absolute inset-0 rounded-xl"
            aria-label={`Upload ${label}`}
          />
        )}
      </div>

      {error && (
        <div className="mt-2 flex items-center gap-2 rounded-lg bg-destructive/10 p-2.5">
          <AlertCircle className="size-4 text-destructive shrink-0" />
          <p className="text-xs text-destructive">{error}</p>
        </div>
      )}

      {/* File Preview Modal */}
      {preview && fileUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="rounded-xl bg-background max-w-2xl w-full max-h-[80vh] overflow-auto relative">
            <button
              onClick={() => setPreview(false)}
              className="absolute top-2 right-2 z-10 p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              <X className="size-5" />
            </button>
            {fileName?.endsWith(".pdf") ? (
              <iframe src={fileUrl} className="w-full h-full min-h-[500px]" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={fileUrl} alt="File preview" className="w-full h-auto" />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
