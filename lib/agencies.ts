export interface AgencyContact {
  name: string
  recommended?: boolean
  primaryPerson: string
  secondaryPerson: string
}

/**
 * Trusted partner countries and their verified recruitment agencies.
 * Only these countries appear in the "Agency Country" dropdown —
 * this is the platform's official, curated partner list.
 */
export const AGENCIES_BY_COUNTRY: Record<string, AgencyContact[]> = {
  Bangladesh: [
    {
      name: "China Tradex N Tour",
      recommended: true,
      primaryPerson: "MD Juwel Mia (Most Senior)",
      secondaryPerson: "MD Sohel Alam",
    },
    {
      name: "East West Human Resource Center Ltd. (RL-980)",
      primaryPerson: "Ali Haider Chowdhury (Director & Former Secretary General of BAIRA)",
      secondaryPerson: "Pullok Kumar Roy (Representative)",
    },
    {
      name: "Unique Eastern Bangladesh (RL-457)",
      primaryPerson: "Mohammad Redowan (Managing Partner)",
      secondaryPerson: "H. M. Zahid Hossain (Director)",
    },
    {
      name: "S.N. International Recruitment (RL-1372)",
      primaryPerson: "S. M. Rafiqul Islam (Proprietor)",
      secondaryPerson: "Nazrul Islam Patwary (General Manager)",
    },
  ],

  "United States": [
    {
      name: "Adecco USA",
      recommended: true,
      primaryPerson: "Corinne Ripoche (CEO)",
      secondaryPerson: "Gerald Tresidder (Executive Vice President)",
    },
    {
      name: "Robert Half",
      primaryPerson: "M. Keith Waddell (CEO)",
      secondaryPerson: "Harold M. Messmer (Chairman Emeritus)",
    },
  ],

  Australia: [
    {
      name: "Hudson Australia",
      recommended: true,
      primaryPerson: "Mark Steyn (CEO)",
      secondaryPerson: "Robert Slaymaker (Director)",
    },
    {
      name: "Chandler Macleod",
      primaryPerson: "Alistair R. Marshall (Managing Director)",
      secondaryPerson: "Peter W. W. Chandler (Founder & Board Member)",
    },
  ],

  Germany: [
    {
      name: "Randstad Germany",
      recommended: true,
      primaryPerson: "Richard Jager (CEO)",
      secondaryPerson: "Heide Franken (Director of HR)",
    },
    {
      name: "Manpower Germany",
      primaryPerson: "Herwarth Brune (CEO)",
      secondaryPerson: "Frantisek Svarc (Operations Director)",
    },
  ],

  France: [
    {
      name: "Adecco France",
      recommended: true,
      primaryPerson: "Alexandre Viros (President)",
      secondaryPerson: "Bruce Roch (HR & CSR Director)",
    },
    {
      name: "Crit France",
      primaryPerson: "Claude Guedj (Founder & Chairman)",
      secondaryPerson: "Nathalie Jaoui (CEO)",
    },
  ],

  "New Zealand": [
    {
      name: "Enterprise Recruitment",
      recommended: true,
      primaryPerson: "Alistair J. S. Marshall (Managing Director)",
      secondaryPerson: "Tony S. Moore (Operations Manager)",
    },
    {
      name: "OneStaff",
      primaryPerson: "Jonathan S. Alcock (CEO)",
      secondaryPerson: "Steve S. Harrison (Director)",
    },
  ],

  Japan: [
    {
      name: "Recruit Holdings",
      recommended: true,
      primaryPerson: "Masumi Minegishi (Chairman)",
      secondaryPerson: "Hisayuki Idekoba (CEO)",
    },
    {
      name: "Pasona Group",
      primaryPerson: "Yasuyuki Nambu (Group CEO)",
      secondaryPerson: "Junko Fukutake (Director)",
    },
  ],

  "South Korea": [
    {
      name: "Adecco Korea",
      recommended: true,
      primaryPerson: "Eun-hee Kim (Country Manager)",
      secondaryPerson: "Shin-young Park (Operations Director)",
    },
    {
      name: "Manpower Korea",
      primaryPerson: "Won-sub So (CEO)",
      secondaryPerson: "Young-il Cho (HR Lead)",
    },
  ],

  Spain: [
    {
      name: "Randstad Spain",
      recommended: true,
      primaryPerson: "Rodrigo Martín (President)",
      secondaryPerson: "Jesús Echevarría (CEO)",
    },
    {
      name: "Adecco Spain",
      primaryPerson: "Iker Barricat (President)",
      secondaryPerson: "Francisco Martínez (HR Director)",
    },
  ],

  Netherlands: [
    {
      name: "Randstad Netherlands",
      recommended: true,
      primaryPerson: "Jeroen Tiel (Managing Director)",
      secondaryPerson: "Dominique Hermans (Chief Operating Officer)",
    },
    {
      name: "YoungCapital",
      primaryPerson: "Hugo de Koning (Co-Founder)",
      secondaryPerson: "Rogier Thewessen (Co-Founder)",
    },
  ],

  Sweden: [
    {
      name: "Academic Work Sweden",
      recommended: true,
      primaryPerson: "Jeremias Andersson (CEO)",
      secondaryPerson: "Johan Skarborg (Founder & Board Member)",
    },
    {
      name: "Poolia",
      primaryPerson: "Jan B. Bengtsson (CEO)",
      secondaryPerson: "Charlotte S. Ulvros (Marketing & HR Director)",
    },
  ],

  Portugal: [
    {
      name: "Randstad Portugal",
      recommended: true,
      primaryPerson: "José Miguel Leonardo (CEO)",
      secondaryPerson: "Pedro Lacerda (Operations Director)",
    },
    {
      name: "Multitempo",
      primaryPerson: "Maria João Gomes (General Manager)",
      secondaryPerson: "Rui Pinheiro (Operations Coordinator)",
    },
  ],

  Ireland: [
    {
      name: "Cpl Resources",
      recommended: true,
      primaryPerson: "Lorna Conn (CEO)",
      secondaryPerson: "Anne Heraty (Founder & Non-Executive Director)",
    },
    {
      name: "Sigmar Recruitment",
      primaryPerson: "Adrian McGennis (CEO)",
      secondaryPerson: "Frank Farrelly (Chief Operating Officer)",
    },
  ],

  Romania: [
    {
      name: "Eurojobs Romania",
      recommended: true,
      primaryPerson: "Eduard Copar (CEO & Founder)",
      secondaryPerson: "Andrei Stancu (Operations Director)",
    },
    {
      name: "Work Finder Romania",
      primaryPerson: "Vlad Dimitriu (Managing Partner)",
      secondaryPerson: "Elena Popescu (Head of Recruitment)",
    },
    {
      name: "Banat Work Romania",
      primaryPerson: "Marius Barbu (Regional Director)",
      secondaryPerson: "Diana Monica (HR Manager)",
    },
  ],

  Croatia: [
    {
      name: "Humano Croatia",
      recommended: true,
      primaryPerson: "Ivan Horvat (Managing Director)",
      secondaryPerson: "Tomislav Kovacic (Head of Business Development)",
    },
    {
      name: "Inpro Zagreb",
      primaryPerson: "Melisa Oluic (Managing Director)",
      secondaryPerson: "Igor Frankovic (Recruitment Team Lead)",
    },
    {
      name: "Pasat Croatia",
      primaryPerson: "Ino Munic (CEO)",
      secondaryPerson: "Sandra Ivanisevic (Operations Coordinator)",
    },
  ],

  Italy: [
    {
      name: "Randstad Italy",
      recommended: true,
      primaryPerson: "Marco Caleiro (Managing Director)",
      secondaryPerson: "Filippo Spadiari (HR Director)",
    },
    {
      name: "Umana Italy",
      primaryPerson: "Maria Raffaela Caprioli (General Manager)",
      secondaryPerson: "Giuseppe Venier (CEO)",
    },
    {
      name: "Synergie Italia",
      primaryPerson: "Giuseppe Galli (Country Manager)",
      secondaryPerson: "Francesca Ruggero (Recruitment Operations Manager)",
    },
  ],

  "United Kingdom": [
    {
      name: "Reed Specialist Recruitment",
      recommended: true,
      primaryPerson: "James Reed (Chairman)",
      secondaryPerson: "Ian Nicholas (HR Director)",
    },
    {
      name: "Hays Specialist Recruitment",
      primaryPerson: "Alistair Cox (CEO)",
      secondaryPerson: "Declan Fitzpatrick (Operational Director)",
    },
  ],

  Canada: [
    {
      name: "Randstad Canada",
      recommended: true,
      primaryPerson: "Marc-Etienne Julien (CEO)",
      secondaryPerson: "Carolyn Levy (President)",
    },
    {
      name: "WorkVantage Canada",
      primaryPerson: "Maria Del Pino (Founder & Immigration Director)",
      secondaryPerson: "Carlos Hernandez (Operational Director)",
    },
  ],

  Bulgaria: [
    {
      name: "Work In Bulgaria Agency",
      recommended: true,
      primaryPerson: "Vasil Todorov (Managing Partner)",
      secondaryPerson: "Kamelia Ivanova (Head of HR)",
    },
    {
      name: "Bulgarian Horizons",
      primaryPerson: "Nikolay Hristov (Managing Director)",
      secondaryPerson: "Elena Vasileva (Resourcing Lead)",
    },
  ],

  "Saudi Arabia": [
    {
      name: "ARCO (Arabian International Services Company)",
      recommended: true,
      primaryPerson: "Dr. Omar Al-Ajaji (CEO)",
      secondaryPerson: "Saud Al-Arifi (Executive Director)",
    },
    {
      name: "SMASCO (Saudi Manpower Solutions Company)",
      primaryPerson: "Saad Al-Aiban (Chairman of the Board)",
      secondaryPerson: "Abdullah Al-Tasan (CEO)",
    },
  ],

  "United Arab Emirates": [
    {
      name: "Dulsco",
      recommended: true,
      primaryPerson: "David Stockton (CEO)",
      secondaryPerson: "Tiago Costa (Chief Operating Officer)",
    },
    {
      name: "Transguard Group",
      primaryPerson: "Nick Webb (Chief Executive Officer)",
      secondaryPerson: "Rabie Atiyyah (Chief Financial Officer)",
    },
  ],

  Qatar: [
    {
      name: "Al-Jaber Group (Manpower Division)",
      recommended: true,
      primaryPerson: "Mohammed Sultan Al-Jaber (Chairman)",
      secondaryPerson: "Osama Al-Jaber (Managing Director)",
    },
    {
      name: "United Manpower Services",
      primaryPerson: "Khalid Al-Suwaidi (General Manager)",
      secondaryPerson: "Jassim Al-Kuwari (Operations Director)",
    },
  ],

  Oman: [
    {
      name: "Al-Maha Manpower Services",
      recommended: true,
      primaryPerson: "Salim Al-Harthy (Managing Director)",
      secondaryPerson: "Said Al-Maskari (General Manager)",
    },
    {
      name: "Target Group (Recruitment Division)",
      primaryPerson: "Yousuf Al-Balushi (CEO)",
      secondaryPerson: "Tariq Al-Shanfari (Director of Operations)",
    },
  ],

  Kuwait: [
    {
      name: "Al-Durra Manpower",
      recommended: true,
      primaryPerson: "Saleh Al-Rasheedi (General Manager)",
      secondaryPerson: "Fahad Al-Ajmi (Operations Manager)",
    },
    {
      name: "Kawader Manpower Solutions",
      primaryPerson: "Jassem Al-Ghanim (Managing Partner)",
      secondaryPerson: "Ahmad Al-Mutairi (HR Director)",
    },
  ],

  Malaysia: [
    {
      name: "Agensi Pekerjaan JTK",
      recommended: true,
      primaryPerson: "Tan Sri Dato' Sri Dr. Mohd Mokhtar (Chairman)",
      secondaryPerson: "Lim Wei Cheng (Managing Director)",
    },
    {
      name: "Agensi Pekerjaan Semesta",
      primaryPerson: "Azhar Bin Harun (Executive Director)",
      secondaryPerson: "Sharon Tan (Head of Recruitment)",
    },
  ],

  Singapore: [
    {
      name: "Adecco Singapore",
      recommended: true,
      primaryPerson: "Betul Genc (Country Head)",
      secondaryPerson: "Kenji Naito (Regional Director)",
    },
    {
      name: "Supreme HR Advisory (Supreme Manpower)",
      primaryPerson: "Jayson Lim (Managing Director)",
      secondaryPerson: "Cheryl Lim (HR Director)",
    },
  ],
}

/** The trusted/partner countries — this drives the "Agency Country" dropdown. */
export const AGENCY_COUNTRIES = Object.keys(AGENCIES_BY_COUNTRY)

export function getAgenciesForCountry(country: string): AgencyContact[] {
  return AGENCIES_BY_COUNTRY[country] ?? []
}
