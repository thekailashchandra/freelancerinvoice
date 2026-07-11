import { normalizeCountryCode } from "@/lib/country";
import { ISO_COUNTRIES } from "@/lib/iso-data";

/** A data-protection or digital-privacy law/framework we reference in consent and policy. */
export type DataProtectionLaw = {
  id: string;
  shortName: string;
  fullName: string;
  jurisdiction: string;
  year?: number;
  /** Short rights summary shown in policy sections. */
  rightsSummary?: string;
};

export const DATA_PROTECTION_LAWS: Record<string, DataProtectionLaw> = {
  gdpr: {
    id: "gdpr",
    shortName: "GDPR",
    fullName: "General Data Protection Regulation (EU) 2016/679",
    jurisdiction: "European Union / EEA",
    year: 2016,
    rightsSummary:
      "Access, rectification, erasure, restriction, portability, objection, and complaint to a supervisory authority.",
  },
  uk_gdpr: {
    id: "uk_gdpr",
    shortName: "UK GDPR",
    fullName: "UK General Data Protection Regulation & Data Protection Act 2018",
    jurisdiction: "United Kingdom",
    year: 2018,
    rightsSummary:
      "Access, rectification, erasure, restriction, portability, objection, and complaint to the ICO.",
  },
  swiss_fadp: {
    id: "swiss_fadp",
    shortName: "FADP",
    fullName: "Federal Act on Data Protection (rev. 2023)",
    jurisdiction: "Switzerland",
    year: 2023,
  },
  dpdp: {
    id: "dpdp",
    shortName: "DPDP Act",
    fullName: "Digital Personal Data Protection Act, 2023",
    jurisdiction: "India",
    year: 2023,
    rightsSummary:
      "Access, correction, erasure, consent withdrawal, grievance, and nomination rights as a Data Principal.",
  },
  lgpd: {
    id: "lgpd",
    shortName: "LGPD",
    fullName: "Lei Geral de Proteção de Dados (Law 13.709/2018)",
    jurisdiction: "Brazil",
    year: 2018,
  },
  pipeda: {
    id: "pipeda",
    shortName: "PIPEDA",
    fullName: "Personal Information Protection and Electronic Documents Act",
    jurisdiction: "Canada",
    year: 2000,
  },
  ccpa: {
    id: "ccpa",
    shortName: "U.S. privacy laws",
    fullName:
      "Applicable U.S. federal and state privacy laws (including CCPA/CPRA, VCDPA, CPA, CTDPA, and similar statutes)",
    jurisdiction: "United States",
    year: 2018,
  },
  au_privacy: {
    id: "au_privacy",
    shortName: "Privacy Act",
    fullName: "Privacy Act 1988 & Australian Privacy Principles",
    jurisdiction: "Australia",
    year: 1988,
  },
  nz_privacy: {
    id: "nz_privacy",
    shortName: "Privacy Act",
    fullName: "Privacy Act 2020",
    jurisdiction: "New Zealand",
    year: 2020,
  },
  appi: {
    id: "appi",
    shortName: "APPI",
    fullName: "Act on the Protection of Personal Information",
    jurisdiction: "Japan",
    year: 2003,
  },
  pipa_kr: {
    id: "pipa_kr",
    shortName: "PIPA",
    fullName: "Personal Information Protection Act",
    jurisdiction: "South Korea",
    year: 2011,
  },
  sg_pdpa: {
    id: "sg_pdpa",
    shortName: "PDPA",
    fullName: "Personal Data Protection Act 2012",
    jurisdiction: "Singapore",
    year: 2012,
  },
  cn_pipl: {
    id: "cn_pipl",
    shortName: "PIPL",
    fullName: "Personal Information Protection Law",
    jurisdiction: "China",
    year: 2021,
  },
  hk_pdpo: {
    id: "hk_pdpo",
    shortName: "PDPO",
    fullName: "Personal Data (Privacy) Ordinance",
    jurisdiction: "Hong Kong",
    year: 1996,
  },
  tw_pdpa: {
    id: "tw_pdpa",
    shortName: "PDPA",
    fullName: "Personal Data Protection Act",
    jurisdiction: "Taiwan",
    year: 2010,
  },
  th_pdpa: {
    id: "th_pdpa",
    shortName: "PDPA",
    fullName: "Personal Data Protection Act B.E. 2562",
    jurisdiction: "Thailand",
    year: 2019,
  },
  ph_dpa: {
    id: "ph_dpa",
    shortName: "DPA",
    fullName: "Data Privacy Act of 2012 (RA 10173)",
    jurisdiction: "Philippines",
    year: 2012,
  },
  id_pdp: {
    id: "id_pdp",
    shortName: "PDP Law",
    fullName: "Law No. 27 of 2022 on Personal Data Protection",
    jurisdiction: "Indonesia",
    year: 2022,
  },
  my_pdpa: {
    id: "my_pdpa",
    shortName: "PDPA",
    fullName: "Personal Data Protection Act 2010",
    jurisdiction: "Malaysia",
    year: 2010,
  },
  vn_pdp: {
    id: "vn_pdp",
    shortName: "PDP Decree",
    fullName: "Decree 13/2023/ND-CP on Personal Data Protection",
    jurisdiction: "Vietnam",
    year: 2023,
  },
  mx_lfpdppp: {
    id: "mx_lfpdppp",
    shortName: "LFPDPPP",
    fullName: "Federal Law on Protection of Personal Data Held by Private Parties",
    jurisdiction: "Mexico",
    year: 2010,
  },
  ar_pdpa: {
    id: "ar_pdpa",
    shortName: "PDPA",
    fullName: "Law 25.326 on Protection of Personal Data",
    jurisdiction: "Argentina",
    year: 2000,
  },
  co_habeas: {
    id: "co_habeas",
    shortName: "Habeas Data Law",
    fullName: "Law 1581 of 2012 (Statutory Law for Habeas Data)",
    jurisdiction: "Colombia",
    year: 2012,
  },
  cl_pdp: {
    id: "cl_pdp",
    shortName: "Law 19.628",
    fullName: "Law on Protection of Private Life / Personal Data",
    jurisdiction: "Chile",
    year: 1999,
  },
  pe_pdp: {
    id: "pe_pdp",
    shortName: "Law 29733",
    fullName: "Law on Personal Data Protection",
    jurisdiction: "Peru",
    year: 2011,
  },
  uy_pdp: {
    id: "uy_pdp",
    shortName: "Law 18.331",
    fullName: "Law on Protection of Personal Data & Habeas Data Action",
    jurisdiction: "Uruguay",
    year: 2008,
  },
  za_popia: {
    id: "za_popia",
    shortName: "POPIA",
    fullName: "Protection of Personal Information Act",
    jurisdiction: "South Africa",
    year: 2013,
  },
  ng_ndpr: {
    id: "ng_ndpr",
    shortName: "NDPR",
    fullName: "Nigeria Data Protection Regulation",
    jurisdiction: "Nigeria",
    year: 2019,
  },
  ke_dpa: {
    id: "ke_dpa",
    shortName: "DPA",
    fullName: "Data Protection Act, 2019",
    jurisdiction: "Kenya",
    year: 2019,
  },
  gh_dpa: {
    id: "gh_dpa",
    shortName: "DPA",
    fullName: "Data Protection Act, 2012",
    jurisdiction: "Ghana",
    year: 2012,
  },
  eg_pdpl: {
    id: "eg_pdpl",
    shortName: "PDPL",
    fullName: "Personal Data Protection Law (Law 151/2020)",
    jurisdiction: "Egypt",
    year: 2020,
  },
  ma_law_09_08: {
    id: "ma_law_09_08",
    shortName: "Law 09-08",
    fullName: "Law 09-08 on Protection of Individuals with regard to Personal Data",
    jurisdiction: "Morocco",
    year: 2009,
  },
  tn_inpd: {
    id: "tn_inpd",
    shortName: "INPDP Law",
    fullName: "Organic Law on Protection of Personal Data",
    jurisdiction: "Tunisia",
    year: 2004,
  },
  il_privacy: {
    id: "il_privacy",
    shortName: "Privacy Law",
    fullName: "Protection of Privacy Law, 5741-1981",
    jurisdiction: "Israel",
    year: 1981,
  },
  tr_kvkk: {
    id: "tr_kvkk",
    shortName: "KVKK",
    fullName: "Law on Protection of Personal Data No. 6698",
    jurisdiction: "Turkey",
    year: 2016,
  },
  ae_pdpl: {
    id: "ae_pdpl",
    shortName: "PDPL",
    fullName: "Federal Decree-Law No. 45 of 2021 on Personal Data Protection",
    jurisdiction: "United Arab Emirates",
    year: 2021,
  },
  sa_pdpl: {
    id: "sa_pdpl",
    shortName: "PDPL",
    fullName: "Personal Data Protection Law (Royal Decree M/19)",
    jurisdiction: "Saudi Arabia",
    year: 2021,
  },
  qa_pdpl: {
    id: "qa_pdpl",
    shortName: "PDPPL",
    fullName: "Law No. 13 of 2016 on Personal Data Privacy Protection",
    jurisdiction: "Qatar",
    year: 2016,
  },
  bh_pdpl: {
    id: "bh_pdpl",
    shortName: "PDPL",
    fullName: "Personal Data Protection Law (Law 30 of 2018)",
    jurisdiction: "Bahrain",
    year: 2018,
  },
  om_pdp: {
    id: "om_pdp",
    shortName: "PDP Law",
    fullName: "Personal Data Protection Law (Royal Decree 6/2022)",
    jurisdiction: "Oman",
    year: 2022,
  },
  kw_pdp: {
    id: "kw_pdp",
    shortName: "E-Transactions Law",
    fullName: "Electronic Transactions Law (personal data provisions)",
    jurisdiction: "Kuwait",
    year: 2016,
  },
  jo_pdp: {
    id: "jo_pdp",
    shortName: "PDP Law",
    fullName: "Personal Data Protection Law No. 24 of 2023",
    jurisdiction: "Jordan",
    year: 2023,
  },
  ru_152fz: {
    id: "ru_152fz",
    shortName: "152-FZ",
    fullName: "Federal Law on Personal Data",
    jurisdiction: "Russia",
    year: 2006,
  },
  ua_pdp: {
    id: "ua_pdp",
    shortName: "PDP Law",
    fullName: "Law on Personal Data Protection",
    jurisdiction: "Ukraine",
    year: 2010,
  },
  rs_pdp: {
    id: "rs_pdp",
    shortName: "PDPA",
    fullName: "Law on Personal Data Protection",
    jurisdiction: "Serbia",
    year: 2018,
  },
  me_pdp: {
    id: "me_pdp",
    shortName: "PDPA",
    fullName: "Law on Personal Data Protection",
    jurisdiction: "Montenegro",
    year: 2008,
  },
  mk_pdp: {
    id: "mk_pdp",
    shortName: "PDPA",
    fullName: "Law on Personal Data Protection",
    jurisdiction: "North Macedonia",
    year: 2020,
  },
  al_pdp: {
    id: "al_pdp",
    shortName: "Law 9887",
    fullName: "Law on Personal Data Protection",
    jurisdiction: "Albania",
    year: 2008,
  },
  ba_pdp: {
    id: "ba_pdp",
    shortName: "PDPA",
    fullName: "Law on Personal Data Protection",
    jurisdiction: "Bosnia and Herzegovina",
    year: 2011,
  },
  xk_pdp: {
    id: "xk_pdp",
    shortName: "PDP Law",
    fullName: "Law on Protection of Personal Data",
    jurisdiction: "Kosovo",
    year: 2019,
  },
  jm_dpa: {
    id: "jm_dpa",
    shortName: "DPA",
    fullName: "Data Protection Act, 2020",
    jurisdiction: "Jamaica",
    year: 2020,
  },
  bb_dpa: {
    id: "bb_dpa",
    shortName: "DPA",
    fullName: "Data Protection Act, 2019",
    jurisdiction: "Barbados",
    year: 2019,
  },
  tt_dpa: {
    id: "tt_dpa",
    shortName: "DPA",
    fullName: "Data Protection Act, 2011",
    jurisdiction: "Trinidad and Tobago",
    year: 2011,
  },
  ec_pdp: {
    id: "ec_pdp",
    shortName: "LOPDP",
    fullName: "Organic Law on Personal Data Protection",
    jurisdiction: "Ecuador",
    year: 2021,
  },
  cr_pdp: {
    id: "cr_pdp",
    shortName: "Law 8968",
    fullName: "Law on Protection of Persons regarding Personal Data",
    jurisdiction: "Costa Rica",
    year: 2011,
  },
  pa_pdp: {
    id: "pa_pdp",
    shortName: "Law 81",
    fullName: "Law 81 on Personal Data Protection",
    jurisdiction: "Panama",
    year: 2019,
  },
  bo_pdp: {
    id: "bo_pdp",
    shortName: "Law 1644",
    fullName: "Law on Personal Data Protection",
    jurisdiction: "Bolivia",
    year: 2021,
  },
  py_pdp: {
    id: "py_pdp",
    shortName: "Law 6534",
    fullName: "Law on Protection of Personal Credit Data",
    jurisdiction: "Paraguay",
    year: 2020,
  },
  lk_pdp: {
    id: "lk_pdp",
    shortName: "PDPA",
    fullName: "Personal Data Protection Act No. 9 of 2022",
    jurisdiction: "Sri Lanka",
    year: 2022,
  },
  bd_dpa: {
    id: "bd_dpa",
    shortName: "DPA",
    fullName: "Digital Security Act / data protection provisions",
    jurisdiction: "Bangladesh",
    year: 2018,
  },
  pk_pdp: {
    id: "pk_pdp",
    shortName: "PDPB",
    fullName: "Personal Data Protection Bill / applicable ordinances",
    jurisdiction: "Pakistan",
    year: 2023,
  },
  np_pdp: {
    id: "np_pdp",
    shortName: "Privacy Act",
    fullName: "Privacy Act, 2075 (2018)",
    jurisdiction: "Nepal",
    year: 2018,
  },
  kh_pdp: {
    id: "kh_pdp",
    shortName: "Draft PDP",
    fullName: "Applicable Cambodian data protection & consumer laws",
    jurisdiction: "Cambodia",
  },
  la_pdp: {
    id: "la_pdp",
    shortName: "E-Transactions Law",
    fullName: "Electronic Transactions Law (data provisions)",
    jurisdiction: "Laos",
    year: 2012,
  },
  mm_pdp: {
    id: "mm_pdp",
    shortName: "PDPL",
    fullName: "Personal Data Protection Law (draft/enacted provisions)",
    jurisdiction: "Myanmar",
    year: 2021,
  },
  uz_pdp: {
    id: "uz_pdp",
    shortName: "Law ZRU-547",
    fullName: "Law on Personal Data",
    jurisdiction: "Uzbekistan",
    year: 2019,
  },
  kz_pdp: {
    id: "kz_pdp",
    shortName: "Law 94-V",
    fullName: "Law on Personal Data and their Protection",
    jurisdiction: "Kazakhstan",
    year: 2013,
  },
  ge_pdp: {
    id: "ge_pdp",
    shortName: "PDP Law",
    fullName: "Law on Personal Data Protection",
    jurisdiction: "Georgia",
    year: 2011,
  },
  am_pdp: {
    id: "am_pdp",
    shortName: "PDP Law",
    fullName: "Law on Personal Data Protection",
    jurisdiction: "Armenia",
    year: 2015,
  },
  az_pdp: {
    id: "az_pdp",
    shortName: "PDP Law",
    fullName: "Law on Personal Data",
    jurisdiction: "Azerbaijan",
    year: 2010,
  },
  by_pdp: {
    id: "by_pdp",
    shortName: "Law 99-Z",
    fullName: "Law on Information, Informatisation and Data Protection",
    jurisdiction: "Belarus",
    year: 2008,
  },
  md_pdp: {
    id: "md_pdp",
    shortName: "Law 133",
    fullName: "Law on Personal Data Protection",
    jurisdiction: "Moldova",
    year: 2011,
  },
  general: {
    id: "general",
    shortName: "local data laws",
    fullName:
      "Applicable local data protection, consumer, and electronic communications laws in your country",
    jurisdiction: "Your jurisdiction",
    rightsSummary:
      "Contact us to exercise privacy rights available under laws that apply where you live.",
  },
};

