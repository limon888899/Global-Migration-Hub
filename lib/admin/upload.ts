/**
 * Uploads a file to Vercel Blob storage via our own API route and returns
 * the public URL. We deliberately do NOT embed file contents (base64) into
 * the application JSON stored in Redis anymore — that used to blow past
 * Vercel's ~4.5MB request/response body limit once a handful of documents
 * piled up, causing uploads to silently fail. Now Redis only ever stores
 * small URLs, no matter how many documents are attached.
 */
export async function uploadAdminFile(file: File): Promise<string> {
  const formData = new FormData()
  formData.append("file", file)

  const res = await fetch("/api/admin/upload", {
    method: "POST",
    body: formData,
  })

  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new Error(body?.error || `Upload failed (${res.status})`)
  }

  const data = (await res.json()) as { url: string }
  return data.url
}
