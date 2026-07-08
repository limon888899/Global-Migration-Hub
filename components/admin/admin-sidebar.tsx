"use client"

import { ExternalLink, FilePlus2, LayoutGrid, ListChecks } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AdminSidebar({
  active,
  onNewApplication,
}: {
  active: "overview" | "applications"
  onNewApplication: () => void
}) {
  const navItems = [
    { key: "overview", label: "Overview", icon: LayoutGrid },
    { key: "applications", label: "All Applications", icon: ListChecks },
  ] as const

  return (
    <aside className="hidden w-64 shrink-0 flex-col gap-5 lg:flex">
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        {navItems.map((item) => (
          <div
            key={item.key}
            className={`flex items-center gap-2.5 border-b border-border px-4 py-3 text-sm font-medium last:border-0 ${
              active === item.key ? "bg-tip-blue text-tip-blue-foreground" : "text-muted-foreground"
            }`}
          >
            <item.icon className="size-4" />
            {item.label}
          </div>
        ))}
      </div>

      <Button type="button" onClick={onNewApplication} className="h-10 w-full gap-1.5 rounded-xl">
        <FilePlus2 className="size-4" />
        New Application
      </Button>

      <div className="rounded-2xl border border-border bg-card p-4">
        <h3 className="mb-2 text-sm font-semibold text-foreground">USCIS Useful Links</h3>
        <p className="mb-3 text-xs text-muted-foreground">
          United States Citizenship and Immigration Services
        </p>
        <div className="space-y-2.5 text-sm">
          {[
            { label: "Form & Fees", href: "https://www.uscis.gov/forms" },
            { label: "Processing Times", href: "https://egov.uscis.gov/processing-times/" },
            { label: "Policy Updates and News", href: "https://www.uscis.gov/newsroom" },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between text-primary hover:underline"
            >
              {link.label}
              <ExternalLink className="size-3.5" />
            </a>
          ))}
        </div>
      </div>
    </aside>
  )
}
