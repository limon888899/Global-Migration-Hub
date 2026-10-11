// Server-only: re-verifies an applicant using the SAME two-factor rule as /api/visa-status
// (admin-selected identifier + date of birth), so payment endpoints can't be used to
// act on someone else's application.
import { getRedis } from "@/lib/admin/redis"
import { getTrackingMethod, type Application } from "@/lib/admin/types"

const APPLICATIONS_KEY = "gmh:applications"

export interface ApplicantCredentials {
  passport?: string
  nationalId?: string
  dob?: string
}

function normalizeDate(value?: string) {
  return (value ?? "").trim().slice(0, 10)
}

export async function findApplicant(credentials: ApplicantCredentials): Promise<Application | null> {
  const passport = credentials.passport?.trim().toUpperCase()
  const nationalId = credentials.nationalId?.trim().toUpperCase()
  const dob = normalizeDate(credentials.dob)
  if ((!passport && !nationalId) || !dob) return null

  const redis = await getRedis()
  const raw = await redis.get(APPLICATIONS_KEY)
  const apps: Application[] = raw ? JSON.parse(raw) : []

  return (
    apps.find((a) => {
      const method = getTrackingMethod(a)
      const identifierMatches =
        method === "passport"
          ? !!passport && a.passportNumber.trim().toUpperCase() === passport
          : !!nationalId && (a.nationalId ?? "").trim().toUpperCase() === nationalId
      if (!identifierMatches) return false
      return normalizeDate(a.dateOfBirth) === dob
    }) ?? null
  )
}
