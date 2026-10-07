"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { ArrowLeft, Calculator, ChevronDown, ChevronUp, CheckCircle2, AlertCircle, ArrowRight, Info } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"

// ─── Types ──────────────────────────────────────────────────────────────────

type Country = "canada" | "australia"

interface ScoreBreakdown {
  label: string
  score: number
  max: number
  detail: string
}

// ─── Canada CRS Scoring Logic ────────────────────────────────────────────────

interface CanadaInputs {
  age: string
  education: string
  clbFirst: string        // CLB score (listening/reading/writing/speaking best proxy)
  clbSecond: string
  canadianExp: string     // years of Canadian work experience
  foreignExp: string      // years of foreign work experience
  hasJobOffer: string
  hasProvincialNomination: string
  hasSibling: string
  spouseEducation: string
  spouseClb: string
  spouseCanadianExp: string
}

function calcCanadaCRS(i: CanadaInputs, hasSpouse: boolean): { total: number; breakdown: ScoreBreakdown[]; cutoff: number } {
  let total = 0
  const breakdown: ScoreBreakdown[] = []

  // Age
  const ageMap: Record<string, number> = {
    "17": 0, "18": 99, "19": 105, "20": 110, "21": 110, "22": 110, "23": 110, "24": 110,
    "25": 110, "26": 110, "27": 110, "28": 110, "29": 105, "30": 99, "31": 94, "32": 88,
    "33": 83, "34": 77, "35": 72, "36": 66, "37": 61, "38": 55, "39": 50, "40": 39,
    "41": 28, "42": 17, "43": 6, "44": 0,
  }
  const ageKey = parseInt(i.age) >= 44 ? "44" : parseInt(i.age) <= 17 ? "17" : i.age
  const ageScore = ageMap[ageKey] ?? 0
  const maxAge = hasSpouse ? 100 : 110
  const ageActual = Math.min(ageScore, maxAge)
  total += ageActual
  breakdown.push({ label: "Age", score: ageActual, max: maxAge, detail: `${i.age} years` })

  // Education
  const eduMap: Record<string, number> = {
    none: 0, secondary: hasSpouse ? 28 : 30, "one-year": hasSpouse ? 84 : 90,
    "two-year": hasSpouse ? 91 : 98, bachelors: hasSpouse ? 112 : 120,
    two_or_more: hasSpouse ? 119 : 128, masters: hasSpouse ? 126 : 135, phd: hasSpouse ? 140 : 150,
  }
  const eduScore = eduMap[i.education] ?? 0
  total += eduScore
  breakdown.push({ label: "Education", score: eduScore, max: hasSpouse ? 140 : 150, detail: i.education || "Select" })

  // Language (CLB → CRS)
  const clbToCRS = (clb: string): number => {
    const n = parseInt(clb)
    if (n >= 10) return hasSpouse ? 32 : 34
    if (n === 9) return hasSpouse ? 29 : 31
    if (n === 8) return hasSpouse ? 22 : 23
    if (n === 7) return hasSpouse ? 16 : 17
    if (n === 6) return hasSpouse ? 8 : 9
    if (n === 5) return hasSpouse ? 6 : 6
    if (n === 4) return hasSpouse ? 6 : 6
    return 0
  }
  const langScore = clbToCRS(i.clbFirst) * 4 // 4 skills
  const maxLang = hasSpouse ? 128 : 136
  const langActual = Math.min(langScore, maxLang)
  total += langActual
  breakdown.push({ label: "First language (CLB)", score: langActual, max: maxLang, detail: `CLB ${i.clbFirst}` })

  // Second language
  if (i.clbSecond) {
    const lang2Score = Math.min(clbToCRS(i.clbSecond) * 4, hasSpouse ? 20 : 24)
    total += lang2Score
    breakdown.push({ label: "Second language (CLB)", score: lang2Score, max: hasSpouse ? 20 : 24, detail: `CLB ${i.clbSecond}` })
  }

  // Canadian work experience
  const canExpMap: Record<string, number> = { "0": 0, "1": hasSpouse ? 35 : 40, "2": hasSpouse ? 46 : 53, "3": hasSpouse ? 56 : 64, "4": hasSpouse ? 63 : 72, "5+": hasSpouse ? 70 : 80 }
  const canExpScore = canExpMap[i.canadianExp] ?? 0
  total += canExpScore
  breakdown.push({ label: "Canadian work experience", score: canExpScore, max: hasSpouse ? 70 : 80, detail: `${i.canadianExp} years` })

  // Foreign work experience
  const forExpMap: Record<string, number> = { "0": 0, "1-2": 13, "3+": 25 }
  const forExpScore = forExpMap[i.foreignExp] ?? 0
  total += forExpScore
  breakdown.push({ label: "Foreign work experience", score: forExpScore, max: 25, detail: `${i.foreignExp} years` })

  // Job offer
  if (i.hasJobOffer === "yes-noc00") { total += 200; breakdown.push({ label: "Canadian job offer (NOC 00)", score: 200, max: 200, detail: "Yes" }) }
  else if (i.hasJobOffer === "yes-other") { total += 50; breakdown.push({ label: "Canadian job offer (other)", score: 50, max: 200, detail: "Yes" }) }

  // Provincial nomination
  if (i.hasProvincialNomination === "yes") { total += 600; breakdown.push({ label: "Provincial Nomination", score: 600, max: 600, detail: "Yes — near-certain ITA" }) }

  // Sibling in Canada
  if (i.hasSibling === "yes") { total += 15; breakdown.push({ label: "Sibling in Canada", score: 15, max: 15, detail: "Yes" }) }

  // Spouse factors
  if (hasSpouse) {
    const spouseEduMap: Record<string, number> = { none: 0, secondary: 2, "one-year": 6, "two-year": 7, bachelors: 8, two_or_more: 9, masters: 10, phd: 10 }
    const spouseEduScore = spouseEduMap[i.spouseEducation] ?? 0
    total += spouseEduScore
    breakdown.push({ label: "Spouse education", score: spouseEduScore, max: 10, detail: i.spouseEducation })

    const spouseLangScore = Math.min(clbToCRS(i.spouseClb) * 4, 20)
    total += spouseLangScore
    breakdown.push({ label: "Spouse language (CLB)", score: spouseLangScore, max: 20, detail: `CLB ${i.spouseClb}` })

    const spouseCanExpMap: Record<string, number> = { "0": 0, "1": 5, "2": 7, "3": 8, "4": 9, "5+": 10 }
    const spouseCanExpScore = spouseCanExpMap[i.spouseCanadianExp] ?? 0
    total += spouseCanExpScore
    breakdown.push({ label: "Spouse Canadian experience", score: spouseCanExpScore, max: 10, detail: `${i.spouseCanadianExp} years` })
  }

  return { total, breakdown, cutoff: 491 } // ~recent average cutoff
}

