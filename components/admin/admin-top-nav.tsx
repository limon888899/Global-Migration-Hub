"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Bell, ChevronDown, HelpCircle, LogOut, Settings } from "lucide-react"
import { logout } from "@/lib/admin/auth"

export function AdminTopNav({ adminName = "Admin User" }: { adminName?: string }) {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  const initials = adminName
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 px-4 py-3 backdrop-blur sm:px-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primary">
            <img src="/icon.png" alt="Global Migration Hub" className="size-full object-cover" />
          </span>
          <div className="min-w-0 leading-tight">
            <div className="truncate font-serif text-sm font-semibold text-foreground sm:text-base">
              Global Migration Hub
            </div>
            <div className="text-xs text-muted-foreground">Admin Panel</div>
          </div>
        </div>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Admin">
          <span className="text-sm font-medium text-primary">Applications</span>
          <a href="#" className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary">
            <Settings className="size-4" /> Settings
          </a>
          <a href="#" className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary">
            <HelpCircle className="size-4" /> Help
          </a>
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            aria-label="Notifications"
            className="relative flex size-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <Bell className="size-4.5" />
            <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-destructive" />
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 hover:bg-muted"
            >
              <span className="flex size-7 items-center justify-center rounded-full bg-tip-peach text-xs font-semibold text-tip-peach-foreground">
                {initials}
              </span>
              <span className="hidden text-sm font-medium text-foreground sm:inline">{adminName}</span>
              <ChevronDown className="size-3.5 text-muted-foreground" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-11 w-44 overflow-hidden rounded-xl border border-border bg-popover shadow-lg">
                <button
                  type="button"
                  onClick={() => {
                    logout()
                    router.replace("/admin/login")
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-destructive hover:bg-muted"
                >
                  <LogOut className="size-4" /> Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
