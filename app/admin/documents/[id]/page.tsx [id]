"use client"

import { use, useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Download, ExternalLink, FileText, Loader2, Trash2, Upload } from "lucide-react"
import { AdminTopNav } from "@/components/admin/admin-top-nav"
import { isLoggedIn } from "@/lib/admin/auth"
import { getApplications, updateApplication } from "@/lib/admin/data"
import { uploadAdminFile } from "@/lib/admin/upload"
import { formatCountry } from "@/lib/countries"
import { stageLabel, type AppDocument, type Application } from "@/lib/admin/types"
import {
  GROUP_APPLICATION_FORM,
  GROUP_CHECKLIST,
  GROUP_COMBINED,
  GROUP_SERVICE_AGREEMENT,
  PREFIX_APPLICATION_FORM,
  PREFIX_CHECKLIST,
  PREFIX_COMBINED,
  PREFIX_SERVICE_AGREEMENT,
  SLOT_NAMES,
  VISA_DOCUMENT_SLOTS,
} from "@/lib/admin/document-slots"
import {
  buildApplicationForm,
  buildChecklist,
  buildServiceAgreement,
  combineDocuments,
  downloadBytes,
  downloadFromUrl,
  safeFileName,
} from "@/lib/admin/pdf-tools"

const MAX_FILE_BYTES = 4 * 1024 * 1024 // matches /api/admin/upload

const btnPrimary =
  "inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:opacity-60"
const btnOutline =
  "inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-sm font-medium text-foreground transition hover:bg-muted disabled:opacity-60"

type Kind = "form" | "agreement" | "checklist" | "combined"
type Notice = { type: "ok" | "error"; text: string } | null

const KIND_META: Record<Kind, { label: string; group: string; prefix: string; hint: string }> = {
  form: {
    label: "Application form",
    group: GROUP_APPLICATION_FORM,
    prefix: PREFIX_APPLICATION_FORM,
    hint: "Filled in from the applicant's details.",
  },
  agreement: {
    label: "Service agreement",
    group: GROUP_SERVICE_AGREEMENT,
    prefix: PREFIX_SERVICE_AGREEMENT,
    hint: "Terms between the agency and the client.",
  },
  checklist: {
    label: "Document checklist",
    group: GROUP_CHECKLIST,
    prefix: PREFIX_CHECKLIST,
    hint: "Shows which documents are received or pending.",
  },
  combined: {
    label: "Combined PDF",
    group: GROUP_COMBINED,
    prefix: PREFIX_COMBINED,
    hint: "All uploaded files merged page by page.",
  },
}

