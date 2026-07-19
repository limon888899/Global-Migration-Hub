export type AppointmentStatus = "booked" | "verified" | "completed" | "cancelled"

export interface BiometricCenter {
  id: string
  name: string
  city: string
  address: string
}

export interface BiometricAppointment {
  id: string
  fullName: string
  passportNumber: string
  phone: string
  email: string
  centerId: string
  centerName: string
  date: string // YYYY-MM-DD
  time: string // HH:mm
  status: AppointmentStatus
  webauthnVerified: boolean
  webauthnCredentialId?: string
  webauthnPublicKey?: string
  webauthnCounter?: number
  verifiedAt?: string
  pendingChallenge?: string
  createdAt: string
}
