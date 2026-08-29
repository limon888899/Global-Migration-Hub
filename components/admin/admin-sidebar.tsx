"use client"

import { ExternalLink, LayoutGrid, ListChecks, Plus, ShieldCheck } from "lucide-react"

export function AdminSidebar({
  active,
  onNewApplication,
}: {
  active: "overview" | "applications"
  onNewApplication?: () => void
}) {
  const navItems = [
    { key: "overview", label: "Overview", icon: LayoutGrid },
    { key: "applications", label: "All Applications", icon: ListChecks },
  ] as const

  return (
    <aside className="flex w-full min-w-0 shrink-0 flex-col gap-5 lg:w-64">
      {/* Section: Quick Actions */}
      {onNewApplication && (
        <div className="min-w-0">
          <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Quick Actions
          </p>
          <button
            type="button"
            onClick={onNewApplication}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-lg active:translate-y-0"
          >
            <Plus className="size-4" />
            New Application
          </button>
        </div>
      )}

      {/* Section: Menu */}
      <div className="min-w-0">
        <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Menu</p>
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          {navItems.map((item) => (
            <div
              key={item.key}
              className={`relative flex items-center gap-2.5 border-b border-border px-4 py-3 text-sm font-medium transition-colors last:border-0 ${
                active === item.key
                  ? "bg-primary/8 text-primary"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
            >
              {active === item.key && <span className="absolute inset-y-0 left-0 w-1 rounded-r-full bg-primary" />}
              <item.icon className="size-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Section: Resources */}
      <div className="min-w-0">
        <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Resources
        </p>
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="mb-3 flex items-center gap-2">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-tip-blue text-tip-blue-foreground">
              <ShieldCheck className="size-3.5" />
            </span>
            <h3 className="min-w-0 truncate text-sm font-semibold text-foreground">USCIS Useful Links</h3>
          </div>
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
                className="flex items-center justify-between gap-2 text-primary hover:underline"
              >
                <span className="min-w-0 truncate">{link.label}</span>
                <ExternalLink className="size-3.5 shrink-0" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}
