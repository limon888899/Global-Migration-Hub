"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const navLinks = [
  { label: "Work Permits", href: "#services" },
  { label: "Immigration News", href: "#news" },
  { label: "Contact", href: "#contact" },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
      <a href="#top" className="flex items-center gap-3" aria-label="Global Migration Hub home">
          <span className="flex size-11 items-center justify-center overflow-hidden rounded-2xl bg-primary shadow-md shadow-primary/20 ring-1 ring-primary/10">
            <img src="/icon.png" alt="Global Migration Hub" className="size-full object-cover" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-serif text-lg font-semibold tracking-tight text-foreground sm:text-xl">
              Global Migration Hub
            </span>
            <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Visa &amp; Immigration Consultancy
            </span>
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
          <Button asChild className="h-10 rounded-full px-5">
            <Link href="/apply">Apply Now</Link>
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
            <Button asChild className="mt-2 h-10 rounded-full px-5" onClick={() => setOpen(false)}>
              <Link href="/apply">Apply Now</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}
