import { NextResponse } from "next/server"
import { requireAdminAuth } from "@/lib/admin/require-auth"
import { deletePayment, getPayment, savePayment } from "@/lib/payments-server"
import { normalizeTransactionId, type PaymentStatus } from "@/lib/payments"

export const dynamic = "force-dynamic"

const STATUSES: PaymentStatus[] = ["pending", "verified", "rejected"]

/** Admin: verify / reject (or reset) a payment, optionally with a note for the applicant. */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const authError = requireAdminAuth(request)
  if (authError) return authError

  const { id } = await params
  const payment = await getPayment(id)
  if (!payment) return NextResponse.json({ error: "Not found" }, { status: 404 })

  let body: { status?: unknown; adminNote?: unknown }
  try {
    body = (await request.json()) as { status?: unknown; adminNote?: unknown }
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 })
  }

  if (body.status !== undefined) {
    if (!STATUSES.includes(body.status as PaymentStatus)) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 })
    }
    payment.status = body.status as PaymentStatus
    payment.reviewedAt = payment.status === "pending" ? undefined : new Date().toISOString()
  }
  if (typeof body.adminNote === "string") {
    payment.adminNote = body.adminNote.trim().slice(0, 500)
  }

  await savePayment(payment)
  return NextResponse.json(payment)
}

/** Admin: delete a payment record (also frees its transaction ID). */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const authError = requireAdminAuth(request)
  if (authError) return authError

  const { id } = await params
  const payment = await getPayment(id)
  if (!payment) return NextResponse.json({ ok: true })
  await deletePayment(payment, normalizeTransactionId(payment.transactionId))
  return NextResponse.json({ ok: true })
}
