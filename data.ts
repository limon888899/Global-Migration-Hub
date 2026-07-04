import type { Application, NewApplicationInput } from "./types"

const STORAGE_KEY = "vl_admin_applications_v1"

function seedApplications(): Application[] {
  const daysAgo = (n: number) => new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString()

  return [
    {
      id: "app_1001",
      fullName: "Rahim Uddin",
      passportNumber: "BN0234871",
      nationality: "Bangladeshi",
      email: "rahim.uddin@example.com",
      phone: "+880 1711-000111",
      destinationCountry: "Canada",
      visaType: "Work Permit",
      travelDate: daysAgo(-30),
      submittedAt: daysAgo(9),
      manualStatus: "auto",
      statusNote: "",
      internalNotes: "",
      documents: [{ id: "doc_1", name: "passport-scan.pdf", addedBy: "applicant", addedAt: daysAgo(9) }],
    },
    {
      id: "app_1002",
      fullName: "Sadia Islam",
      passportNumber: "BN0119452",
      nationality: "Bangladeshi",
      email: "sadia.islam@example.com",
      phone: "+880 1811-222333",
      destinationCountry: "United Kingdom",
      visaType: "Student Visa",
      travelDate: daysAgo(-60),
      submittedAt: daysAgo(3),
      manualStatus: "auto",
      statusNote: "",
      internalNotes: "Waiting on updated bank statement.",
      documents: [{ id: "doc_2", name: "offer-letter.pdf", addedBy: "applicant", addedAt: daysAgo(3) }],
    },
    {
      id: "app_1003",
      fullName: "Tanvir Ahmed",
      passportNumber: "BN0987654",
      nationality: "Bangladeshi",
      email: "tanvir.ahmed@example.com",
      phone: "+880 1911-444555",
      destinationCountry: "United States",
      visaType: "Tourist Visa",
      travelDate: daysAgo(-14),
      submittedAt: daysAgo(20),
      manualStatus: "rejected",
      statusNote: "Missing bank statement — please resubmit with updated documents.",
      internalNotes: "Second attempt, monitor closely.",
      documents: [],
    },
  ]
}

function readAll(): Application[] {
  if (typeof window === "undefined") return []
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    const seeded = seedApplications()
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded))
    return seeded
  }
  try {
    return JSON.parse(raw) as Application[]
  } catch {
    return []
  }
}

function writeAll(apps: Application[]) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(apps))
}

export function getApplications(): Application[] {
  return readAll().sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
}

export function addApplication(input: NewApplicationInput): Application {
  const apps = readAll()
  const newApp: Application = {
    ...input,
    id: `app_${Date.now()}`,
    submittedAt: new Date().toISOString(),
    manualStatus: "auto",
    statusNote: "",
    internalNotes: "",
    documents: [],
  }
  writeAll([newApp, ...apps])
  return newApp
}

export function updateApplication(id: string, patch: Partial<Application>): void {
  const apps = readAll().map((app) => (app.id === id ? { ...app, ...patch } : app))
  writeAll(apps)
}

export function deleteApplication(id: string): void {
  const apps = readAll().filter((app) => app.id !== id)
  writeAll(apps)
}

export function addDocument(id: string, name: string): void {
  const apps = readAll().map((app) => {
    if (app.id !== id) return app
    return {
      ...app,
      documents: [
        ...app.documents,
        { id: `doc_${Date.now()}`, name, addedBy: "admin" as const, addedAt: new Date().toISOString() },
      ],
    }
  })
  writeAll(apps)
}
