import Link from "next/link"
import { Globe } from "lucide-react"

const columns = [
  {
    heading: "Services",
    links: [
      { label: "Skilled Worker Visas", href: "#services" },
      { label: "Employer Sponsorship", href: "#services" },
      { label: "Family Permits", href: "#services" },
      { label: "Compliance & Renewals", href: "#services" },
    ],
  },
  {
    heading: "Tools",
    links: [
      { label: "PR Points Calculator", href: "/calculator" },
      { label: "Track Your Application", href: "/track" },
      { label: "Biometric Appointment", href: "/biometric" },
      { label: "Apply Now", href: "/apply" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Us", href: "#top" },
      { label: "Our Advisors", href: "#top" },
      { label: "Immigration News", href: "#news" },
      { label: "Contact", href: "#contact" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "Client Portal", href: "/track" },
      { label: "Contact", href: "#contact" },
      { label: "Privacy Policy", href: "#top" },
      { label: "Terms of Service", href: "#top" },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Globe className="size-5" aria-hidden="true" />
              </span>
              <span className="font-serif text-lg font-semibold text-foreground">
                Global Migration Hub
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Licensed immigration advisors helping individuals and businesses move
              across borders with confidence.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.heading}>
              <h3 className="text-sm font-semibold text-foreground">{col.heading}</h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("/") ? (
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-primary"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-primary"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Global Migration Hub. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Regulated by the Office of the Immigration Services Commissioner.
          </p>
        </div>
      </div>
    </footer>
  )
}
