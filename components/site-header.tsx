"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useApplicationModal } from "@/components/application-modal"

const navLinks = [
  { label: "Work Permits", href: "#services" },
  { label: "Immigration News", href: "#news" },
  { label: "Contact", href: "#contact" },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const { open: openApplicationModal } = useApplicationModal()

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <a href="#top" className="flex items-center gap-2.5" aria-label="Global Migration Hub home">
          <span className="flex size-9 items-center justify-center overflow-hidden rounded-xl bg-primary">
            <img src="/icon.png" alt="Global Migration Hub" className="size-full object-cover" />
          </span>
          <span className="font-serif text-lg font-semibold leading-tight text-foreground">
            Global Migration Hub
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button type="button" onClick={() => openApplicationModal()} className="h-10 rounded-full px-5">
            Apply Now
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-xl p-2 text-foreground md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4" aria-label="Mobile">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"
              >
                {link.label}
              </a>
            ))}
            <Button
              type="button"
              onClick={() => {
                setOpen(false)
                openApplicationModal()
              }}
              className="mt-2 h-10 rounded-full px-5"
            >
              Apply Now
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}
