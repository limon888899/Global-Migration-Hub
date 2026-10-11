// Shared (client + server) types and helpers for the manual payment system.

export type PaymentMethodType = "mobile" | "bank" | "other"

export const PAYMENT_METHOD_TYPE_LABELS: Record<PaymentMethodType, string> = {
  mobile: "Mobile wallet",
  bank: "Bank",
  other: "Other",
}

/** Special country value: the method is offered to applicants from every country. */
export const ANY_COUNTRY = "All Countries"

export interface PaymentMethod {
  id: string
  /** Country name exactly as in lib/countries.ts (e.g. "Bangladesh"), or ANY_COUNTRY. */
  country: string
  name: string
  type: PaymentMethodType
  /** Wallet number / bank account number the applicant pays to. Editable from the admin panel. */
  accountNumber: string
  /** Account holder name, bank + branch details, etc. */
  accountName: string
  /** Extra instructions shown to the applicant (e.g. "Use Send Money, not Payment"). */
  instructions: string
  enabled: boolean
}

export type PaymentStatus = "pending" | "verified" | "rejected"

export interface PaymentSubmission {
  id: string
  applicationId: string
  applicantName: string
  country: string
  methodId: string
  methodName: string
  /** Snapshot of the number the applicant was told to pay, at submission time. */
  accountNumber: string
  transactionId: string
  senderNumber: string
  amount: string
  status: PaymentStatus
  adminNote: string
  submittedAt: string
  reviewedAt?: string
}

export const PAYMENT_METHODS_KEY = "gmh:payment-methods"
/** Redis hash: field = payment id, value = JSON of PaymentSubmission. */
export const PAYMENTS_KEY = "gmh:payments"
/** Redis string lock per transaction ID so the same ID can never be submitted twice. */
export const PAYMENT_TRX_KEY_PREFIX = "gmh:payment-trx:"

export const MAX_PENDING_PER_APPLICATION = 5

export function normalizeTransactionId(value: string): string {
  return value.trim().toUpperCase().replace(/\s+/g, "")
}

export function isValidTransactionId(normalized: string): boolean {
  return /^[A-Z0-9][A-Z0-9\-_.]{5,39}$/.test(normalized)
}

const METHOD_TYPES: PaymentMethodType[] = ["mobile", "bank", "other"]

function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : ""
}

/**
 * Validates and normalizes a list of payment methods coming from the admin panel.
 * Returns null if the input is not usable (not an array, or a row without a name/country).
 */
export function sanitizeMethods(input: unknown): PaymentMethod[] | null {
  if (!Array.isArray(input) || input.length > 300) return null
  const out: PaymentMethod[] = []
  const seen = new Set<string>()
  for (const raw of input) {
    if (!raw || typeof raw !== "object") return null
    const r = raw as Record<string, unknown>
    const name = clean(r.name, 60)
    const country = clean(r.country, 60)
    if (!name || !country) return null
    let id = clean(r.id, 60)
    if (!id || seen.has(id)) {
      id = `pm_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
    }
    seen.add(id)
    out.push({
      id,
      country,
      name,
      type: METHOD_TYPES.includes(r.type as PaymentMethodType) ? (r.type as PaymentMethodType) : "other",
      accountNumber: clean(r.accountNumber, 120),
      accountName: clean(r.accountName, 160),
      instructions: clean(r.instructions, 500),
      enabled: r.enabled !== false,
    })
  }
  return out
}

function seed(id: string, country: string, name: string, type: PaymentMethodType): PaymentMethod {
  return { id, country, name, type, accountNumber: "", accountName: "", instructions: "", enabled: true }
}

/**
 * Starter list created the first time the system is used. All account numbers are empty,
 * so nothing is shown to applicants until the admin fills in a number.
 */
export function buildDefaultMethods(): PaymentMethod[] {
  return [
    seed("bd-bkash", "Bangladesh", "bKash", "mobile"),
    seed("bd-nagad", "Bangladesh", "Nagad", "mobile"),
    seed("bd-rocket", "Bangladesh", "Rocket", "mobile"),
    seed("bd-upay", "Bangladesh", "Upay", "mobile"),
    seed("bd-bank", "Bangladesh", "Bank Transfer", "bank"),
    seed("in-upi", "India", "UPI", "mobile"),
    seed("in-bank", "India", "Bank Transfer", "bank"),
    seed("pk-jazzcash", "Pakistan", "JazzCash", "mobile"),
    seed("pk-easypaisa", "Pakistan", "Easypaisa", "mobile"),
    seed("pk-bank", "Pakistan", "Bank Transfer", "bank"),
    seed("np-esewa", "Nepal", "eSewa", "mobile"),
    seed("np-khalti", "Nepal", "Khalti", "mobile"),
    seed("np-bank", "Nepal", "Bank Transfer", "bank"),
    seed("lk-bank", "Sri Lanka", "Bank Transfer", "bank"),
    seed("any-bank", ANY_COUNTRY, "International Bank Transfer", "bank"),
  ]
}
