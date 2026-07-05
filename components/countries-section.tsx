"use client"

import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { useVisaStatusModal } from "@/components/visa-status-modal"
import { DESTINATION_COUNTRIES } from "@/lib/countries"

const countryDetails: Record<string, { visaTypes: string; image: string; alt: string }> = {
  "United Kingdom": {
    visaTypes: "Skilled Worker · Student · Family",
    image: "/images/countries/united-kingdom.png",
    alt: "Big Ben and the Houses of Parliament beside the River Thames in London",
  },
  Canada: {
    visaTypes: "Express Entry · Study Permit · PNP",
    image: "/images/countries/canada.png",
    alt: "Turquoise Moraine Lake framed by the Canadian Rockies",
  },
  Australia: {
    visaTypes: "Skilled Independent · Work · Student",
    image: "/images/countries/australia.png",
    alt: "Sydney Opera House and Harbour Bridge at sunset",
  },
  "United States": {
    visaTypes: "H-1B · L-1 · Green Card",
    image: "/images/countries/united-states.png",
    alt: "Statue of Liberty with the Manhattan skyline behind it",
  },
  Germany: {
    visaTypes: "EU Blue Card · Job Seeker · Student",
    image: "/images/countries/germany.png",
    alt: "The Brandenburg Gate in Berlin at golden hour",
  },
  "United Arab Emirates": {
    visaTypes: "Golden Visa · Employment · Investor",
    image: "/images/countries/united-arab-emirates.png",
    alt: "Burj Khalifa and the Dubai skyline at dusk",
  },
}

const countries = DESTINATION_COUNTRIES.map((name) => ({
  name,
  ...countryDetails[name],
}))

export function CountriesSection() {
  const { open } = useVisaStatusModal()

  return (
    <section id="countries" className="scroll-mt-20 bg-background py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-accent-foreground">
            Where we work
          </span>
          <h2 className="mt-3 text-balance font-serif text-3xl font-semibold text-foreground sm:text-4xl">
            Popular Destinations
          </h2>
          <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">
            Explore visa pathways across our most requested destinations. Our
            advisors guide you through every step of your relocation.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {countries.map((country) => (
            <article
              key={country.name}
              className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-2xl shadow-md transition-shadow hover:shadow-xl"
            >
              <Image
                src={country.image || "/placeholder.svg"}
                alt={country.alt}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/50 to-primary/10"
              />

              <div className="relative flex flex-col gap-4 p-6">
                <div>
                  <h3 className="text-balance font-serif text-2xl font-bold text-primary-foreground sm:text-3xl">
                    {country.name}
                  </h3>
                  <p className="mt-1.5 text-sm font-medium text-primary-foreground/80">
                    {country.visaTypes}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => open(country.name)}
                  className="inline-flex w-fit items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
                  aria-label={`Enquire now about visas for ${country.name}`}
                >
                  Enquire Now
                  <ArrowRight className="size-4" aria-hidden="true" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
