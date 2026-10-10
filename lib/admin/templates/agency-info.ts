/**
 * Agency details used by every generated document (header, agreement parties, contact lines).
 * Edit them here ONCE and all templates update. Use only your agency's real, current details.
 */
export const AGENCY = {
  name: "Global Migration Hub",
  registrationTitle: "Registered Migration Agent",
  agentName: "Andrew John Kerr",
  marn: "1069227",
  address: "Level 15, 100 Queen Street, Melbourne, VIC 3000, Australia",
  contactEmail: "info@globalmigrationhub.com",
  supportEmail: "support@globalmigrationhub.com",
  /** Optional full-page A4 background, placed in /public/templates/ (skipped if the file is missing). */
  letterheadPath: "/templates/letterhead.png",
  /** Small logo used in the default header when no letterhead exists. */
  logoPath: "/favicon-192x192.png",
} as const