// ─── Australia Points Test ───────────────────────────────────────────────────

interface AustraliaInputs {
  age: string
  education: string
  englishLevel: string
  australianExp: string
  overseasExp: string
  australianStudy: string
  partnerSkills: string
  regionalStudy: string
  professionalYear: string
  communityLanguage: string
  educationInRegional: string
}

function calcAustraliaPoints(i: AustraliaInputs): { total: number; breakdown: ScoreBreakdown[]; cutoff: number } {
  let total = 0
  const breakdown: ScoreBreakdown[] = []

  // Age
  const ageScoreMap: Record<string, number> = { "18-24": 25, "25-32": 30, "33-39": 25, "40-44": 15, "45-49": 0 }
  const ageScore = ageScoreMap[i.age] ?? 0
  total += ageScore
  breakdown.push({ label: "Age", score: ageScore, max: 30, detail: `${i.age} years` })

  // English
  const engMap: Record<string, number> = { "competent": 0, "proficient": 10, "superior": 20 }
  const engScore = engMap[i.englishLevel] ?? 0
  total += engScore
  breakdown.push({ label: "English proficiency", score: engScore, max: 20, detail: i.englishLevel })

  // Overseas qual
  const eduMap: Record<string, number> = { none: 0, diploma: 10, bachelors: 15, phd: 20 }
  const eduScore = eduMap[i.education] ?? 0
  total += eduScore
  breakdown.push({ label: "Education", score: eduScore, max: 20, detail: i.education })

  // Australian skilled employment
  const auExpMap: Record<string, number> = { "0": 0, "1-2": 5, "3-4": 10, "5-7": 15, "8+": 20 }
  const auExpScore = auExpMap[i.australianExp] ?? 0
  total += auExpScore
  breakdown.push({ label: "Australian work experience", score: auExpScore, max: 20, detail: `${i.australianExp} years` })

  // Overseas employment
  const ovExpMap: Record<string, number> = { "0": 0, "3-4": 5, "5-7": 10, "8+": 15 }
  const ovExpScore = ovExpMap[i.overseasExp] ?? 0
  total += ovExpScore
  breakdown.push({ label: "Foreign work experience", score: ovExpScore, max: 15, detail: `${i.overseasExp} years` })

  // Australian study
  if (i.australianStudy === "yes") { total += 5; breakdown.push({ label: "Australian study (≥2 years)", score: 5, max: 5, detail: "Yes" }) }

  // Partner skills
  const partnerMap: Record<string, number> = { none: 0, competent: 5, nominated: 10 }
  const partnerScore = partnerMap[i.partnerSkills] ?? 0
  if (partnerScore > 0) { total += partnerScore; breakdown.push({ label: "Partner skills", score: partnerScore, max: 10, detail: i.partnerSkills }) }

  // Other bonuses
  if (i.regionalStudy === "yes") { total += 5; breakdown.push({ label: "Regional area study", score: 5, max: 5, detail: "Yes" }) }
  if (i.professionalYear === "yes") { total += 5; breakdown.push({ label: "Professional Year", score: 5, max: 5, detail: "Completed" }) }
  if (i.communityLanguage === "yes") { total += 5; breakdown.push({ label: "NAATI Community Language", score: 5, max: 5, detail: "Yes" }) }
  if (i.educationInRegional === "yes") { total += 5; breakdown.push({ label: "Regional area qualification", score: 5, max: 5, detail: "Yes" }) }

  return { total, breakdown, cutoff: 65 }
}

