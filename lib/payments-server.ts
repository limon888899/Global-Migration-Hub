// Server-only Redis helpers for the manual payment system.
import { getRedis } from "@/lib/admin/redis"
import {
  PAYMENTS_KEY,
  PAYMENT_METHODS_KEY,
  PAYMENT_TRX_KEY_PREFIX,
  buildDefaultMethods,
  type PaymentMethod,
  type PaymentSubmission,
} from "@/lib/payments"

export function trxLockKey(normalizedTrx: string): string {
  return `${PAYMENT_TRX_KEY_PREFIX}${normalizedTrx}`
}

/** Returns the saved payment methods, creating the starter list on first use. */
export async function getPaymentMethods(): Promise<PaymentMethod[]> {
  const redis = await getRedis()
  const raw = await redis.get(PAYMENT_METHODS_KEY)
  if (raw) {
    try {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed as PaymentMethod[]
    } catch {
      // fall through to defaults if the stored value is corrupt
    }
  }
  const defaults = buildDefaultMethods()
  await redis.set(PAYMENT_METHODS_KEY, JSON.stringify(defaults), { NX: true })
  return defaults
}

export async function savePaymentMethods(methods: PaymentMethod[]): Promise<void> {
  const redis = await getRedis()
  await redis.set(PAYMENT_METHODS_KEY, JSON.stringify(methods))
}

export async function listPayments(): Promise<PaymentSubmission[]> {
  const redis = await getRedis()
  const all = await redis.hGetAll(PAYMENTS_KEY)
  const out: PaymentSubmission[] = []
  for (const value of Object.values(all)) {
    try {
      out.push(JSON.parse(value) as PaymentSubmission)
    } catch {
      // skip unreadable entries
    }
  }
  return out.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
}

export async function getPayment(id: string): Promise<PaymentSubmission | null> {
  const redis = await getRedis()
  const raw = await redis.hGet(PAYMENTS_KEY, id)
  if (!raw) return null
  try {
    return JSON.parse(raw) as PaymentSubmission
  } catch {
    return null
  }
}

export async function savePayment(payment: PaymentSubmission): Promise<void> {
  const redis = await getRedis()
  await redis.hSet(PAYMENTS_KEY, payment.id, JSON.stringify(payment))
}

/** Deletes a payment and frees its transaction ID lock. */
export async function deletePayment(payment: PaymentSubmission, normalizedTrx: string): Promise<void> {
  const redis = await getRedis()
  await redis.hDel(PAYMENTS_KEY, payment.id)
  await redis.del(trxLockKey(normalizedTrx))
}
