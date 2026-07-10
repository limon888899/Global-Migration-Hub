"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { ApplicationModal } from "@/components/admin/application-modal"
import { NewApplicationModal } from "@/components/admin/new-application-modal"
import { AdminTopNav } from "@/components/admin/admin-top-nav"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { isLoggedIn } from "@/lib/admin/auth"
import {
  getApplications,
  addApplication,
  updateApplication,
  deleteApplication,
  addDocument,
} from "@/lib/admin/data"
import {
  effectiveStage,
  stageLabel,
  type Application,
  type DocumentCategory,
  type ManualStatus,
  type NewApplicationInput,
} from "@/lib/admin/types"

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
}

function statusBadgeClass(app: Application) {
  const stage = effectiveStage(app)
  if (stage === "rejected") return "bg-destructive/10 text-destructive"
  if (stage === 3) return "bg-tip-green text-tip-green-foreground"
  if (stage === 0) return "bg-muted text-muted-foreground"
  return "bg-tip-yellow text-tip-yellow-foreground"
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const [ready, setReady] = useState(false)
  const [apps, setApps] = useState<Application[]>([])
  const [search, setSearch] = useState("")
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showNewModal, setShowNewModal] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace("/admin/login")
      return
    }
    getApplications().then((data) => {
      setApps(data)
      setReady(true)
    })
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

  async function refresh() {
    setRefreshing(true)
    const data = await getApplications()
    setApps(data)
    setRefreshing(false)
  }

  async function handleCreate(input: NewApplicationInput) {
    await addApplication(input)
    await refresh()
  }

  async function handleUpdateStatus(id: string, status: ManualStatus, note: string) {
    await updateApplication(id, { manualStatus: status, statusNote: note })
    await refresh()
  }

  async function handleSaveNotes(id: string, notes: string) {
    await updateApplication(id, { internalNotes: notes })
    await refresh()
  }

  async function handleUpdateSubmittedAt(id: string, submittedAt: string) {
    await updateApplication(id, { submittedAt })
    await refresh()
  }

  async function handleUpdateProfile(id: string, patch: Partial<Application>) {
    await updateApplication(id, patch)
    await refresh()
  }

  async function handleDelete(id: string) {
    await deleteApplication(id)
    setSelectedId(null)
    await refresh()
  }

  async function handleAddDocument(id: string, doc: { name: string; dataUrl?: string; category?: DocumentCategory }) {
    await addDocument(id, doc)
    await refresh()
  }

  const selectedApp = apps.find((a) => a.id === selectedId) ?? null

  if (!ready) {
    return <main className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">Loading…</main>
  }

  const statTiles = [
    { label: "Total Applications", value: stats.total, tone: "bg-tip-blue text-tip-blue-foreground" },
    { label: "Processing", value: stats.processing, tone: "bg-tip-yellow text-tip-yellow-foreground" },
    { label: "Document Verified", value: stats.verified, tone: "bg-tip-purple text-tip-purple-foreground" },
    { label: "Approved", value: stats.approved, tone: "bg-tip-green text-tip-green-foreground" },
    { label: "Rejected", value: stats.rejected, tone: "bg-tip-peach text-tip-peach-foreground" },
  ]

  return (
    <main className="min-h-screen bg-secondary/30 pb-16">
      <AdminTopNav />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="flex flex-col gap-6 lg:flex-row">
          <AdminSidebar active="overview" onNewApplication={() => setShowNewModal(true)} />

          <div className="min-w-0 flex-1">
            {refreshing && <p className="mb-3 text-xs text-muted-foreground">Syncing…</p>}

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              {statTiles.map((s) => (
                <div key={s.label} className={`rounded-2xl p-4 ${s.tone}`}>
                  <div className="text-xs opacity-80">{s.label}</div>
                  <div className="mt-1 text-2xl font-semibold">{s.value}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
                <h3 className="font-serif text-base font-semibold text-foreground">All Applications</h3>
                <div className="relative w-full max-w-xs">
                  <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name or passport number..."
                    className="w-full rounded-xl border border-input bg-background py-2 pl-8 pr-3 text-sm text-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                  />
                </div>
              </div>

              {filtered.length === 0 ? (
                <p className="px-4 py-10 text-center text-sm text-muted-foreground">No applications found yet.</p>
              ) : (
                <>
                  <div className="divide-y divide-border sm:hidden">
                    {filtered.map((app) => (
                      <button
                        key={app.id}
                        type="button"
                        onClick={() => setSelectedId(app.id)}
                        className="flex w-full flex-col gap-2 px-4 py-3.5 text-left active:bg-muted/40"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-medium text-foreground">{app.fullName}</span>
                          <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${statusBadgeClass(app)}`}>
                            {stageLabel(app)}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                          <span>{app.passportNumber}</span>
                          <span>·</span>
                          <span>{app.destinationCountry}</span>
                          <span>·</span>
                          <span>{app.visaType}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Submitted {formatDate(app.submittedAt)}
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="hidden overflow-x-auto sm:block">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                          <th className="px-5 py-3 font-medium">Applicant</th>
                          <th className="px-5 py-3 font-medium">Passport No.</th>
                          <th className="px-5 py-3 font-medium">Country</th>
                          <th className="px-5 py-3 font-medium">Visa Type</th>
                          <th className="px-5 py-3 font-medium">Status</th>
                          <th className="px-5 py-3 font-medium">Submitted</th>
                          <th className="px-5 py-3 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map((app) => (
                          <tr key={app.id} className="border-b border-border last:border-0 hover:bg-muted/40">
                            <td className="px-5 py-3 font-medium text-foreground">{app.fullName}</td>
                            <td className="px-5 py-3 text-muted-foreground">{app.passportNumber}</td>
                            <td className="px-5 py-3 text-muted-foreground">{app.destinationCountry}</td>
                            <td className="px-5 py-3 text-muted-foreground">{app.visaType}</td>
                            <td className="px-5 py-3">
                              <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusBadgeClass(app)}`}>
                                {stageLabel(app)}
                              </span>
                            </td>
                            <td className="px-5 py-3 text-muted-foreground">{formatDate(app.submittedAt)}</td>
                            <td className="px-5 py-3">
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
                </>
              )}
            </div>
          </div>
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
          onUpdateSubmittedAt={handleUpdateSubmittedAt}
          onUpdateProfile={handleUpdateProfile}
        />
      )}

      {showNewModal && <NewApplicationModal onClose={() => setShowNewModal(false)} onCreate={handleCreate} />}
    </main>
  )
}
