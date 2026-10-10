import Link from "next/link"
import { BadgeCheck, ExternalLink, Globe2, Lock, Mail, MapPin, Phone, ShieldCheck } from "lucide-react"

const columns = [
  {
    heading: "Our Services",
    links: [
      { label: "Work Permits & Visas", href: "/#services" },
      { label: "Destination Countries", href: "/#countries" },
      { label: "PR Points Calculator", href: "/calculator" },
      { label: "Immigration News", href: "/#news" },
    ],
  },
  {
    heading: "Client Portal",
    links: [
      { label: "Apply Now", href: "/apply" },
      { label: "Track Your Application", href: "/track" },
      { label: "Biometric Appointment", href: "/biometric" },
      { label: "Contact Us", href: "/#contact" },
    ],
  },
]

const trustPoints = [
  { icon: ShieldCheck, label: "Confidential consultations" },
  { icon: Lock, label: "Secure client portal" },
  { icon: Globe2, label: "Worldwide visa services" },
]

// Details as shown on the official OMARA Register of Migration Agents
const registration = [
  { label: "Name on the register", value: "Andrew John Kerr" },
  { label: "MARN", value: "1069227" },
  { label: "Status", value: "Registered" },
  { label: "Business on the register", value: "Global Migration Hub, Australia" },
  { label: "Associated business on the register", value: "Cosmos Immigration, Dubai & Canada, UK, and USA" },
]

const OMARA_REGISTER_URL = "https://portal.mara.gov.au/search-the-register-of-migration-agents/"

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex size-11 items-center justify-center overflow-hidden rounded-2xl bg-primary shadow-md shadow-primary/20 ring-1 ring-primary/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/icon.png" alt="Global Migration Hub" className="size-full object-cover" />
              </span>
              <span className="font-serif text-lg font-semibold text-foreground">
                Global Migration Hub
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Registered migration agents helping individuals and businesses move
              across borders with confidence.
            </p>

            <ul className="mt-5 space-y-2.5">
              {trustPoints.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-2.5 text-sm text-foreground">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="size-3.5" aria-hidden="true" />
                  </span>
                  {label}
                </li>
              ))}
            </ul>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.heading}>
              <h3 className="text-sm font-semibold text-foreground">{col.heading}</h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">Contact Us</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                <span>Level 15, 100 Queen Street, Melbourne, VIC 3000, Australia</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                <span className="flex flex-col">
                  <a href="tel:+61468784227" className="transition-colors hover:text-primary">
                    +61 468 784 227
                  </a>
                  <a href="tel:+61468784238" className="transition-colors hover:text-primary">
                    +61 468 784 238
                  </a>
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                <span className="flex min-w-0 flex-col">
                  <a
                    href="mailto:info@globalmigrationhub.com"
                    className="break-all transition-colors hover:text-primary"
                  >
                    info@globalmigrationhub.com
                  </a>
                  <a
                    href="mailto:support@globalmigrationhub.com"
                    className="break-all transition-colors hover:text-primary"
                  >
                    support@globalmigrationhub.com
                  </a>
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Registered migration agent details */}
        <section
          aria-labelledby="registration-heading"
          className="mt-12 rounded-2xl border border-border bg-muted/50 p-5 sm:p-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                <BadgeCheck className="size-5" aria-hidden="true" />
              </span>
              <div>
                <h3 id="registration-heading" className="text-sm font-semibold text-foreground">
                  Registered Migration Agent
                </h3>
                <p className="text-xs text-muted-foreground">
                  Office of the Migration Agents Registration Authority (OMARA), Australia
                </p>
              </div>
            </div>
            <a
              href={OMARA_REGISTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              Verify on the OMARA register
              <ExternalLink className="size-3.5" aria-hidden="true" />
            </a>
          </div>

          <dl className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
            {registration.map((item) => (
              <div key={item.label}>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {item.label}
                </dt>
                <dd className="mt-1 text-sm font-semibold text-foreground">{item.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="mt-8 border-t border-border pt-6">
          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Global Migration Hub. All rights reserved.
            </p>
            <p className="text-center text-xs text-muted-foreground sm:text-right">
              Registered Migration Agent · MARN 1069227
            </p>
          </div>
          <p className="mt-4 text-center text-xs leading-relaxed text-muted-foreground sm:text-left">
            Visa and immigration decisions are made solely by the relevant government authority.
            Global Migration Hub provides professional guidance and application support, and
            cannot guarantee any visa outcome. Your personal information is handled
            confidentially and is never shared without your consent.
          </p>
        </div>
      </div>
    </footer>
  )
}
