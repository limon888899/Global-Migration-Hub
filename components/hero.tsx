"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ALL_COUNTRIES, VISA_TYPES } from "@/lib/countries"

const trustItems = ["Fast Processing", "Secure Process", "24/7 Support"]

const stats = [
  { value: `${ALL_COUNTRIES.length}+`, label: "Countries Supported" },
  { value: `${VISA_TYPES.length}`, label: "Visa Categories" },
  { value: "24/7", label: "Advisor Support" },
]

export function Hero() {
  const [mounted, setMounted] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section id="top" className="relative overflow-hidden text-primary-foreground">
      <Image
        src="/images/hero-plane.webp"
        alt="A private jet flying above the clouds"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-[oklch(0.15_0.03_264)]/95 via-[oklch(0.32_0.1_258)]/85 to-[oklch(0.585_0.18_254.5)]/85"
      />
      <div ref={contentRef} className={`relative z-10 mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 sm:py-28 transition-all duration-1000 ${mounted ? "opacity-100" : "opacity-0"}`}>
        <span className={`inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-1.5 text-xs font-medium backdrop-blur transition-all duration-700 ${mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
          <ShieldCheck className="size-4" aria-hidden="true" />
          Licensed Immigration & Visa Consultancy
        </span>

        <h1 className={`mt-6 text-balance font-serif text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{ transitionDelay: "100ms" }}>
          Your Trusted Global Partner for Seamless Visa &amp; Immigration Excellence
        </h1>

        <p className={`mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-primary-foreground/80 sm:text-lg transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{ transitionDelay: "200ms" }}>
          From work permits to permanent residency, Global Migration Hub guides
          individuals and businesses through every step of the visa process with
          clarity, speed, and complete transparency.
        </p>

        <div className={`mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{ transitionDelay: "300ms" }}>
          <Button
            asChild
            size="lg"
            className="h-12 w-full gap-2 rounded-full bg-accent px-7 text-base text-accent-foreground hover:bg-accent/90 sm:w-auto"
          >
            <Link href="/apply">
              Start Application
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
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

        <ul className={`mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t border-primary-foreground/15 pt-8 transition-all duration-700 ${mounted ? "opacity-100" : "opacity-0"}`} style={{ transitionDelay: "400ms" }}>
          {trustItems.map((item, idx) => (
            <li key={item} className={`flex items-center gap-2 text-sm text-primary-foreground/85 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`} style={{ transitionDelay: `${400 + idx * 50}ms` }}>
              <CheckCircle2 className="size-4 text-primary-foreground" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>

        <dl className={`mt-10 grid grid-cols-3 gap-4 border-t border-primary-foreground/15 pt-8 sm:gap-8 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{ transitionDelay: "500ms" }}>
          {stats.map((stat, idx) => (
            <div key={stat.label} className={`transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`} style={{ transitionDelay: `${500 + idx * 50}ms` }}>
              <dt className="sr-only">{stat.label}</dt>
              <dd className="font-serif text-2xl font-semibold sm:text-3xl">{stat.value}</dd>
              <p className="mt-1 text-xs text-primary-foreground/70 sm:text-sm">{stat.label}</p>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
