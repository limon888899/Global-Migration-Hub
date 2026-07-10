import { NextResponse } from "next/server"
import { requireAdminAuth } from "@/lib/admin/require-auth"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const authError = requireAdminAuth(request)
  if (authError) return authError
  return NextResponse.json({ ok: true })
}
