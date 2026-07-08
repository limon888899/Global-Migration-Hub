"use client"

import { ArrowRight, ShieldCheck, CheckCircle2, Plane } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useVisaStatusModal } from "@/components/visa-status-modal"

const trustItems = ["Fast Processing", "Secure Process", "24/7 Support"]

const heroBackground = {
  backgroundImage:
    "radial-gradient(120% 60% at 50% -10%, rgba(139,92,246,0.35), transparent 60%), " +
    "repeating-linear-gradient(100deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 2px, transparent 2px, transparent 40px), " +
    "linear-gradient(180deg, #0b0518 0%, #2e1065 45%, #4c1d95 100%)",
}

export function Hero() {
  const { open } = useVisaStatusModal()

  return (
    <section id="top" className="relative overflow-hidden text-primary-foreground" style={heroBackground}>
      <Plane
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 size-[38rem] -translate-x-1/2 -translate-y-1/2 rotate-45 text-primary-foreground/[0.07] sm:size-[46rem] lg:size-[54rem]"
        aria-hidden="true"
        strokeWidth={1}
      />
      <div className="relative z-10 mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 sm:py-28">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-1.5 text-xs font-medium backdrop-blur">
          <ShieldCheck className="size-4" aria-hidden="true" />
          Licensed &amp; regulated immigration advisors
        </span>

        <h1 className="mt-6 text-balance font-serif text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
          Your trusted partner for global immigration
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-primary-foreground/80 sm:text-lg">
          From work permits to permanent residency, Global Migration Hub guides
          individuals and businesses through every step of the visa process with
          clarity, speed, and complete transparency.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            type="button"
            size="lg"
            onClick={open}
            className="h-12 w-full gap-2 rounded-full bg-accent px-7 text-base text-accent-foreground hover:bg-accent/90 sm:w-auto"
          >
            Check Visa Status
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
          <a
            href="#services"
            className={cn(
              buttonVariants({ size: "lg", variant: "outline" }),
              "h-12 w-full rounded-full border-primary-foreground/30 bg-transparent px-7 text-base text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground sm:w-auto",
            )}
          >
            Explore Services
          </a>
        </div>

        <ul className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t border-primary-foreground/15 pt-8">
          {trustItems.map((item) => (
            <li key={item} className="flex items-center gap-2 text-sm text-primary-foreground/85">
              <CheckCircle2 className="size-4 text-primary-foreground" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
