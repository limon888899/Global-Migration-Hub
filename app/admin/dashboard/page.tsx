"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { FilePlus2, Search, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ApplicationModal } from "@/components/admin/application-modal"
import { NewApplicationModal } from "@/components/admin/new-application-modal"
import { isLoggedIn, logout } from "@/lib/admin/auth"
import {
  getApplications,
  addApplication,
  updateApplication,
  deleteApplication,
  addDocument,
} from "@/lib/admin/data"
import { effectiveStage, stageLabel, type Application, type ManualStatus, type NewApplicationInput } from "@/lib/admin/types"

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
}

function statusBadgeClass(app: Application) {
  const stage = effectiveStage(app)
  if (stage === "rejected") return "bg-destructive/10 text-destructive"
  if (stage === 3) return "bg-emerald-500/10 text-emerald-700"
  if (stage === 0) return "bg-muted text-muted-foreground"
  return "bg-accent/20 text-accent-foreground"
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const [ready, setReady] = useState(false)
  const [apps, setApps] = useState<Application[]>([])
  const [search, setSearch] = useState("")
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showNewModal, setShowNewModal] = useState(false)

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace("/admin/login")
      return
    }
    setApps(getApplications())
    setReady(true)
  }, [router])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return apps
    return apps.filter(
      (a) => a.fullName.toLowerCase().includes(q) || a.passportNumber.toLowerCase().includes(q),
    )
  }, [apps, search])

  const stats = useMemo(() => {
    const counts = { total: apps.length, processing: 0, verified: 0, approved: 0, rejected: 0 }
    for (const app of apps) {
      const stage = effectiveStage(app)
      if (stage === "rejected") counts.rejected++
      else if (stage === 1) counts.processing++
      else if (stage === 2) counts.verified++
      else if (stage === 3) counts.approved++
    }
    return counts
  }, [apps])

  function refresh() {
    setApps(getApplications())
  }

  function handleCreate(input: NewApplicationInput) {
    addApplication(input)
    refresh()
  }

  function handleUpdateStatus(id: string, status: ManualStatus, note: string) {
    updateApplication(id, { manualStatus: status, statusNote: note })
    refresh()
  }

  function handleSaveNotes(id: string, notes: string) {
    updateApplication(id, { internalNotes: notes })
    refresh()
  }

  function handleDelete(id: string) {
    deleteApplication(id)
    setSelectedId(null)
    refresh()
  }

  function handleAddDocument(id: string, name: string) {
    addDocument(id, name)
    refresh()
  }

  const selectedApp = apps.find((a) => a.id === selectedId) ?? null

  if (!ready) {
    return <main className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">Loading…</main>
  }

  return (
    <main className="min-h-screen pb-16">
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/95 px-4 py-4 backdrop-blur sm:px-6">
        <div className="font-serif text-lg font-semibold text-foreground">
          Global Migration Hub <span className="font-sans text-sm font-normal text-muted-foreground">Admin</span>
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" onClick={() => setShowNewModal(true)} className="h-9 gap-1.5 px-4 text-sm">
            <FilePlus2 className="size-4" /> New Application
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              logout()
              router.replace("/admin/login")
            }}
            className="h-9 gap-1.5 px-4 text-sm"
          >
            <LogOut className="size-4" /> Log Out
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {[
            { label: "Total Applications", value: stats.total },
            { label: "Processing", value: stats.processing },
            { label: "Document Verified", value: stats.verified },
            { label: "Approved", value: stats.approved },
            { label: "Rejected", value: stats.rejected },
          ].map((s) => (
            <div key={s.label} className="rounded-lg border border-border bg-card p-4">
              <div className="text-xs text-muted-foreground">{s.label}</div>
              <div className="mt-1 text-2xl font-semibold text-foreground">{s.value}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-lg border border-border bg-card">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
            <h3 className="font-serif text-base font-semibold text-foreground">All Applications</h3>
            <div className="relative w-full max-w-xs">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or passport number..."
                className="w-full rounded-md border border-input bg-background py-2 pl-8 pr-3 text-sm text-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </div>
          </div>

          {filtered.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-muted-foreground">No applications found yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-4 py-3 font-medium">Applicant</th>
                    <th className="px-4 py-3 font-medium">Passport No.</th>
                    <th className="px-4 py-3 font-medium">Country</th>
                    <th className="px-4 py-3 font-medium">Visa Type</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Submitted</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((app) => (
                    <tr key={app.id} className="border-b border-border last:border-0 hover:bg-muted/40">
                      <td className="px-4 py-3 font-medium text-foreground">{app.fullName}</td>
                      <td className="px-4 py-3 text-muted-foreground">{app.passportNumber}</td>
                      <td className="px-4 py-3 text-muted-foreground">{app.destinationCountry}</td>
                      <td className="px-4 py-3 text-muted-foreground">{app.visaType}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusBadgeClass(app)}`}>
                          {stageLabel(app)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{formatDate(app.submittedAt)}</td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => setSelectedId(app.id)}
                          className="text-sm font-medium text-primary hover:underline"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {selectedApp && (
        <ApplicationModal
          app={selectedApp}
          onClose={() => setSelectedId(null)}
          onUpdateStatus={handleUpdateStatus}
          onSaveNotes={handleSaveNotes}
          onDelete={handleDelete}
          onAddDocument={handleAddDocument}
        />
      )}

      {showNewModal && <NewApplicationModal onClose={() => setShowNewModal(false)} onCreate={handleCreate} />}
    </main>
  )
}
