import type { Application, NewApplicationInput } from "./types"

export async function getApplications(): Promise<Application[]> {
  const res = await fetch("/api/admin/applications", { cache: "no-store" })
  if (!res.ok) return []
  const apps = (await res.json()) as Application[]
  return apps.sort(
    (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
  )
}

export async function addApplication(input: NewApplicationInput): Promise<Application> {
  const res = await fetch("/api/admin/applications", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
  return res.json()
}

export async function updateApplication(
  id: string,
  patch: Partial<Application>,
): Promise<void> {
  await fetch(`/api/admin/applications/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  })
}

export async function deleteApplication(id: string): Promise<void> {
  await fetch(`/api/admin/applications/${id}`, { method: "DELETE" })
}

/**
 * Adds a document to an application, inside the given groupName section.
 * Stores the actual file content (dataUrl) so it displays correctly (not
 * "Pending upload") on the applicant's visa-status lookup page.
 */
export async function addDocument(
  id: string,
  doc: { name: string; dataUrl?: string; groupName: string },
): Promise<void> {
  const apps = await getApplications()
  const app = apps.find((a) => a.id === id)
  if (!app) return
  const documents = [
    ...app.documents,
    {
      id: `doc_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      name: doc.name,
      dataUrl: doc.dataUrl,
      groupName: doc.groupName,
      addedBy: "admin" as const,
      addedAt: new Date().toISOString(),
    },
  ]
  await updateApplication(id, { documents })
}
