import { writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

/** ISO 3166-1 alpha-2 (sovereign states & common territories). */
const ISO_COUNTRY_CODES = [
  "AD", "AE", "AF", "AG", "AI", "AL", "AM", "AO", "AQ", "AR", "AS", "AT", "AU",
  "AW", "AX", "AZ", "BA", "BB", "BD", "BE", "BF", "BG", "BH", "BI", "BJ", "BL",
  "BM", "BN", "BO", "BQ", "BR", "BS", "BT", "BV", "BW", "BY", "BZ", "CA", "CC",
  "CD", "CF", "CG", "CH", "CI", "CK", "CL", "CM", "CN", "CO", "CR", "CU", "CV",
  "CW", "CX", "CY", "CZ", "DE", "DJ", "DK", "DM", "DO", "DZ", "EC", "EE", "EG",
  "EH", "ER", "ES", "ET", "FI", "FJ", "FK", "FM", "FO", "FR", "GA", "GB", "GD",
  "GE", "GF", "GG", "GH", "GI", "GL", "GM", "GN", "GP", "GQ", "GR", "GS", "GT",
  "GU", "GW", "GY", "HK", "HM", "HN", "HR", "HT", "HU", "ID", "IE", "IL", "IM",
  "IN", "IO", "IQ", "IR", "IS", "IT", "JE", "JM", "JO", "JP", "KE", "KG", "KH",
  "KI", "KM", "KN", "KP", "KR", "KW", "KY", "KZ", "LA", "LB", "LC", "LI", "LK",
  "LR", "LS", "LT", "LU", "LV", "LY", "MA", "MC", "MD", "ME", "MF", "MG", "MH",
  "MK", "ML", "MM", "MN", "MO", "MP", "MQ", "MR", "MS", "MT", "MU", "MV", "MW",
  "MX", "MY", "MZ", "NA", "NC", "NE", "NF", "NG", "NI", "NL", "NO", "NP", "NR",
  "NU", "NZ", "OM", "PA", "PE", "PF", "PG", "PH", "PK", "PL", "PM", "PN", "PR",
  "PS", "PT", "PW", "PY", "QA", "RE", "RO", "RS", "RU", "RW", "SA", "SB", "SC",
  "SD", "SE", "SG", "SH", "SI", "SJ", "SK", "SL", "SM", "SN", "SO", "SR", "SS",
  "ST", "SV", "SX", "SY", "SZ", "TC", "TD", "TF", "TG", "TH", "TJ", "TK", "TL",
  "TM", "TN", "TO", "TR", "TT", "TV", "TW", "TZ", "UA", "UG", "UM", "US", "UY",
  "UZ", "VA", "VC", "VE", "VG", "VI", "VN", "VU", "WF", "WS", "YE", "YT", "ZA",
  "ZM", "ZW",
];

const EURO_ZONE = new Set([
  "AD", "AT", "BE", "CY", "DE", "EE", "ES", "FI", "FR", "GR", "HR", "IE", "IT",
  "LT", "LU", "LV", "MT", "NL", "PT", "SI", "SK", "MC", "SM", "VA", "ME", "XK",
]);

/** Primary legal tender by country (partial — unlisted countries use EUR zone or USD). */
const COUNTRY_CURRENCY = {
  US: "USD", CA: "CAD", GB: "GBP", AU: "AUD", NZ: "NZD", IN: "INR", JP: "JPY",
  CN: "CNY", CH: "CHF", SE: "SEK", NO: "NOK", DK: "DKK", PL: "PLN", CZ: "CZK",
  HU: "HUF", RO: "RON", BG: "BGN", HR: "EUR", RS: "RSD", UA: "UAH", RU: "RUB",
  TR: "TRY", IL: "ILS", AE: "AED", SA: "SAR", QA: "QAR", KW: "KWD", BH: "BHD",
  OM: "OMR", EG: "EGP", ZA: "ZAR", NG: "NGN", KE: "KES", GH: "GHS", MA: "MAD",
  TN: "TND", BR: "BRL", MX: "MXN", AR: "ARS", CL: "CLP", CO: "COP", PE: "PEN",
  VE: "VES", UY: "UYU", PY: "PYG", BO: "BOB", EC: "USD", CR: "CRC", PA: "PAB",
  GT: "GTQ", HN: "HNL", SV: "USD", NI: "NIO", DO: "DOP", JM: "JMD", TT: "TTD",
  BB: "BBD", BS: "BSD", BZ: "BZD", KY: "KYD", SG: "SGD", MY: "MYR", TH: "THB",
  VN: "VND", ID: "IDR", PH: "PHP", KR: "KRW", TW: "TWD", HK: "HKD", MO: "MOP",
  PK: "PKR", BD: "BDT", LK: "LKR", NP: "NPR", MM: "MMK", KH: "KHR", LA: "LAK",
  MN: "MNT", KZ: "KZT", UZ: "UZS", IS: "ISK", AL: "ALL", BA: "BAM", MK: "MKD",
  MD: "MDL", GE: "GEL", AM: "AMD", AZ: "AZN", BY: "BYN", LY: "LYD", IQ: "IQD",
  IR: "IRR", JO: "JOD", LB: "LBP", SY: "SYP", YE: "YER", AF: "AFN", UG: "UGX",
  TZ: "TZS", ET: "ETB", RW: "RWF", SN: "XOF", CI: "XOF", BF: "XOF", ML: "XOF",
  NE: "XOF", TG: "XOF", BJ: "XOF", GW: "XOF", CM: "XAF", GA: "XAF", CG: "XAF",
  TD: "XAF", CF: "XAF", GQ: "XAF", CD: "CDF", AO: "AOA", MZ: "MZN", ZM: "ZMW",
  BW: "BWP", NA: "NAD", SZ: "SZL", LS: "LSL", MU: "MUR", SC: "SCR", MG: "MGA",
  FJ: "FJD", PG: "PGK", SB: "SBD", VU: "VUV", WS: "WST", TO: "TOP", KI: "AUD",
  TV: "AUD", NR: "AUD", PF: "XPF", NC: "XPF", WF: "XPF",
};

function defaultCurrency(code) {
  if (COUNTRY_CURRENCY[code]) return COUNTRY_CURRENCY[code];
  if (EURO_ZONE.has(code)) return "EUR";
  return "USD";
}

const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
const currencyNames = new Intl.DisplayNames(["en"], { type: "currency" });
const currencies = Intl.supportedValuesOf("currency").sort();

function currencySymbol(code) {
  try {
    const parts = new Intl.NumberFormat("en", {
      style: "currency",
      currency: code,
      currencyDisplay: "narrowSymbol",
    }).formatToParts(0);
    const sym = parts.find((p) => p.type === "currency")?.value;
    return sym && sym !== code ? sym : code;
  } catch {
    return code;
  }
}

const countries = ISO_COUNTRY_CODES.map((code) => ({
  code,
  name: regionNames.of(code) ?? code,
  currencyCode: defaultCurrency(code),
})).sort((a, b) => a.name.localeCompare(b.name));

const currencyList = currencies.map((code) => ({
  code,
  name: currencyNames.of(code) ?? code,
  symbol: currencySymbol(code),
}));

writeFileSync(
  join(root, "data/iso-countries.json"),
  JSON.stringify(countries, null, 2)
);
writeFileSync(
  join(root, "data/iso-currencies.json"),
  JSON.stringify(currencyList, null, 2)
);

console.log(`Wrote ${countries.length} countries and ${currencyList.length} currencies`);
