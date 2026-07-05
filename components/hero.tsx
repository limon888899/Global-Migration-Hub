"use client"

import { ArrowRight, ShieldCheck, Clock, Award } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useVisaStatusModal } from "@/components/visa-status-modal"

const stats = [
  { value: "25k+", label: "Visas processed" },
  { value: "60+", label: "Countries served" },
  { value: "98%", label: "Approval rate" },
]

export function Hero() {
  const { open } = useVisaStatusModal()

  return (
    <section id="top" className="relative overflow-hidden bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:px-8 lg:py-24">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-1 text-xs font-medium">
            <ShieldCheck className="size-4 text-accent" aria-hidden="true" />
            Licensed & regulated immigration advisors
          </span>

          <h1 className="mt-6 text-balance font-serif text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
            Your trusted partner for global immigration
          </h1>

          <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-primary-foreground/80 sm:text-lg">
            From work permits to permanent residency, Global Migration Hub guides
            individuals and businesses through every step of the visa process with
            clarity, speed, and complete transparency.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              type="button"
              size="lg"
              onClick={() => open()}
              className="h-12 gap-2 px-7 text-base bg-accent text-accent-foreground hover:bg-accent/90"
            >
              Check Visa Status
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
            <a
              href="#services"
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "h-12 px-7 text-base border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground",
              )}
            >
              Explore Services
            </a>
          </div>

          <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-primary-foreground/15 pt-8">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block font-serif text-2xl font-semibold sm:text-3xl">
                    {stat.value}
                  </span>
                  <span className="mt-1 block text-xs text-primary-foreground/70 sm:text-sm">
                    {stat.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-2xl border border-primary-foreground/15 shadow-2xl">
            <img
              src="/images/hero-immigration.png"
              alt="Immigration consultants advising clients in a modern office"
              className="h-full w-full object-cover"
              width={720}
              height={560}
            />
          </div>
          <div className="absolute -bottom-5 left-4 right-4 flex items-center justify-between gap-3 rounded-xl border border-border bg-background px-4 py-3 text-foreground shadow-lg sm:left-6 sm:right-auto sm:gap-6">
            <div className="flex items-center gap-2">
              <Clock className="size-5 text-primary" aria-hidden="true" />
              <span className="text-sm font-medium">Fast processing</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="size-5 text-primary" aria-hidden="true" />
              <span className="text-sm font-medium">Expert advisors</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
