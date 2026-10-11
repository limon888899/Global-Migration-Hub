import { NextResponse } from "next/server"
import { getPaymentMethods } from "@/lib/payments-server"

export const dynamic = "force-dynamic"

/** Public: enabled payment methods that have an account number set by the admin. */
export async function GET() {
  const methods = await getPaymentMethods()
  const visible = methods.filter((m) => m.enabled && m.accountNumber.trim())
  return NextResponse.json(visible)
}
