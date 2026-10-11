import { NextResponse } from "next/server"
import { requireAdminAuth } from "@/lib/admin/require-auth"
import { listPayments } from "@/lib/payments-server"

export const dynamic = "force-dynamic"

/** Admin: all submitted payments, newest first. */
export async function GET(request: Request) {
  const authError = requireAdminAuth(request)
  if (authError) return authError
  return NextResponse.json(await listPayments())
}
