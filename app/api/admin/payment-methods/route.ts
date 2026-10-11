import { NextResponse } from "next/server"
import { requireAdminAuth } from "@/lib/admin/require-auth"
import { getPaymentMethods, savePaymentMethods } from "@/lib/payments-server"
import { sanitizeMethods } from "@/lib/payments"

export const dynamic = "force-dynamic"

/** Admin: every payment method (including disabled ones and ones without a number). */
export async function GET(request: Request) {
  const authError = requireAdminAuth(request)
  if (authError) return authError
  return NextResponse.json(await getPaymentMethods())
}

/** Admin: replace the whole list (add / edit / remove methods and change numbers). */
export async function PUT(request: Request) {
  const authError = requireAdminAuth(request)
  if (authError) return authError

  let body: { methods?: unknown }
  try {
    body = (await request.json()) as { methods?: unknown }
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 })
  }

  const methods = sanitizeMethods(body.methods)
  if (!methods) {
    return NextResponse.json({ error: "Every payment method needs a name and a country." }, { status: 400 })
  }
  await savePaymentMethods(methods)
  return NextResponse.json(methods)
}
