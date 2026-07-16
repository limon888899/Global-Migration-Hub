import { SiteHeader } from "@/components/site-header"
import { Hero } from "@/components/hero"
import { WorkPermitServices } from "@/components/work-permit-services"
import { CountriesSection } from "@/components/countries-section"
import { ImmigrationNews } from "@/components/immigration-news"
import { ContactSection } from "@/components/contact-section"
import { SiteFooter } from "@/components/site-footer"

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Global Migration Hub",
    description:
      "An official partner of the Department of Home Affairs, delivering global visa application processing and expert work permit services worldwide, backed by real-time immigration news and a secure client tracking portal.",
    areaServed: "Worldwide",
    serviceType: "Global Immigration & Visa Services",
    telephone: "+61-468-784-227",
    email: "info@globalmigrationhub.com",
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />
      <main>
        <Hero />
        <WorkPermitServices />
        <CountriesSection />
        <ImmigrationNews />
        <ContactSection />
      </main>
      <SiteFooter />
    </>
  )
}
