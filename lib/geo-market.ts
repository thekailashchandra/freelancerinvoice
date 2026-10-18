import type { CompanySettings } from "@/types/invoice";
import {
  applyCountryDefaults,
  emptyPaymentDetails,
  getCountryConfig,
  normalizeCountryCode,
} from "@/lib/country";

/** Geographic market split for localization strategy. */
export type MarketRegion = "IN" | "GLOBAL";

export const GEO_COUNTRY_COOKIE = "iff-geo-country";
export const GEO_MARKET_COOKIE = "iff-geo-market";
/** IP-detected country for legal consent - not changed by locale switcher. */
export const GEO_IP_COUNTRY_COOKIE = "iff-geo-ip-country";

const NORTH_AMERICA = new Set(["US", "CA", "MX"]);

const WESTERN_EUROPE_EUR = new Set([
  "DE", "FR", "NL", "BE", "AT", "IE", "IT", "ES", "PT", "FI", "LU", "GR",
]);

export type MarketContext = {
  market: MarketRegion;
  countryCode: string;
  currencyCode: string;
};

/** Read country from Vercel / Cloudflare edge headers. */
export function readCountryFromHeaders(headers: Headers): string | null {
  const raw =
    headers.get("x-vercel-ip-country") ??
    headers.get("cf-ipcountry") ??
    headers.get("x-country-code");
  if (!raw || raw === "XX" || raw === "T1") return null;
  return raw.toUpperCase();
}

export function resolveMarketFromCountry(countryCode: string): MarketRegion {
  return normalizeCountryCode(countryCode) === "IN" ? "IN" : "GLOBAL";
}

/**
 * Map detected IP country to default billing country + currency.
 * USD for North America, EUR for Western Europe, INR for India, etc.
 */
export function resolveDefaultCountryCode(detectedCountry: string | null): string {
  if (!detectedCountry) return "US";
  const code = detectedCountry.toUpperCase();

  if (code === "IN") return "IN";
  if (code === "GB") return "GB";
  if (code === "AU") return "AU";
  if (code === "CA") return "CA";
  if (NORTH_AMERICA.has(code)) return code === "CA" ? "CA" : "US";
  if (WESTERN_EUROPE_EUR.has(code)) return code;
  if (getCountryConfig(code).currencyCode === "EUR") return code;

  return normalizeCountryCode(code);
}

export function resolveMarketContext(input: {
  countryCode?: string | null;
  market?: string | null;
  detectedCountry?: string | null;
}): MarketContext {
  const countryCode = resolveDefaultCountryCode(
    input.countryCode ??
      input.detectedCountry ??
      (input.market === "IN" ? "IN" : "US")
  );
  const market: MarketRegion =
    input.market === "IN" || input.market === "GLOBAL"
      ? input.market
      : resolveMarketFromCountry(countryCode);
  const currencyCode = getCountryConfig(
    market === "IN" ? "IN" : countryCode
  ).currencyCode;

  return { market, countryCode: market === "IN" ? "IN" : countryCode, currencyCode };
}

export function getDefaultCompanySettingsForCountry(
  countryCode: string
): CompanySettings {
  const config = getCountryConfig(countryCode);
  const defaults = applyCountryDefaults(config.code);

  if (config.code === "IN") {
    return {
      companyName: "Your Freelance Business",
      companyEmail: "hello@yourbusiness.in",
      companyPhone: "+91 98765 43210",
      companyAddress: "Bandra Kurla Complex, Mumbai, Maharashtra 400051",
      logo: null,
      brandColor: "#111111",
      signature: null,
      countryCode: "IN",
      currencyCode: "INR",
      taxLabel: "GST",
      defaultPayment: {
        ...emptyPaymentDetails(),
        bankName: "HDFC Bank",
        accountNumber: "",
        upiId: "name@upi",
      },
    };
  }

  if (config.currencyCode === "EUR") {
    return {
      companyName: "Your Studio",
      companyEmail: "hello@yourstudio.eu",
      companyPhone: "+49 30 1234 5678",
      companyAddress: "Friedrichstraße 123, 10117 Berlin, Germany",
      logo: null,
      brandColor: "#111111",
      signature: null,
      countryCode: config.code,
      currencyCode: "EUR",
      taxLabel: "VAT",
      defaultPayment: {
        ...emptyPaymentDetails(),
        bankName: "Deutsche Bank",
        iban: "",
      },
    };
  }

  if (config.code === "GB") {
    return {
      companyName: "Your Studio",
      companyEmail: "hello@yourstudio.co.uk",
      companyPhone: "+44 20 7946 0958",
      companyAddress: "10 Downing Street, London SW1A 2AA",
      logo: null,
      brandColor: "#111111",
      signature: null,
      countryCode: "GB",
      currencyCode: "GBP",
      taxLabel: "VAT",
      defaultPayment: {
        ...emptyPaymentDetails(),
        bankName: "Barclays",
        sortCode: "",
        accountNumber: "",
      },
    };
  }

  return {
    companyName: "Your Studio",
    companyEmail: "hello@yourstudio.com",
    companyPhone: "+1 (628) 555-0142",
    companyAddress: "742 Evergreen Terrace, Austin, TX 78701",
    logo: null,
    brandColor: "#111111",
    signature: null,
    countryCode: defaults.countryCode,
    currencyCode: defaults.currencyCode,
    taxLabel: defaults.taxLabel,
    defaultPayment: defaults.payment,
  };
}
