export interface AgencyContact {
  id?: number
  name: string
  recommended?: boolean
  primaryPerson: string
  secondaryPerson: string
}

/**
 * Trusted partner countries and their verified recruitment agencies.
 * Only these countries appear in the "Agency Country" dropdown -
 * this is the platform's official, curated partner list.
 */
export const AGENCIES_BY_COUNTRY: Record<string, AgencyContact[]> = {
  Bangladesh: [
    {
      id: 1,
      name: "China Tradex N Tour",
      recommended: true,
      primaryPerson: "MD Juwel Wia (Most Senior)",
      secondaryPerson: "MD Sahel Alam",
    },
    {
      id: 2,
      name: "East West Human Resource Center Ltd. (RL-980)",
      primaryPerson: "Ali Haider Chowdhury (Director & Former Secretary General of BAIRA)",
      secondaryPerson: "Pullak Kumar Roy (Representative)",
    },
    {
      id: 3,
      name: "Unique Eastern Bangladesh (RL-457)",
      primaryPerson: "Mohammad Redowan (Managing Partner)",
      secondaryPerson: "H. M. Zahid Hossain (Director)",
    },
    {
      id: 4,
      name: "S.N. International Recruitment (RL-1372)",
      primaryPerson: "S. M. Rafikul Islam (Proprietor)",
      secondaryPerson: "Nazrul Islam Patwary (General Manager)",
    },
  ],

  "United States": [
    {
      id: 1,
      name: "Adecco USA",
      recommended: true,
      primaryPerson: "Corinne Ripoche (CEO)",
      secondaryPerson: "Gerald Tresidder (Executive Vice President)",
    },
    {
      id: 2,
      name: "Robert Half",
      primaryPerson: "M. Keith Waddell (CEO)",
      secondaryPerson: "Harold M. Messmer (Chairman Emeritus)",
    },
  ],

  Australia: [
    {
      id: 1,
      name: "Hudson Australia",
      recommended: true,
      primaryPerson: "Mark Steyn (CEO)",
      secondaryPerson: "Robert Slaymaker (Director)",
    },
    {
      id: 2,
      name: "Chandler Macleod",
      primaryPerson: "Alistair R. Marshall (Managing Director)",
      secondaryPerson: "Peter W. W. Chandler (Founder & Board Member)",
    },
  ],

  Germany: [
    {
      id: 1,
      name: "Randstad Germany",
      recommended: true,
      primaryPerson: "Richard Jager (CEO)",
      secondaryPerson: "Heide Franken (Director of HR)",
    },
    {
      id: 2,
      name: "Manpower Germany",
      primaryPerson: "Herwarth Brune (CEO)",
      secondaryPerson: "Frantisek Svarc (Operations Director)",
    },
  ],

  France: [
    {
      id: 1,
      name: "Adecco France",
      recommended: true,
      primaryPerson: "Alexandre Viros (President)",
      secondaryPerson: "Bruce Roch (HR & CSR Director)",
    },
    {
      id: 2,
      name: "Crit France",
      primaryPerson: "Claude Guedj (Founder & Chairman)",
      secondaryPerson: "Nathalie Jaoui (CEO)",
    },
  ],

  "New Zealand": [
    {
      id: 1,
      name: "Enterprise Recruitment",
      recommended: true,
      primaryPerson: "Alistair J. S. Marshall (Managing Director)",
      secondaryPerson: "Tony S. Moore (Operations Manager)",
    },
    {
      id: 2,
      name: "OneStaff",
      primaryPerson: "Jonathan S. Alcock (CEO)",
      secondaryPerson: "Steve S. Harrison (Director)",
    },
  ],

  Japan: [
    {
      id: 1,
      name: "Recruit Holdings",
      recommended: true,
      primaryPerson: "Masumi Minegishi (Chairman)",
      secondaryPerson: "Hisayuki Idekoba (CEO)",
    },
    {
      id: 2,
      name: "Pasona Group",
      primaryPerson: "Yasuyuki Nambu (Group CEO)",
      secondaryPerson: "Junko Fukutake (Director)",
    },
  ],

  "South Korea": [
    {
      id: 1,
      name: "Adecco Korea",
      recommended: true,
      primaryPerson: "Eun-hee Kim (Country Manager)",
      secondaryPerson: "Shin-young Park (Operations Director)",
    },
    {
      id: 2,
      name: "Manpower Korea",
      primaryPerson: "Won-sub So (CEO)",
      secondaryPerson: "Young-il Cho (HR Lead)",
    },
  ],

  Spain: [
    {
      id: 1,
      name: "Randstad Spain",
      recommended: true,
      primaryPerson: "Rodrigo Martin (President)",
      secondaryPerson: "Jesús Echevarría (CEO)",
    },
    {
      id: 2,
      name: "Adecco Spain",
      primaryPerson: "Iker Barricat (President)",
      secondaryPerson: "Francisco Martínez (HR Director)",
    },
  ],

  Netherlands: [
    {
      id: 1,
      name: "Randstad Netherlands",
      recommended: true,
      primaryPerson: "Jeroen Tiel (Managing Director)",
      secondaryPerson: "Dominique Hermans (Chief Operating Officer)",
    },
    {
      id: 2,
      name: "YoungCapital",
      primaryPerson: "Hugo de Koning (Co-Founder)",
      secondaryPerson: "Rogier Thewessen (Co-Founder)",
    },
  ],

  Sweden: [
    {
      id: 1,
      name: "Academic Work Sweden",
      recommended: true,
      primaryPerson: "Jeremias Andersson (CEO)",
      secondaryPerson: "Johan Skarborg (Founder & Board Member)",
    },
    {
      id: 2,
      name: "Poolia",
      primaryPerson: "Jan B. Bengtsson (CEO)",
      secondaryPerson: "Charlotte S. Ulvros (Marketing & HR Director)",
    },
  ],

  Portugal: [
    {
      id: 1,
      name: "Randstad Portugal",
      recommended: true,
      primaryPerson: "José Miguel Leonardo (CEO)",
      secondaryPerson: "Pedra Lacerda (Operations Director)",
    },
    {
      id: 2,
      name: "Multitempo",
      primaryPerson: "Maria João Gomes (General Manager)",
      secondaryPerson: "Rui Pinheiro (Operations Coordinator)",
    },
  ],

  Ireland: [
    {
      id: 1,
      name: "Cpl Resources",
      recommended: true,
      primaryPerson: "Lorna Conn (CEO)",
      secondaryPerson: "Anne Heraty (Founder & Non-Executive Director)",
    },
    {
      id: 2,
      name: "Sigmar Recruitment",
      primaryPerson: "Adrian McGennis (CEO)",
      secondaryPerson: "Frank Farrelly (Chief Operating Officer)",
    },
  ],

  Romania: [
    {
      id: 1,
      name: "Eurojobs Romania",
      recommended: true,
      primaryPerson: "Eduard Copar (CEO & Founder)",
      secondaryPerson: "Andrei Stancu (Operations Director)",
    },
    {
      id: 2,
      name: "Work Finder Romania",
      primaryPerson: "Vlad Dimitriu (Managing Partner)",
      secondaryPerson: "Elena Popescu (Head of Recruitment)",
    },
    {
      id: 3,
      name: "Banat Work Romania",
      primaryPerson: "Marius Barbu (Regional Director)",
      secondaryPerson: "Diana Monica (HR Manager)",
    },
  ],

  Croatia: [
    {
      id: 1,
      name: "Humano Croatia",
      recommended: true,
      primaryPerson: "Ivan Horvat (Managing Director)",
      secondaryPerson: "Tomislav Kovacic (Head of Business Development)",
    },
    {
      id: 2,
      name: "Inpro Zagreb",
      primaryPerson: "Melisa Dluic (Managing Director)",
      secondaryPerson: "Igor Frankovic (Recruitment Team Lead)",
    },
    {
      id: 3,
      name: "Pasat Croatia",
      primaryPerson: "Ino Munic (CEO)",
      secondaryPerson: "Sandra Ivanisevic (Operations Coordinator)",
    },
  ],

  Italy: [
    {
      id: 1,
      name: "Randstad Italy",
      recommended: true,
      primaryPerson: "Marco Caleiro (Managing Director)",
      secondaryPerson: "Filippo Spadlari (HR Director)",
    },
    {
      id: 2,
      name: "Umana Italy",
      primaryPerson: "Maria Raffaela Caprioli (General Manager)",
      secondaryPerson: "Giuseppe Venier (CEO)",
    },
    {
      id: 3,
      name: "Synergie Italia",
      primaryPerson: "Giuseppe Galli (Country Manager)",
      secondaryPerson: "Francesca Ruggero (Recruitment Operations Manager)",
    },
  ],

  "United Kingdom": [
    {
      id: 1,
      name: "Reed Specialist Recruitment",
      recommended: true,
      primaryPerson: "James Reed (Chairman)",
      secondaryPerson: "Ian Nicholas (HR Director)",
    },
    {
      id: 2,
      name: "Hays Specialist Recruitment",
      primaryPerson: "Alistair Cox (CEO)",
      secondaryPerson: "Declan Fitzpatrick (Operational Director)",
    },
  ],

  Canada: [
    {
      id: 1,
      name: "Randstad Canada",
      recommended: true,
      primaryPerson: "Marc-Etienne Julien (CEO)",
      secondaryPerson: "Carolyn Levy (President)",
    },
    {
      id: 2,
      name: "WorkVantage Canada",
      primaryPerson: "Maria Del Pino (Founder & Immigration Director)",
      secondaryPerson: "Carlos Hernandez (Operational Director)",
    },
  ],

  Bulgaria: [
    {
      id: 1,
      name: "Work In Bulgaria Agency",
      recommended: true,
      primaryPerson: "Vasil Todorov (Managing Partner)",
      secondaryPerson: "Kamelia Ivanova (Head of HR)",
    },
    {
      id: 2,
      name: "Bulgarian Horizons",
      primaryPerson: "Nikolay Hristov (Managing Director)",
      secondaryPerson: "Elena Vasileva (Resourcing Lead)",
    },
  ],

  "Saudi Arabia": [
    {
      id: 1,
      name: "ARCO (Arabian International Services Company)",
      recommended: true,
      primaryPerson: "Dr. Omar Al-Ajaji (CEO)",
      secondaryPerson: "Saud Al-Arifi (Executive Director)",
    },
    {
      id: 2,
      name: "SMASCO (Saudi Manpower Solutions Company)",
      primaryPerson: "Saad Al-Aiban (Chairman of the Board)",
      secondaryPerson: "Abdullah Al-Tasan (CEO)",
    },
  ],

  "United Arab Emirates": [
    {
      id: 1,
      name: "Dulsco",
      recommended: true,
      primaryPerson: "David Stockton (CEO)",
      secondaryPerson: "Tiago Costa (Chief Operating Officer)",
    },
    {
      id: 2,
      name: "Transguard Group",
      primaryPerson: "Nick Webb (Chief Executive Officer)",
      secondaryPerson: "Rabie Atiyyah (Chief Financial Officer)",
    },
  ],

  Qatar: [
    {
      id: 1,
      name: "Al-Jaber Group (Manpower Division)",
      recommended: true,
      primaryPerson: "Mohammed Sultan Al-Jaber (Chairman)",
      secondaryPerson: "Osama Al-Jaber (Managing Director)",
    },
    {
      id: 2,
      name: "United Manpower Services",
      primaryPerson: "Khalid Al-Sumaidi (General Manager)",
      secondaryPerson: "Jassim Al-Kuwari (Operations Director)",
    },
  ],

  Oman: [
    {
      id: 1,
      name: "Al-Maha Manpower Services",
      recommended: true,
      primaryPerson: "Salim Al-Harthy (Managing Director)",
      secondaryPerson: "Said Al-Maskari (General Manager)",
    },
    {
      id: 2,
      name: "Target Group (Recruitment Division)",
      primaryPerson: "Yousuf Al-Balushi (CEO)",
      secondaryPerson: "Tariq Al-Shanfari (Director of Operations)",
    },
  ],

  Kuwait: [
    {
      id: 1,
      name: "Al-Durra Manpower",
      recommended: true,
      primaryPerson: "Saleh Al-Rasheedi (General Manager)",
      secondaryPerson: "Fahad Al-Ajmi (Operations Manager)",
    },
    {
      id: 2,
      name: "Kawader Manpower Solutions",
      primaryPerson: "Jassem Al-Ghanim (Managing Partner)",
      secondaryPerson: "Ahmad Al-Mutairi (HR Director)",
    },
  ],

  Malaysia: [
    {
      id: 1,
      name: "Agensi Pekerjaan JTK",
      recommended: true,
      primaryPerson: "Tan Sri Dato' Sri Dr. Mohd Mokhtar (Chairman)",
      secondaryPerson: "Lim Wei Cheng (Managing Director)",
    },
    {
      id: 2,
      name: "Agensi Pekerjaan Semesta",
      primaryPerson: "Azhar Bin Harun (Executive Director)",
      secondaryPerson: "Sharon Tan (Head of Recruitment)",
    },
  ],

  Singapore: [
    {
      id: 1,
      name: "Adecco Singapore",
      recommended: true,
      primaryPerson: "Betul Genc (Country Head)",
      secondaryPerson: "Kenji Naito (Regional Director)",
    },
    {
      id: 2,
      name: "Supreme HR Advisory (Supreme Manpower)",
      primaryPerson: "Jayson Lim (Managing Director)",
      secondaryPerson: "Cheryl Lim (HR Director)",
    },
  ],
}

/** The trusted/partner countries - this drives the "Agency Country" dropdown. */
export const AGENCY_COUNTRIES = Object.keys(AGENCIES_BY_COUNTRY)

export function getAgenciesForCountry(country: string): AgencyContact[] {
  return AGENCIES_BY_COUNTRY[country] ?? []
}
