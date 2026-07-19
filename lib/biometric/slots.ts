import type { BiometricAppointment } from "./types"

export const WORKING_HOURS = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00"]
export const SLOT_CAPACITY = 8
export const CLOSED_WEEKDAYS = [5, 6] // Friday, Saturday (weekend)
export const BOOKING_WINDOW_DAYS = 21

export function getAvailableDates(): string[] {
  const dates: string[] = []
  const today = new Date()
  for (let i = 1; dates.length < BOOKING_WINDOW_DAYS; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() + i)
    if (!CLOSED_WEEKDAYS.includes(d.getDay())) {
      dates.push(d.toISOString().slice(0, 10))
    }
  }
  return dates
}

export function getSlotsForDate(centerId: string, date: string, appointments: BiometricAppointment[]) {
  return WORKING_HOURS.map((time) => {
    const bookedCount = appointments.filter(
      (a) => a.centerId === centerId && a.date === date && a.time === time && a.status !== "cancelled",
    ).length
    return { time, capacity: SLOT_CAPACITY, bookedCount, available: SLOT_CAPACITY - bookedCount }
  })
}
