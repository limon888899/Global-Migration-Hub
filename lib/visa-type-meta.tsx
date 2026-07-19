import { Briefcase, GraduationCap, Plane, Building2, HeartPulse, Users, ArrowLeftRight, Award, Landmark } from "lucide-react"
import type { CustomSelectOption } from "@/components/custom-select"

// The `value` fields below MUST stay exactly as-is — they match lib/countries.ts
// VISA_TYPES and are used throughout the app (document requirements, admin filters).
// Only `label` and `subtitle` control what the user actually sees.
export const VISA_TYPE_OPTIONS: CustomSelectOption[] = [
  {
    value: "Work Permit Visa",
    label: "Work & Employment Visa",
    subtitle: "For skilled workers & job offers",
    icon: Briefcase,
  },
  {
    value: "Student / Study Visa",
    label: "Student & Study Abroad Visa",
    subtitle: "For university & college admission",
    icon: GraduationCap,
  },
  {
    value: "Tourist / Visit Visa",
    label: "Tourist & Visitor Visa",
    subtitle: "For short-term travel & visits",
    icon: Plane,
  },
  {
    value: "Business Visa",
    label: "Business & Investor Visa",
    subtitle: "For trade, meetings & investment",
    icon: Building2,
  },
  {
    value: "Medical Visa",
    label: "Medical & Wellness Visa",
    subtitle: "For treatment & medical appointments",
    icon: HeartPulse,
  },
  {
    value: "Family / Spouse Visa",
    label: "Family Reunion Visa",
    subtitle: "For joining a spouse or family member",
    icon: Users,
  },
  {
    value: "Transit Visa",
    label: "Transit Visa",
    subtitle: "For layovers & connecting flights",
    icon: ArrowLeftRight,
  },
  {
    value: "Permanent Residency",
    label: "Permanent Residency (PR)",
    subtitle: "For long-term settlement",
    icon: Award,
  },
  {
    value: "Diplomatic Visa",
    label: "Diplomatic Visa",
    subtitle: "For official government travel",
    icon: Landmark,
  },
]
