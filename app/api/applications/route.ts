import { NextResponse } from "next/server"
import { getRedis } from "@/lib/admin/redis"
import type { Application, NewApplicationInput } from "@/lib/admin/types"

export const dynamic = "force-dynamic"

const KEY = "gmh:applications"

function validate(input: NewApplicationInput): string | null {
  if (
    !input?.fullName?.trim() ||
    !input?.passportNumber?.trim() ||
    !input?.passportType?.trim() ||
    !input?.dateOfBirth?.trim() ||
    !input?.nationality?.trim() ||
    !input?.email?.trim() ||
    !input?.phone?.trim() ||
    !input?.destinationCountry?.trim() ||
    !input?.visaType?.trim() ||
    !input?.applyingMethod
  ) {
    return "Missing required personal, contact, or visa selection fields."
  }

  if (input.applyingMethod === "agency") {
    if (!input.agencyCountry?.trim() || !input.agencyName?.trim() || !input.agencyReferenceNo?.trim()) {
      return "Missing required agency fields (agency country, agency name, or reference number)."
    }
    return null
  }

  // applyingMethod === "self" — required fields/documents depend on visa type
  const details = input.visaDetails ?? {}
  const hasDocGroup = (groupName: string) =>
    (input.documents ?? []).some((d) => d.groupName === groupName && (d.dataUrl?.trim().length ?? 0) > 0)

  switch (input.visaType) {
    case "Work Permit Visa":
      if (!hasDocGroup("Job Offer Letter") || !hasDocGroup("Police Clearance Certificate")) {
        return "Please upload the Job Offer Letter and Police Clearance Certificate."
      }
      break
    case "Student / Study Visa":
      if (!details.universityName?.trim() || !hasDocGroup("Offer Letter / Admission Letter")) {
        return "Please provide the university name and upload the Offer/Admission Letter."
      }
      break
    case "Tourist / Visit Visa":
      if (!details.purposeOfVisit?.trim() || !hasDocGroup("Hotel Booking / Invitation Letter")) {
        return "Please select a purpose of visit and upload the Hotel Booking / Invitation Letter."
      }
      break
    case "Business Visa":
      if (!details.companyName?.trim() || !hasDocGroup("Trade License / Invitation Letter")) {
        return "Please provide the company name and upload the Trade License / Invitation Letter."
      }
      break
    case "Medical Visa":
      if (!details.hospitalName?.trim() || !hasDocGroup("Medical Invitation / Appointment")) {
        return "Please provide the hospital name and upload the Medical Invitation / Appointment."
      }
      break
    case "Family / Spouse Visa":
      if (!details.sponsorRelationship?.trim() || !hasDocGroup("Relationship Proof")) {
        return "Please provide the sponsor's name/relationship and upload the Relationship Proof."
      }
      break
    // Transit Visa, Permanent Residency, Diplomatic Visa — no extra required fields
    default:
      break
  }

  return null
}

export async function POST(request: Request) {
  const input = (await request.json()) as NewApplicationInput

  const validationError = validate(input)
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 })
  }

  const redis = await getRedis()
  const raw = await redis.get(KEY)
  const apps: Application[] = raw ? JSON.parse(raw) : []

  const newApp: Application = {
    ...input,
    agencyCountry: input.agencyCountry ?? "",
    agencyName: input.agencyName ?? "",
    agencyReferenceNo: input.agencyReferenceNo ?? "",
    nationalId: input.nationalId ?? "",
    visaDetails: input.visaDetails ?? {},
    photoUrl: input.photoUrl ?? "",
    documents: input.documents ?? [],
    id: `app_${Date.now()}`,
    submittedAt: new Date().toISOString(),
    manualStatus: "auto",
    statusNote: "",
    internalNotes: "",
  }

  const updated = [newApp, ...apps]
  await redis.set(KEY, JSON.stringify(updated))

  return NextResponse.json({ ok: true, id: newApp.id }, { status: 201 })
}
