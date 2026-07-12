import { put } from "@vercel/blob"
import { NextResponse } from "next/server"
import { requireAdminAuth } from "@/lib/admin/require-auth"

export const dynamic = "force-dynamic"

const MAX_FILE_BYTES = 4 * 1024 * 1024 // 4 MB per file

export async function POST(request: Request) {
  const authError = requireAdminAuth(request)
  if (authError) return authError

  const form = await request.formData()
  const file = form.get("file")

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 })
  }

  if (file.size > MAX_FILE_BYTES) {
    return NextResponse.json({ error: "File is too large. Please use a file under 4 MB." }, { status: 413 })
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_")

  try {
    const blob = await put(`documents/${Date.now()}-${safeName}`, file, {
      access: "public",
      addRandomSuffix: true,
    })
    return NextResponse.json({ url: blob.url })
  } catch (err) {
    console.error("Blob upload failed", err)
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 })
  }
}
