"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { NewApplicationInput } from "@/lib/admin/types"

const emptyForm: NewApplicationInput = {
  fullName: "",
  passportNumber: "",
  nationality: "",
  email: "",
  phone: "",
  destinationCountry: "",
  visaType: "",
  travelDate: "",
}

export function NewApplicationModal({
  onClose,
  onCreate,
}: {
  onClose: () => void
  onCreate: (input: NewApplicationInput) => void
}) {
  const [form, setForm] = useState<NewApplicationInput>(emptyForm)

  function update<K extends keyof NewApplicationInput>(key: K, value: NewApplicationInput[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.fullName || !form.passportNumber) return
    onCreate(form)
    onClose()
  }

  const fields: { key: keyof NewApplicationInput; label: string; type?: string }[] = [
    { key: "fullName", label: "Full Name" },
    { key: "passportNumber", label: "Passport No." },
    { key: "nationality", label: "Nationality" },
    { key: "email", label: "Email", type: "email" },
    { key: "phone", label: "Phone" },
    { key: "destinationCountry", label: "Destination Country" },
    { key: "visaType", label: "Visa Type" },
    { key: "travelDate", label: "Travel Date", type: "date" },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <form
        onSubmit={handleSubmit}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-card shadow-xl"
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
          ))}
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
