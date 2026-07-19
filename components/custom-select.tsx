"use client"

import { useEffect, useRef, useState, type ComponentType } from "react"
import { ChevronDown, Check } from "lucide-react"

export interface CustomSelectOption {
  value: string
  label: string
  subtitle?: string
  icon?: ComponentType<{ className?: string }>
}

interface CustomSelectProps {
  id?: string
  value: string
  onChange: (value: string) => void
  options: CustomSelectOption[]
  placeholder?: string
  className?: string
}

export function CustomSelect({ id, value, onChange, options, placeholder = "Select an option", className }: CustomSelectProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    document.addEventListener("keydown", handleKey)
    return () => {
      document.removeEventListener("mousedown", handleClick)
      document.removeEventListener("keydown", handleKey)
    }
  }, [])

  const selected = options.find((o) => o.value === value)
  const SelectedIcon = selected?.icon

  return (
    <div ref={rootRef} className={`relative ${className || ""}`}>
      <button
        type="button"
        id={id}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex w-full items-center gap-3 rounded-lg border border-input bg-background px-4 py-2.5 text-left text-sm shadow-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
      >
        {SelectedIcon ? (
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <SelectedIcon className="size-4" />
          </span>
        ) : null}
        <span className="min-w-0 flex-1">
          {selected ? (
            <>
              <span className="block truncate font-medium text-foreground">{selected.label}</span>
              {selected.subtitle && (
                <span className="block truncate text-xs text-muted-foreground">{selected.subtitle}</span>
              )}
            </>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </span>
        <ChevronDown
          className={`size-4 shrink-0 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute left-0 right-0 top-full z-50 mt-2 max-h-72 overflow-y-auto rounded-xl border border-border bg-card p-1.5 shadow-xl animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-150"
        >
          {options.map((opt) => {
            const Icon = opt.icon
            const isSelected = opt.value === value
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(opt.value)
                  setOpen(false)
                }}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                  isSelected ? "bg-primary/10" : "hover:bg-secondary"
                }`}
              >
                {Icon ? (
                  <span
                    className={`flex size-8 shrink-0 items-center justify-center rounded-full ${
                      isSelected ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    <Icon className="size-4" />
                  </span>
                ) : null}
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-foreground">{opt.label}</span>
                  {opt.subtitle && <span className="block truncate text-xs text-muted-foreground">{opt.subtitle}</span>}
                </span>
                {isSelected && <Check className="size-4 shrink-0 text-primary" aria-hidden="true" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