/** EU member states + EEA (GDPR applies). */
const GDPR_COUNTRIES = new Set([
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU",
  "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES",
  "SE", "IS", "LI", "NO",
]);

/** Explicit country → law id overrides (non-GDPR). */
const COUNTRY_LAW_IDS: Record<string, string[]> = {
  IN: ["dpdp"],
  GB: ["uk_gdpr"],
  CH: ["swiss_fadp"],
  BR: ["lgpd"],
  CA: ["pipeda"],
  US: ["ccpa"],
  AU: ["au_privacy"],
  NZ: ["nz_privacy"],
  JP: ["appi"],
  KR: ["pipa_kr"],
  SG: ["sg_pdpa"],
  CN: ["cn_pipl"],
  HK: ["hk_pdpo"],
  TW: ["tw_pdpa"],
  TH: ["th_pdpa"],
  PH: ["ph_dpa"],
  ID: ["id_pdp"],
  MY: ["my_pdpa"],
  VN: ["vn_pdp"],
  MX: ["mx_lfpdppp"],
  AR: ["ar_pdpa"],
  CO: ["co_habeas"],
  CL: ["cl_pdp"],
  PE: ["pe_pdp"],
  UY: ["uy_pdp"],
  ZA: ["za_popia"],
  NG: ["ng_ndpr"],
  KE: ["ke_dpa"],
  GH: ["gh_dpa"],
  EG: ["eg_pdpl"],
  MA: ["ma_law_09_08"],
  TN: ["tn_inpd"],
  IL: ["il_privacy"],
  TR: ["tr_kvkk"],
  AE: ["ae_pdpl"],
  SA: ["sa_pdpl"],
  QA: ["qa_pdpl"],
  BH: ["bh_pdpl"],
  OM: ["om_pdp"],
  KW: ["kw_pdp"],
  JO: ["jo_pdp"],
  RU: ["ru_152fz"],
  UA: ["ua_pdp"],
  RS: ["rs_pdp"],
  ME: ["me_pdp"],
  MK: ["mk_pdp"],
  AL: ["al_pdp"],
  BA: ["ba_pdp"],
  XK: ["xk_pdp"],
  JM: ["jm_dpa"],
  BB: ["bb_dpa"],
  TT: ["tt_dpa"],
  EC: ["ec_pdp"],
  CR: ["cr_pdp"],
  PA: ["pa_pdp"],
  BO: ["bo_pdp"],
  PY: ["py_pdp"],
  LK: ["lk_pdp"],
  BD: ["bd_dpa"],
  PK: ["pk_pdp"],
  NP: ["np_pdp"],
  KH: ["kh_pdp"],
  LA: ["la_pdp"],
  MM: ["mm_pdp"],
  UZ: ["uz_pdp"],
  KZ: ["kz_pdp"],
  GE: ["ge_pdp"],
  AM: ["am_pdp"],
  AZ: ["az_pdp"],
  BY: ["by_pdp"],
  MD: ["md_pdp"],
  // Territories that follow parent regimes
  GI: ["uk_gdpr"],
  GG: ["uk_gdpr"],
  JE: ["uk_gdpr"],
  IM: ["uk_gdpr"],
  AX: ["gdpr"],
  GF: ["gdpr"],
  GP: ["gdpr"],
  MQ: ["gdpr"],
  RE: ["gdpr"],
  YT: ["gdpr"],
  MF: ["gdpr"],
  BL: ["gdpr"],
  PM: ["gdpr"],
  NC: ["gdpr"],
  PF: ["gdpr"],
  WF: ["gdpr"],
  TF: ["gdpr"],
  PR: ["ccpa"],
  GU: ["ccpa"],
  VI: ["ccpa"],
  AS: ["ccpa"],
  MP: ["ccpa"],
};

