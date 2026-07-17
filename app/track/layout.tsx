import type { Viewport } from "next"

// Lock this route to a fixed desktop-width layout on every device. Instead of
// "width=device-width" (which lets phones lay the page out narrow), we tell
// the browser the page is 1280px wide. Phones then auto-scale the whole
// 1280px layout down to fit the screen — so the tracking portal and the
// applicant profile always render as the same desktop design, just visually
// shrunk to fit, instead of reflowing into a separate mobile layout.
export const viewport: Viewport = {
  width: 1280,
  userScalable: false,
  themeColor: "#211735",
}

export default function TrackLayout({ children }: { children: React.ReactNode }) {
  return children
}
