"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ChevronDown, ChevronUp, Globe2 } from "lucide-react"
import { DESTINATION_COUNTRIES, OTHER_COUNTRIES, ALL_COUNTRIES, COUNTRY_FLAGS } from "@/lib/countries"

// Scroll animation hook
function useScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return { ref, isVisible }
}

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
  France: {
    visaTypes: "Talent Passport · Student · Work",
    image: "/images/countries/France.png",
    alt: "The Eiffel Tower in Paris",
  },
  Italy: {
    visaTypes: "Work Visa · Student · Elective Residency",
    image: "/images/countries/Italy.png",
    alt: "A scenic view of an Italian city",
  },
  Netherlands: {
    visaTypes: "Highly Skilled Migrant · Student · Orientation Year",
    image: "/images/countries/Netherlands.png",
    alt: "Canals and traditional houses in the Netherlands",
  },
  Sweden: {
    visaTypes: "Work Permit · Student · Family",
    image: "/images/countries/Sweden.png",
    alt: "A scenic view of a city in Sweden",
  },
  Portugal: {
    visaTypes: "D7 Visa · Golden Visa · Student",
    image: "/images/countries/Portugal.png",
    alt: "A scenic coastal view in Portugal",
  },
  Ireland: {
    visaTypes: "Critical Skills · Student · Work Permit",
    image: "/images/countries/Ireland.png",
    alt: "A scenic view of the Irish countryside",
  },
  "New Zealand": {
    visaTypes: "Skilled Migrant · Work · Student",
    image: "/images/countries/New Zealand.png",
    alt: "A scenic landscape view in New Zealand",
  },
  Japan: {
    visaTypes: "Engineer/Specialist · Student · Work",
    image: "/images/countries/Japan.png",
    alt: "A scenic view of a landmark in Japan",
  },
  "South Korea": {
    visaTypes: "E-7 Work Visa · Student · Skilled Worker",
    image: "/images/countries/South Korea.png",
    alt: "A scenic view of a landmark in South Korea",
  },
  Singapore: {
    visaTypes: "Employment Pass · Student · S Pass",
    image: "/images/countries/Singapore.png",
    alt: "The Singapore skyline",
  },
  "Saudi Arabia": {
    visaTypes: "Work Visa · Premium Residency · Business",
    image: "/images/countries/Saudi Arabia.png",
    alt: "A scenic view of a landmark in Saudi Arabia",
  },
  Malaysia: {
    visaTypes: "Employment Pass · Student · MM2H",
    image: "/images/countries/Malaysia.png",
    alt: "A scenic view of a landmark in Malaysia",
  },
  Qatar: {
    visaTypes: "Employment Pass · Student · Business",
    image: "/images/countries/Qatar.png",
    alt: "A scenic view of a landmark in Qatar",
  },
  Spain: {
    visaTypes: "Employment Pass · Student · MM2H",
    image: "/images/countries/Spain.png",
    alt: "A scenic view of a landmark in Spain",
  },
  Bangladesh: {
    visaTypes: "Work Visa · Study Visa · Tourist",
    image: "/images/countries/Bangladesh.png",
    alt: "A scenic view of a landmark in Bangladesh",
  },
  India: {
    visaTypes: "Work Visa · Student · Medical",
    image: "/images/countries/India.png",
    alt: "A scenic view of a landmark in India",
  },
  Pakistan: {
    visaTypes: "Work Visa · Student · Family",
    image: "/images/countries/Pakistan.png",
    alt: "A scenic view of a landmark in Pakistan",
  },
  Nepal: {
    visaTypes: "Work Visa · Student · Tourist",
    image: "/images/countries/Nepal.png",
    alt: "A scenic view of a landmark in Nepal",
  },
  "Sri Lanka": {
    visaTypes: "Work Visa · Student · Tourist",
    image: "/images/countries/Sri Lanka.png",
    alt: "A scenic view of a landmark in Sri Lanka",
  },
  Philippines: {
    visaTypes: "Work Visa · Student · Professional",
    image: "/images/countries/Philippines.png",
    alt: "A scenic view of a landmark in Philippines",
  },
  Indonesia: {
    visaTypes: "Work Visa · Business · Family",
    image: "/images/countries/Indonesia.png",
    alt: "A scenic view of a landmark in Indonesia",
  },
  Thailand: {
    visaTypes: "Elite Visa · Student · Work",
    image: "/images/countries/Thailand.png",
    alt: "A scenic view of a landmark in Thailand",
  },
  Vietnam: {
    visaTypes: "Work Visa · Business · Student",
    image: "/images/countries/Vietnam.png",
    alt: "A scenic view of a landmark in Vietnam",
  },
  China: {
    visaTypes: "Work Visa · Student · Family",
    image: "/images/countries/China.png",
    alt: "A scenic view of a landmark in China",
  },
  Turkey: {
    visaTypes: "Residence Permit · Work Visa · Student",
    image: "/images/countries/Turkey.png",
    alt: "A scenic view of a landmark in Turkey",
  },
  Nigeria: {
    visaTypes: "Work Visa · Business · Family",
    image: "/images/countries/Nigeria.png",
    alt: "A scenic view of a landmark in Nigeria",
  },
  Kenya: {
    visaTypes: "Work Visa · Business · Tourist",
    image: "/images/countries/Kenya.png",
    alt: "A scenic view of a landmark in Kenya",
  },
  Egypt: {
    visaTypes: "Work Visa · Business · Student",
    image: "/images/countries/Egypt.png",
    alt: "A scenic view of a landmark in Egypt",
  },
  Jordan: {
    visaTypes: "Work Visa · Residence · Business",
    image: "/images/countries/Jordan.png",
    alt: "A scenic view of a landmark in Jordan",
  },
  Lebanon: {
    visaTypes: "Residence Permit · Work Visa · Student",
    image: "/images/countries/Lebanon.png",
    alt: "A scenic view of a landmark in Lebanon",
  },
  Brazil: {
    visaTypes: "Work Visa · Investor · Digital Nomad",
    image: "/images/countries/Brazil.png",
    alt: "A scenic view of a landmark in Brazil",
  },
  Mexico: {
    visaTypes: "Temporary Resident · Business · Student",
    image: "/images/countries/Mexico.png",
    alt: "A scenic view of a landmark in Mexico",
  },
  Argentina: {
    visaTypes: "Temporary Resident · Student · Investor",
    image: "/images/countries/Argentina.png",
    alt: "A scenic view of a landmark in Argentina",
  },
  Switzerland: {
    visaTypes: "Work Permit · Student · Family",
    image: "/images/countries/Switzerland.png",
    alt: "A scenic view of a landmark in Switzerland",
  },
  Belgium: {
    visaTypes: "Highly Skilled Worker · Student · Family",
    image: "/images/countries/Belgium.png",
    alt: "A scenic view of a landmark in Belgium",
  },
  Norway: {
    visaTypes: "Work Permit · Student · Family",
    image: "/images/countries/Norway.png",
    alt: "A scenic view of a landmark in Norway",
  },
  Denmark: {
    visaTypes: "Work Permit · Student · Start-up",
    image: "/images/countries/Denmark.png",
    alt: "A scenic view of a landmark in Denmark",
  },
  Finland: {
    visaTypes: "Residence Permit · Student · Work",
    image: "/images/countries/Finland.png",
    alt: "A scenic view of a landmark in Finland",
  },
  Austria: {
    visaTypes: "Red-White-Red Card · Student · Family",
    image: "/images/countries/Austria.png",
    alt: "A scenic view of a landmark in Austria",
  },
  Poland: {
    visaTypes: "Work Visa · Student · Family",
    image: "/images/countries/Poland.png",
    alt: "A scenic view of a landmark in Poland",
  },
  Greece: {
    visaTypes: "Residence Permit · Work Visa · Student",
    image: "/images/countries/Greece.png",
    alt: "A scenic view of a landmark in Greece",
  },
  Russia: {
    visaTypes: "Work Visa · Business · Family",
    image: "/images/countries/Russia.png",
    alt: "A scenic view of a landmark in Russia",
  },
  "South Africa": {
    visaTypes: "Work Permit · Student · Residence",
    image: "/images/countries/South Africa.png",
    alt: "A scenic view of a landmark in South Africa",
  },
  Kuwait: {
    visaTypes: "Work Visa · Business · Professional",
    image: "/images/countries/Kuwait.png",
    alt: "A scenic view of a landmark in Kuwait",
  },
  Bahrain: {
    visaTypes: "Work Visa · Business · Residence",
    image: "/images/countries/Bahrain.png",
    alt: "A scenic view of a landmark in Bahrain",
  },
  Oman: {
    visaTypes: "Work Visa · Residence · Business",
    image: "/images/countries/Oman.png",
    alt: "A scenic view of a landmark in Oman",
  },
  Romania: {
    visaTypes: "Work Permit · Student · EU Card",
    image: "/images/countries/Romania.png",
    alt: "A scenic view of a landmark in Romania",
  },
  Bulgaria: {
    visaTypes: "Work Permit · Student · EU Card",
    image: "/images/countries/Bulgaria.png",
    alt: "A scenic view of a landmark in Bulgaria",
  },
  Croatia: {
    visaTypes: "Work Permit · Student · EU Card",
    image: "/images/countries/Croatia.png",
    alt: "A scenic view of a landmark in Croatia",
  },
}

