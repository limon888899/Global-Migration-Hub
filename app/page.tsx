import { SiteHeader } from "@/components/site-header"
import { Hero } from "@/components/hero"
import { WorkPermitServices } from "@/components/work-permit-services"
import { CountriesSection } from "@/components/countries-section"
import { ImmigrationNews } from "@/components/immigration-news"
import { ContactSection } from "@/components/contact-section"
import { SiteFooter } from "@/components/site-footer"
import { VisaStatusModalProvider } from "@/components/visa-status-modal"
import { ApplicationModalProvider } from "@/components/application-modal"

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Global Migration Hub",
    description:
      "Expert work permit services, immigration news, and a secure client portal to track your visa status.",
    areaServed: "Worldwide",
    serviceType: "Immigration Consultancy",
    telephone: "+1-555-018-2290",
    email: "hello@globalmigrationhub.com",
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <VisaStatusModalProvider>
        <ApplicationModalProvider>
          <SiteHeader />
          <main>
            <Hero />
            <WorkPermitServices />
            <CountriesSection />
            <ImmigrationNews />
            <ContactSection />
          </main>
          <SiteFooter />
        </ApplicationModalProvider>
      </VisaStatusModalProvider>
    </>
  )
}