export default function AdminApplicationDocumentsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [ready, setReady] = useState(false)
  const [app, setApp] = useState<Application | null>(null)
  const [busy, setBusy] = useState<string | null>(null)
  const [notice, setNotice] = useState<Notice>(null)
  const [fee, setFee] = useState("")
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({})

  useEffect(() => {
    isLoggedIn().then((ok) => {
      if (!ok) {
        router.replace("/admin/login")
        return
      }
      getApplications().then((all) => {
        setApp(all.find((a) => a.id === id) ?? null)
        setReady(true)
      })
    })
  }, [router, id])

  const byGroup = useMemo(() => {
    const map = new Map<string, AppDocument[]>()
    for (const doc of app?.documents ?? []) {
      const key = doc.groupName?.trim() || "Other"
      map.set(key, [...(map.get(key) ?? []), doc])
    }
    return map
  }, [app])

  const otherGroups = useMemo(() => {
    const known = new Set<string>([...SLOT_NAMES, GROUP_SERVICE_AGREEMENT, GROUP_CHECKLIST, GROUP_COMBINED])
    return [...byGroup.entries()].filter(([name]) => !known.has(name))
  }, [byGroup])

  async function freshApp(): Promise<Application> {
    const all = await getApplications()
    const found = all.find((a) => a.id === id)
    if (!found) throw new Error("Application not found.")
    return found
  }

  async function saveDocuments(documents: AppDocument[]) {
    await updateApplication(id, { documents })
    setApp((prev) => (prev ? { ...prev, documents } : prev))
  }

  async function addToGroup(group: string, files: { name: string; url: string }[], replacePrefix?: string) {
    const current = await freshApp()
    let documents = current.documents ?? []
    if (replacePrefix) {
      documents = documents.filter((d) => !(d.groupName?.trim() === group && d.name.startsWith(replacePrefix)))
    }
    const added: AppDocument[] = files.map((f) => ({
      id: `doc_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      name: f.name,
      dataUrl: f.url,
      groupName: group,
      addedBy: "admin",
      addedAt: new Date().toISOString(),
    }))
    await saveDocuments([...documents, ...added])
  }

  async function run(key: string, okText: string | null, fn: () => Promise<string | void>) {
    setBusy(key)
    setNotice(null)
    try {
      const result = await fn()
      setNotice({ type: "ok", text: (typeof result === "string" && result) || okText || "Done." })
    } catch (err) {
      setNotice({ type: "error", text: err instanceof Error ? err.message : "Something went wrong. Please try again." })
    } finally {
      setBusy(null)
    }
  }

  function handleUpload(slot: string, files: FileList | null) {
    if (!files || files.length === 0) return
    const list = Array.from(files)
    const tooBig = list.find((f) => f.size > MAX_FILE_BYTES)
    if (tooBig) {
      setNotice({ type: "error", text: `${tooBig.name} is larger than 4 MB. Please use a smaller file.` })
      return
    }
    run(`upload:${slot}`, `${list.length} file${list.length === 1 ? "" : "s"} added to ${slot}.`, async () => {
      const uploaded: { name: string; url: string }[] = []
      for (const file of list) uploaded.push({ name: file.name, url: await uploadAdminFile(file) })
      await addToGroup(slot, uploaded)
    })
  }

  function handleRemove(doc: AppDocument) {
    if (!confirm(`Remove "${doc.name}" from this application?`)) return
    run(`remove:${doc.id}`, "File removed.", async () => {
      const current = await freshApp()
      await saveDocuments((current.documents ?? []).filter((d) => d.id !== doc.id))
    })
  }

  async function buildBytes(kind: Kind, source: Application) {
    if (kind === "form") return { bytes: await buildApplicationForm(source) }
    if (kind === "agreement") return { bytes: await buildServiceAgreement(source, { fee }) }
    if (kind === "checklist") return { bytes: await buildChecklist(source) }
    const combined = await combineDocuments(source)
    return { bytes: combined.bytes, files: combined.files, pages: combined.pages, skipped: combined.skipped }
  }

  function handleGenerate(kind: Kind, mode: "download" | "profile") {
    const meta = KIND_META[kind]
    run(`${kind}:${mode}`, null, async () => {
      const source = await freshApp()
      const built = await buildBytes(kind, source)
      const filename = `${meta.prefix}${safeFileName(source.fullName)}.pdf`
      const extra =
        built.files !== undefined
          ? ` ${built.files} file${built.files === 1 ? "" : "s"}, ${built.pages} pages.${
              built.skipped && built.skipped.length ? ` Skipped: ${built.skipped.join(", ")}.` : ""
            }`
          : ""

      if (mode === "download") {
        downloadBytes(built.bytes, filename)
        return `${meta.label} downloaded.${extra}`
      }
      if (built.bytes.byteLength > MAX_FILE_BYTES) {
        throw new Error(
          `This PDF is ${(built.bytes.byteLength / 1024 / 1024).toFixed(1)} MB, above the 4 MB upload limit. Download it instead.`,
        )
      }
      const file = new File([built.bytes as BlobPart], filename, { type: "application/pdf" })
      const url = await uploadAdminFile(file)
      await addToGroup(meta.group, [{ name: filename, url }], meta.prefix)
      return `${meta.label} added to the applicant's profile.${extra}`
    })
  }

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </main>
    )
  }

  if (!app) {
    return (
      <main className="min-h-screen bg-secondary/30">
        <AdminTopNav />
        <div className="mx-auto max-w-2xl px-4 py-16 text-center">
          <p className="text-sm text-muted-foreground">This application was not found.</p>
          <Link href="/admin/documents" className={`${btnOutline} mt-4`}>
            <ArrowLeft className="size-4" /> Back to documents
          </Link>
        </div>
      </main>
    )
  }

  const isBusy = (key: string) => busy === key

  return (
    <main className="min-h-screen overflow-x-hidden bg-secondary/30 pb-16">
      <AdminTopNav />

      <div className="mx-auto max-w-3xl min-w-0 px-4 py-6 sm:px-6">
        <Link href="/admin/documents" className="mb-4 inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
          <ArrowLeft className="size-4" /> All applications
        </Link>

        <div className="mb-5 rounded-2xl border border-border bg-card p-4">
          <h1 className="font-serif text-xl font-bold text-foreground">{app.fullName}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {app.visaType || "Visa"} · {app.destinationCountry ? formatCountry(app.destinationCountry) : "-"} ·{" "}
            {stageLabel(app)}
          </p>
        </div>

        {notice && (
          <div
            role="status"
            className={`mb-4 rounded-xl px-4 py-3 text-sm ${
              notice.type === "ok" ? "bg-tip-green text-tip-green-foreground" : "bg-destructive/10 text-destructive"
            }`}
          >
            {notice.text}
          </div>
        )}

        {/* Visa documents: upload the original files */}
        <section className="mb-5 rounded-2xl border border-border bg-card p-4">
          <h2 className="font-serif text-lg font-bold text-foreground">Visa documents</h2>
          <p className="mb-2 text-xs text-muted-foreground">
            Upload the original files issued by the authority or employer. PDF or images, up to 4 MB each. You can add
            several images to one document.
          </p>

          <ul className="divide-y divide-border">
            {VISA_DOCUMENT_SLOTS.map((slot) => {
              const docs = byGroup.get(slot.name) ?? []
              const uploading = isBusy(`upload:${slot.name}`)
              return (
                <li key={slot.name} className="py-3">
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full ${
                        docs.length ? "bg-tip-green text-tip-green-foreground" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <FileText className="size-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-foreground">{slot.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {docs.length ? `${docs.length} file${docs.length === 1 ? "" : "s"} uploaded` : slot.hint}
                      </p>
                    </div>
                    <button
                      type="button"
                      disabled={uploading}
                      onClick={() => fileInputs.current[slot.name]?.click()}
                      className={btnOutline}
                    >
                      {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
                      Upload
                    </button>
                    <input
                      ref={(el) => {
                        fileInputs.current[slot.name] = el
                      }}
                      type="file"
                      multiple
                      accept=".pdf,image/*"
                      className="hidden"
                      onChange={(e) => {
                        handleUpload(slot.name, e.target.files)
                        e.target.value = ""
                      }}
                    />
                  </div>

                  {docs.length > 0 && (
                    <ul className="ml-11 mt-2 space-y-1.5">
                      {docs.map((doc) => (
                        <li
                          key={doc.id}
                          className="flex items-center gap-2 rounded-lg bg-muted/50 px-2.5 py-1.5 text-xs"
                        >
                          <span className="min-w-0 flex-1 truncate text-foreground">{doc.name}</span>
                          {doc.dataUrl && (
                            <>
                              <a
                                href={doc.dataUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`Open ${doc.name}`}
                                className="text-primary hover:underline"
                              >
                                <ExternalLink className="size-3.5" />
                              </a>
                              <button
                                type="button"
                                aria-label={`Download ${doc.name}`}
                                onClick={() => downloadFromUrl(doc.dataUrl as string, doc.name)}
                                className="text-primary hover:underline"
                              >
                                <Download className="size-3.5" />
                              </button>
                            </>
                          )}
                          <button
                            type="button"
                            aria-label={`Remove ${doc.name}`}
                            disabled={isBusy(`remove:${doc.id}`)}
                            onClick={() => handleRemove(doc)}
                            className="text-destructive hover:opacity-70"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              )
            })}
          </ul>
        </section>

        {/* Agency documents: generated PDFs */}
        <section className="mb-5 rounded-2xl border border-border bg-card p-4">
          <h2 className="font-serif text-lg font-bold text-foreground">Agency documents</h2>
          <p className="mb-3 text-xs text-muted-foreground">
            Filled in automatically from this application. Download a PDF, or add it to the applicant&apos;s profile.
          </p>

          <label className="mb-3 block">
            <span className="mb-1 block text-xs font-medium text-muted-foreground">
              Service fee for the agreement (optional)
            </span>
            <input
              value={fee}
              onChange={(e) => setFee(e.target.value)}
              placeholder="e.g. AUD 2,500"
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </label>

          <ul className="divide-y divide-border">
            {(["form", "agreement", "checklist"] as Kind[]).map((kind) => {
              const meta = KIND_META[kind]
              const onProfile = (byGroup.get(meta.group) ?? []).some((d) => d.name.startsWith(meta.prefix))
              return (
                <li key={kind} className="flex flex-wrap items-center gap-2 py-3">
                  <div className="min-w-0 flex-1 basis-40">
                    <p className="text-sm font-semibold text-foreground">{meta.label}</p>
                    <p className="text-xs text-muted-foreground">{onProfile ? "On the applicant's profile" : meta.hint}</p>
                  </div>
                  <button
                    type="button"
                    disabled={busy !== null}
                    onClick={() => handleGenerate(kind, "download")}
                    className={btnOutline}
                  >
                    {isBusy(`${kind}:download`) ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
                    Download
                  </button>
                  <button
                    type="button"
                    disabled={busy !== null}
                    onClick={() => handleGenerate(kind, "profile")}
                    className={btnPrimary}
                  >
                    {isBusy(`${kind}:profile`) ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
                    Add to profile
                  </button>
                </li>
              )
            })}
          </ul>
        </section>

        {/* Combine uploaded files */}
        <section className="mb-5 rounded-2xl border border-border bg-card p-4">
          <h2 className="font-serif text-lg font-bold text-foreground">Combine uploaded files</h2>
          <p className="mb-3 text-xs text-muted-foreground">
            Merges every uploaded PDF and image of this application into one PDF, in the order of the list above. Images
            are placed one per page.
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={busy !== null}
              onClick={() => handleGenerate("combined", "download")}
              className={btnOutline}
            >
              {isBusy("combined:download") ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
              Download combined PDF
            </button>
            <button
              type="button"
              disabled={busy !== null}
              onClick={() => handleGenerate("combined", "profile")}
              className={btnPrimary}
            >
              {isBusy("combined:profile") ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
              Add combined PDF to profile
            </button>
          </div>
        </section>

        {otherGroups.length > 0 && (
          <section className="rounded-2xl border border-border bg-card p-4">
            <h2 className="font-serif text-lg font-bold text-foreground">Other files on this profile</h2>
            <ul className="mt-2 space-y-3">
              {otherGroups.map(([name, docs]) => (
                <li key={name}>
                  <p className="text-sm font-semibold text-foreground">{name}</p>
                  <ul className="mt-1 space-y-1">
                    {docs.map((d) => (
                      <li key={d.id} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="min-w-0 flex-1 truncate">{d.name}</span>
                        {d.dataUrl && (
                          <a href={d.dataUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                            Open
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  )
}