const countries = DESTINATION_COUNTRIES.map((name) => ({
  name,
  ...countryDetails[name],
}))

const popularCountries = DESTINATION_COUNTRIES.map((name) => ({
  name,
  ...countryDetails[name],
}))

const otherCountriesData = OTHER_COUNTRIES.map((name) => ({
  name,
  ...countryDetails[name],
}))

export function CountriesSection() {
  const [showOther, setShowOther] = useState(false)
  const { ref: sectionRef, isVisible } = useScrollAnimation()
  const { ref: otherRef, isVisible: otherVisible } = useScrollAnimation()

  return (
    <section id="countries" className="scroll-mt-20 bg-background py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Popular Destinations Header */}
        <div ref={sectionRef} className="mx-auto max-w-2xl text-center">
          <span className={`text-sm font-semibold uppercase tracking-wider text-accent-foreground transition-all duration-700 ${isVisible ? "opacity-100" : "opacity-0"}`}>
            Where we work
          </span>
          <h2 className={`mt-3 text-balance font-serif text-3xl font-semibold text-foreground sm:text-4xl transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            Popular Destinations
          </h2>
          <p className={`mt-4 text-pretty text-base leading-relaxed text-muted-foreground transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            Explore visa pathways across our most requested destinations. Our
            advisors guide you through every step of your relocation.
          </p>
        </div>

        {/* Popular Countries Grid */}
        <div className={`mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 transition-all duration-700 ${isVisible ? "opacity-100" : "opacity-0"}`}>
          {popularCountries.map((country, idx) => (
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
                <Link
                  href={`/track?country=${encodeURIComponent(country.name)}`}
                  className="inline-flex w-fit items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
                  aria-label={`Enquire now about visas for ${country.name}`}
                >
                  Enquire Now
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Other Countries Section */}
        <div ref={otherRef} className="mt-16">
          <div className={`mx-auto max-w-2xl text-center transition-all duration-700 ${otherVisible ? "opacity-100" : "opacity-0"}`}>
            <h3 className="text-balance font-serif text-2xl font-semibold text-foreground sm:text-3xl">
              Other Countries
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              We also help with visa applications for these destinations
            </p>
          </div>

          <div className={`mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 transition-all duration-700 ${otherVisible ? "opacity-100" : "opacity-0"}`}>
            {otherCountriesData.map((country) => (
              <article
                key={country.name}
                className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-2xl shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
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
                    <h4 className="text-balance font-serif text-xl font-bold text-primary-foreground sm:text-2xl">
                      {country.name}
                    </h4>
                    <p className="mt-1.5 text-xs font-medium text-primary-foreground/80">
                      {country.visaTypes}
                    </p>
                  </div>
                  <Link
                    href={`/track?country=${encodeURIComponent(country.name)}`}
                    className="inline-flex w-fit items-center gap-2 rounded-lg bg-accent px-4 py-2 text-xs font-semibold text-accent-foreground transition-colors hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
                    aria-label={`Enquire now about visas for ${country.name}`}
                  >
                    Enquire Now
                    <ArrowRight className="size-3" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={() => setShowOther((v) => !v)}
              aria-expanded={showOther}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/40 px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
            >
              <Globe2 className="size-4" aria-hidden="true" />
              {showOther ? "Show Less Countries" : "Show More Countries"}
              {showOther ? (
                <ChevronUp className="size-4" aria-hidden="true" />
              ) : (
                <ChevronDown className="size-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
