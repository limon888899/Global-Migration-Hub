"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, FileText, Plus, ExternalLink } from "lucide-react"

type SidebarKey = "overview" | "documents"

interface AdminSidebarProps {
  /** Which item is highlighted. Falls back to the current URL when omitted. */
  active?: SidebarKey
  /** When provided, shows a "New application" button at the top. */
  onNewApplication?: () => void
}

const NAV_ITEMS: { key: SidebarKey; label: string; href: string; icon: typeof FileText }[] = [
  { key: "overview", label: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
  { key: "documents", label: "Documents", href: "/admin/documents", icon: FileText },
]

/**
 * Desktop-only sidebar. On phones and tablets (below the `lg` breakpoint) it is hidden,
 * because the top-bar hamburger menu (AdminDrawer) already provides the same navigation.
 */
export function AdminSidebar({ active, onNewApplication }: AdminSidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="hidden w-60 shrink-0 flex-col self-start rounded-2xl bg-slate-900 p-4 text-slate-300 shadow-sm lg:sticky lg:top-24 lg:flex">
      <div className="mb-5 px-2 pt-1">
        <h1 className="text-lg font-bold tracking-wide text-white">Migration Hub</h1>
        <p className="mt-0.5 text-xs text-slate-400">Admin Control Panel</p>
      </div>

      {onNewApplication && (
        <button
          type="button"
          onClick={onNewApplication}
          className="mb-4 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
        >
          <Plus className="size-4" /> New application
        </button>
      )}

      <nav className="space-y-1" aria-label="Admin sections">
        {NAV_ITEMS.map((item) => {
          const isActive = active ? active === item.key : pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.key}
              href={item.href}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon className="size-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="mt-6 border-t border-slate-800 pt-4">
        <a
          href="https://www.uscis.gov"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between rounded-lg px-3 py-2 text-xs text-slate-400 transition hover:bg-slate-800 hover:text-white"
        >
          <span>USCIS Resources</span>
          <ExternalLink className="size-3.5" />
        </a>
      </div>
    </aside>
  )
}

export default AdminSidebar
