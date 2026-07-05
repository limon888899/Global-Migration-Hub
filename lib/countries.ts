export const DESTINATION_COUNTRIES = [
  "United Kingdom",
  "Canada",
  "Australia",
  "United States",
  "Germany",
  "United Arab Emirates",
] as const

export type DestinationCountry = (typeof DESTINATION_COUNTRIES)[number]