export function resolveLawIdsForCountry(countryCode: string | null | undefined): string[] {
  const code = normalizeCountryCode(countryCode || "US");
  if (COUNTRY_LAW_IDS[code]) return COUNTRY_LAW_IDS[code];
  if (GDPR_COUNTRIES.has(code)) return ["gdpr"];
  return ["general"];
}

export function getApplicableDataLaws(
  countryCode: string | null | undefined
): DataProtectionLaw[] {
  return resolveLawIdsForCountry(countryCode).map(
    (id) => DATA_PROTECTION_LAWS[id] ?? DATA_PROTECTION_LAWS.general
  );
}

export function getPrimaryDataLaw(
  countryCode: string | null | undefined
): DataProtectionLaw {
  return getApplicableDataLaws(countryCode)[0] ?? DATA_PROTECTION_LAWS.general;
}

/** All laws sorted for the privacy policy reference table. */
export const ALL_DATA_PROTECTION_LAWS: DataProtectionLaw[] = Object.values(
  DATA_PROTECTION_LAWS
)
  .filter((law) => law.id !== "general")
  .sort((a, b) => a.jurisdiction.localeCompare(b.jurisdiction));

/** Country → primary law mapping for every ISO country in the app. */
export const COUNTRY_DATA_LAW_REFERENCE: {
  countryCode: string;
  countryName: string;
  laws: DataProtectionLaw[];
}[] = ISO_COUNTRIES.map((country) => ({
  countryCode: country.code,
  countryName: country.name,
  laws: getApplicableDataLaws(country.code),
}));

export function formatConsentLawNames(laws: DataProtectionLaw[]): string {
  if (laws.length === 0) return DATA_PROTECTION_LAWS.general.shortName;
  if (laws.length === 1) return laws[0].shortName;
  if (laws.length === 2) return `${laws[0].shortName} and ${laws[1].shortName}`;
  return `${laws.slice(0, -1).map((l) => l.shortName).join(", ")}, and ${laws.at(-1)!.shortName}`;
}

import { getIsoCountryName } from "@/lib/iso-data";

export function formatSimpleRegionalConsent(
  countryCode: string | null | undefined
): string | null {
  const law = getPrimaryDataLaw(countryCode);
  const countryName = getIsoCountryName(countryCode);
  if (!countryName || law.id === "general") return null;
  return `, including the ${law.shortName} notice for ${countryName}`;
}

export function formatConsentLawNotice(countryCode: string | null | undefined): string {
  const law = getPrimaryDataLaw(countryCode);
  const countryName = getIsoCountryName(countryCode);
  if (!countryName || law.id === "general") {
    return "applicable privacy laws where you live";
  }
  return `the ${law.shortName} notice for ${countryName}`;
}
