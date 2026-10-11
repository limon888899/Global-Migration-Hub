import { NextResponse } from "next/server"
import { getRedis } from "@/lib/admin/redis"
import { findApplicant } from "@/lib/applicant-lookup"
import { getPaymentMethods, listPayments, savePayment, trxLockKey } from "@/lib/payments-server"
import {
  MAX_PENDING_PER_APPLICATION,
  isValidTransactionId,
  normalizeTransactionId,
  type PaymentSubmission,
} from "@/lib/payments"
import { rateLimit } from "@/lib/rate-limit"

export const dynamic = "force-dynamic"

function str(value: unknown): string {
  return typeof value === "string" ? value : ""
}

/** Applicant's own payment submissions. Requires the same ID + date of birth as /track. */
export async function GET(request: Request) {
  const limited = await rateLimit(request, "payment-list", 60, 15 * 60)
  if (limited) return limited

  const { searchParams } = new URL(request.url)
  const app = await findApplicant({
    passport: searchParams.get("passport") ?? undefined,
    nationalId: searchParams.get("nationalId") ?? undefined,
    dob: searchParams.get("dob") ?? undefined,
  })
  if (!app) return NextResponse.json({ error: "not_found" }, { status: 404 })

  const mine = (await listPayments()).filter((p) => p.applicationId === app.id)
  return NextResponse.json(mine)
}

/** Applicant submits a transaction ID for manual verification by the admin. */
export async function POST(request: Request) {
  const limited = await rateLimit(request, "payment-submit", 10, 15 * 60)
  if (limited) return limited

  let body: Record<string, unknown>
  try {
    body = (await request.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 })
  }

  const app = await findApplicant({
    passport: str(body.passport),
    nationalId: str(body.nationalId),
    dob: str(body.dob),
  })
  if (!app) {
    return NextResponse.json({ error: "We could not verify your application. Please reopen your profile." }, { status: 404 })
  }

  const methods = await getPaymentMethods()
  const method = methods.find((m) => m.id === str(body.methodId) && m.enabled && m.accountNumber.trim())
  if (!method) {
    return NextResponse.json({ error: "This payment method is not available right now." }, { status: 400 })
  }

  const trx = normalizeTransactionId(str(body.transactionId))
  if (!isValidTransactionId(trx)) {
    return NextResponse.json(
      { error: "Enter a valid Transaction ID (6-40 letters or numbers)." },
      { status: 400 },
    )
  }

  const existing = (await listPayments()).filter((p) => p.applicationId === app.id)
  if (existing.filter((p) => p.status === "pending").length >= MAX_PENDING_PER_APPLICATION) {
    return NextResponse.json(
      { error: "You already have several payments waiting for verification. Please wait for the review." },
      { status: 429 },
    )
  }

  const id = `pay_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
  const redis = await getRedis()
  // Atomic lock: only the first submission of a given transaction ID succeeds.
  const locked = await redis.set(trxLockKey(trx), id, { NX: true })
  if (!locked) {
    return NextResponse.json({ error: "This Transaction ID has already been submitted." }, { status: 409 })
  }

  const payment: PaymentSubmission = {
    id,
    applicationId: app.id,
    applicantName: app.fullName,
    country: method.country,
    methodId: method.id,
    methodName: method.name,
    accountNumber: method.accountNumber,
    transactionId: trx,
    senderNumber: str(body.senderNumber).trim().slice(0, 40),
    amount: str(body.amount).trim().slice(0, 20),
    status: "pending",
    adminNote: "",
    submittedAt: new Date().toISOString(),
  }

  try {
    await savePayment(payment)
  } catch (err) {
    await redis.del(trxLockKey(trx))
    console.error("Saving payment failed", err)
    return NextResponse.json({ error: "Could not save your payment. Please try again." }, { status: 500 })
  }

  return NextResponse.json(payment, { status: 201 })
}