// ─── Reusable field components ────────────────────────────────────────────────

function SelectField({ label, id, value, onChange, options, hint }: {
  label: string; id: string; value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
  hint?: string
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
        {label}
      </label>
      {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
      <select
        id={id}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground shadow-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
      >
        <option value="">— Select —</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )
}

function ScoreBar({ item }: { item: ScoreBreakdown }) {
  const pct = item.max > 0 ? (item.score / item.max) * 100 : 0
  const color = pct >= 70 ? "bg-tip-green" : pct >= 40 ? "bg-tip-yellow" : "bg-destructive/60"
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-secondary/40 px-4 py-3">
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-xs font-medium text-foreground">{item.label}</span>
          <span className="shrink-0 text-xs font-semibold text-foreground">{item.score}<span className="font-normal text-muted-foreground">/{item.max}</span></span>
        </div>
        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
        </div>
        <p className="mt-1 text-[10px] text-muted-foreground">{item.detail}</p>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CalculatorPage() {
  const [country, setCountry] = useState<Country>("canada")
  const [hasSpouse, setHasSpouse] = useState(false)
  const [showSpouse, setShowSpouse] = useState(false)
  const [showBreakdown, setShowBreakdown] = useState(false)

  // Canada
  const [ca, setCa] = useState<CanadaInputs>({
    age: "", education: "", clbFirst: "", clbSecond: "",
    canadianExp: "0", foreignExp: "0",
    hasJobOffer: "no", hasProvincialNomination: "no",
    hasSibling: "no", spouseEducation: "", spouseClb: "0", spouseCanadianExp: "0",
  })

  // Australia
  const [au, setAu] = useState<AustraliaInputs>({
    age: "", education: "", englishLevel: "",
    australianExp: "0", overseasExp: "0",
    australianStudy: "no", partnerSkills: "none",
    regionalStudy: "no", professionalYear: "no",
    communityLanguage: "no", educationInRegional: "no",
  })

  const caResult = useMemo(() => calcCanadaCRS(ca, hasSpouse), [ca, hasSpouse])
  const auResult = useMemo(() => calcAustraliaPoints(au), [au])

  const result = country === "canada" ? caResult : auResult
  const isEligible = result.total >= result.cutoff

  function updateCa(key: keyof CanadaInputs, val: string) {
    setCa(prev => ({ ...prev, [key]: val }))
  }
  function updateAu(key: keyof AustraliaInputs, val: string) {
    setAu(prev => ({ ...prev, [key]: val }))
  }

  const ageLabel = country === "canada"
    ? [18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43].map(n => ({ value: String(n), label: `${n} years` }))
    : [{ value: "18-24", label: "18–24 years" }, { value: "25-32", label: "25–32 years" }, { value: "33-39", label: "33–39 years" }, { value: "40-44", label: "40–44 years" }, { value: "45-49", label: "45–49 years (no points)" }]

  const eduOptions = country === "canada"
    ? [
        { value: "secondary", label: "Secondary / Higher secondary" },
        { value: "one-year", label: "1-year diploma / certificate" },
        { value: "two-year", label: "2-year diploma" },
        { value: "bachelors", label: "Bachelor's degree" },
        { value: "two_or_more", label: "Two or more degrees" },
        { value: "masters", label: "Master's degree" },
        { value: "phd", label: "PhD" },
      ]
    : [
        { value: "diploma", label: "Diploma" },
        { value: "bachelors", label: "Bachelor's degree" },
        { value: "phd", label: "PhD" },
      ]

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-secondary/30">
        {/* Header */}
        <div className="border-b border-border bg-background">
          <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-5 sm:px-6">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
                <ArrowLeft className="size-4" /> Back to home
              </Link>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
          {/* Title */}
          <div className="mb-10 text-center">
            <span className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Calculator className="size-7" aria-hidden="true" />
            </span>
            <h1 className="font-serif text-3xl font-semibold text-foreground sm:text-4xl">
              PR Points Calculator
            </h1>
            <p className="mt-3 text-sm text-muted-foreground max-w-xl mx-auto">
              Canada CRS score or Australia points test — calculate it yourself and find out your chances of PR.
            </p>
          </div>

          {/* Country toggle */}
          <div className="mb-8 flex justify-center">
            <div className="inline-flex rounded-2xl border border-border bg-background p-1 shadow-sm">
              {(["canada", "australia"] as Country[]).map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCountry(c)}
                  className={`flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold transition ${
                    country === c ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span>{c === "canada" ? "🇨🇦" : "🇦🇺"}</span>
                  {c === "canada" ? "Canada CRS" : "Australia Points"}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
            {/* ── Form ── */}
            <div className="space-y-5">

              {/* ── CANADA ── */}
              {country === "canada" && (
                <>
                  <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                    <h2 className="mb-5 font-serif text-lg font-semibold text-foreground">Personal information</h2>

                    {/* Spouse toggle */}
                    <div className="mb-5 flex items-center gap-3 rounded-xl border border-border bg-secondary/50 p-4">
                      <button
                        type="button"
                        onClick={() => setHasSpouse(v => !v)}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${hasSpouse ? "bg-primary" : "bg-muted"}`}
                        role="switch"
                        aria-checked={hasSpouse}
                      >
                        <span className={`pointer-events-none inline-block size-5 rounded-full bg-white shadow-lg transition-transform ${hasSpouse ? "translate-x-5" : "translate-x-0"}`} />
                      </button>
                      <span className="text-sm font-medium text-foreground">Married / have a common-law partner</span>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <SelectField label="Age" id="ca-age" value={ca.age} onChange={v => updateCa("age", v)} options={ageLabel} />
                      <SelectField label="Highest level of education" id="ca-edu" value={ca.education} onChange={v => updateCa("education", v)} options={eduOptions} />
                      <SelectField
                        label="First language CLB score"
                        id="ca-clb1"
                        value={ca.clbFirst}
                        onChange={v => updateCa("clbFirst", v)}
                        hint="IELTS → CLB: 6=7, 7=8, 8=9, 9=10"
                        options={[4,5,6,7,8,9,10].map(n => ({ value: String(n), label: `CLB ${n}` }))}
                      />
                      <SelectField
                        label="Second language CLB (optional)"
                        id="ca-clb2"
                        value={ca.clbSecond}
                        onChange={v => updateCa("clbSecond", v)}
                        options={[{ value: "", label: "None" }, ...[4,5,6,7,8,9,10].map(n => ({ value: String(n), label: `CLB ${n}` }))]}
                      />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                    <h2 className="mb-5 font-serif text-lg font-semibold text-foreground">Work experience</h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <SelectField label="Skilled work experience in Canada" id="ca-canexp" value={ca.canadianExp} onChange={v => updateCa("canadianExp", v)}
                        options={[{ value: "0", label: "None" }, { value: "1", label: "1 year" }, { value: "2", label: "2 years" }, { value: "3", label: "3 years" }, { value: "4", label: "4 years" }, { value: "5+", label: "5+ years" }]} />
                      <SelectField label="Skilled work experience abroad" id="ca-forexp" value={ca.foreignExp} onChange={v => updateCa("foreignExp", v)}
                        options={[{ value: "0", label: "None" }, { value: "1-2", label: "1–2 years" }, { value: "3+", label: "3+ years" }]} />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                    <h2 className="mb-5 font-serif text-lg font-semibold text-foreground">Bonus points</h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <SelectField label="Job offer in Canada" id="ca-job" value={ca.hasJobOffer} onChange={v => updateCa("hasJobOffer", v)}
                        options={[{ value: "no", label: "None" }, { value: "yes-noc00", label: "Yes (NOC TEER 0 — +200)" }, { value: "yes-other", label: "Yes (other — +50)" }]} />
                      <SelectField label="Provincial Nomination" id="ca-pnp" value={ca.hasProvincialNomination} onChange={v => updateCa("hasProvincialNomination", v)}
                        options={[{ value: "no", label: "None" }, { value: "yes", label: "Yes (+600)" }]} />
                      <SelectField label="Sibling in Canada (PR/Citizen)" id="ca-sib" value={ca.hasSibling} onChange={v => updateCa("hasSibling", v)}
                        options={[{ value: "no", label: "None" }, { value: "yes", label: "Yes (+15)" }]} />
                    </div>
                  </div>

                  {/* Spouse section */}
                  {hasSpouse && (
                    <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 shadow-sm">
                      <button
                        type="button"
                        onClick={() => setShowSpouse(v => !v)}
                        className="flex w-full items-center justify-between text-left"
                      >
                        <h2 className="font-serif text-lg font-semibold text-foreground">Spouse / partner information</h2>
                        {showSpouse ? <ChevronUp className="size-5 text-muted-foreground" /> : <ChevronDown className="size-5 text-muted-foreground" />}
                      </button>
                      {showSpouse && (
                        <div className="mt-5 grid gap-4 sm:grid-cols-2">
                          <SelectField label="Spouse's education" id="sp-edu" value={ca.spouseEducation} onChange={v => updateCa("spouseEducation", v)} options={eduOptions} />
                          <SelectField label="Spouse's CLB score" id="sp-clb" value={ca.spouseClb} onChange={v => updateCa("spouseClb", v)}
                            options={[{ value: "0", label: "None / below CLB 4" }, ...[4,5,6,7,8,9,10].map(n => ({ value: String(n), label: `CLB ${n}` }))]} />
                          <SelectField label="Spouse's Canadian work experience" id="sp-exp" value={ca.spouseCanadianExp} onChange={v => updateCa("spouseCanadianExp", v)}
                            options={[{ value: "0", label: "None" }, { value: "1", label: "1 year" }, { value: "2", label: "2 years" }, { value: "3", label: "3 years" }, { value: "4", label: "4 years" }, { value: "5+", label: "5+ years" }]} />
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}

              {/* ── AUSTRALIA ── */}
              {country === "australia" && (
                <>
                  <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                    <h2 className="mb-5 font-serif text-lg font-semibold text-foreground">Personal information</h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <SelectField label="Age" id="au-age" value={au.age} onChange={v => updateAu("age", v)} options={ageLabel} />
                      <SelectField label="Highest overseas qualification" id="au-edu" value={au.education} onChange={v => updateAu("education", v)} options={eduOptions} />
                      <SelectField
                        label="English proficiency"
                        id="au-eng"
                        value={au.englishLevel}
                        onChange={v => updateAu("englishLevel", v)}
                        hint="Proficient = IELTS 7+, Superior = IELTS 8+"
                        options={[
                          { value: "competent", label: "Competent (IELTS 6+)" },
                          { value: "proficient", label: "Proficient (IELTS 7+) +10" },
                          { value: "superior", label: "Superior (IELTS 8+) +20" },
                        ]}
                      />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                    <h2 className="mb-5 font-serif text-lg font-semibold text-foreground">Work experience</h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <SelectField label="Skilled work experience in Australia" id="au-auexp" value={au.australianExp} onChange={v => updateAu("australianExp", v)}
                        options={[{ value: "0", label: "None" }, { value: "1-2", label: "1–2 years (+5)" }, { value: "3-4", label: "3–4 years (+10)" }, { value: "5-7", label: "5–7 years (+15)" }, { value: "8+", label: "8+ years (+20)" }]} />
                      <SelectField label="Skilled work experience abroad" id="au-ovexp" value={au.overseasExp} onChange={v => updateAu("overseasExp", v)}
                        options={[{ value: "0", label: "None" }, { value: "3-4", label: "3–4 years (+5)" }, { value: "5-7", label: "5–7 years (+10)" }, { value: "8+", label: "8+ years (+15)" }]} />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                    <h2 className="mb-5 font-serif text-lg font-semibold text-foreground">Bonus points</h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <SelectField label="Partner skills" id="au-partner" value={au.partnerSkills} onChange={v => updateAu("partnerSkills", v)}
                        options={[{ value: "none", label: "None / not married" }, { value: "competent", label: "Competent English (+5)" }, { value: "nominated", label: "Nominated occupation (+10)" }]} />
                      {[
                        { key: "australianStudy" as const, label: "2+ years of study in Australia (+5)" },
                        { key: "regionalStudy" as const, label: "Study in a regional area (+5)" },
                        { key: "professionalYear" as const, label: "Professional Year completed (+5)" },
                        { key: "communityLanguage" as const, label: "NAATI Community Language (+5)" },
                        { key: "educationInRegional" as const, label: "Qualification from a regional area (+5)" },
                      ].map(({ key, label }) => (
                        <div key={key}>
                          <span className="block text-sm font-medium text-foreground">{label}</span>
                          <div className="mt-1.5 flex gap-2">
                            {["yes", "no"].map(v => (
                              <button
                                key={v}
                                type="button"
                                onClick={() => updateAu(key, v)}
                                className={`flex-1 rounded-lg border py-2 text-sm font-medium transition ${
                                  au[key] === v ? "border-primary bg-primary text-primary-foreground" : "border-input bg-background text-foreground hover:bg-secondary"
                                }`}
                              >
                                {v === "yes" ? "Yes" : "No"}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* ── Score panel ── */}
            <div className="space-y-5">
              <div className="sticky top-24">
                {/* Score card */}
                <div className={`rounded-2xl border p-6 shadow-md ${isEligible ? "border-tip-green bg-tip-green/5" : "border-border bg-card"}`}>
                  <p className="text-sm font-medium text-muted-foreground">Your score</p>
                  <div className="mt-2 flex items-end gap-2">
                    <span className="font-serif text-6xl font-bold text-foreground">{result.total}</span>
                    <span className="mb-2 text-sm text-muted-foreground">/ {country === "canada" ? "1200" : "130"}</span>
                  </div>

                  <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${isEligible ? "bg-tip-green" : "bg-primary"}`}
                      style={{ width: `${Math.min((result.total / (country === "canada" ? 1200 : 130)) * 100, 100)}%` }}
                    />
                  </div>

                  <div className={`mt-4 flex items-start gap-2.5 rounded-xl p-3.5 ${isEligible ? "bg-tip-green/10" : "bg-destructive/10"}`}>
                    {isEligible
                      ? <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-tip-green-foreground" />
                      : <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />}
                    <div>
                      <p className={`text-sm font-semibold ${isEligible ? "text-tip-green-foreground" : "text-destructive"}`}>
                        {isEligible ? "You are likely eligible! 🎉" : "More points needed"}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        Recent cutoff: <strong>{result.cutoff}</strong> points
                        {!isEligible && ` — ${result.cutoff - result.total} more points needed`}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl border border-border bg-secondary/40 p-3.5 text-xs text-muted-foreground flex gap-2">
                    <Info className="mt-0.5 size-3.5 shrink-0" />
                    <span>This is an estimate. The cutoff changes with every draw/round.</span>
                  </div>
                </div>

                {/* Breakdown toggle */}
                {result.breakdown.length > 0 && (
                  <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setShowBreakdown(v => !v)}
                      className="flex w-full items-center justify-between px-5 py-4 text-sm font-semibold text-foreground hover:bg-secondary/50 transition"
                    >
                      Detailed breakdown
                      {showBreakdown ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                    </button>
                    {showBreakdown && (
                      <div className="space-y-2 p-4 pt-0">
                        {result.breakdown.map(item => <ScoreBar key={item.label} item={item} />)}
                      </div>
                    )}
                  </div>
                )}

                {/* CTA */}
                <Button asChild className="h-12 w-full rounded-full text-base">
                  <Link href="/apply">
                    Apply now <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-11 w-full rounded-full">
                  <Link href="/biometric">Biometric appointment</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
