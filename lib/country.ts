import type { PaymentDetails } from "@/types/invoice";
import { CURRENCY_OPTIONS } from "@/lib/currency";
import { getIsoCountry, getIsoCountryName, ISO_COUNTRIES } from "@/lib/iso-data";

/** ISO 3166-1 alpha-2 or legacy codes (EU, OTHER). */
export type CountryCode = string;

export type PaymentFieldKey = keyof PaymentDetails;

export interface PaymentFieldConfig {
  key: PaymentFieldKey;
  label: string;
  placeholder: string;
}

export interface CountryConfig {
  code: CountryCode;
  label: string;
  currencyCode: string;
  taxLabel: string;
  defaultTaxPercent: number;
  paymentFields: PaymentFieldConfig[];
}

export const COUNTRY_OPTIONS: { code: CountryCode; label: string }[] =
  ISO_COUNTRIES.map((c) => ({ code: c.code, label: c.name }));

const EURO_ZONE = new Set([
  "AD", "AT", "BE", "CY", "DE", "EE", "ES", "FI", "FR", "GR", "HR", "IE", "IT",
  "LT", "LU", "LV", "MT", "NL", "PT", "SI", "SK", "MC", "SM", "VA", "ME",
]);

const OTHER_PAYMENT_FIELDS: PaymentFieldConfig[] = [
  { key: "bankName", label: "Bank name", placeholder: "Your bank" },
  { key: "accountNumber", label: "Account number", placeholder: "XXXXXXXXXX" },
  { key: "iban", label: "IBAN / SWIFT reference (optional)", placeholder: "" },
];

const PROFILE_COUNTRY_CONFIGS: Record<string, CountryConfig> = {
  IN: {
    code: "IN",
    label: "India",
    currencyCode: "INR",
    taxLabel: "GST",
    defaultTaxPercent: 18,
    paymentFields: [
      { key: "bankName", label: "Bank name", placeholder: "HDFC Bank" },
      { key: "accountNumber", label: "Account number", placeholder: "XXXX XXXX XXXX" },
      { key: "upiId", label: "UPI ID", placeholder: "name@upi" },
    ],
  },
  US: {
    code: "US",
    label: "United States",
    currencyCode: "USD",
    taxLabel: "Sales Tax",
    defaultTaxPercent: 0,
    paymentFields: [
      { key: "bankName", label: "Bank name", placeholder: "Chase" },
      { key: "accountNumber", label: "Account number", placeholder: "XXXXXXXXXX" },
      { key: "routingNumber", label: "Routing number (ABA)", placeholder: "021000021" },
    ],
  },
  GB: {
    code: "GB",
    label: "United Kingdom",
    currencyCode: "GBP",
    taxLabel: "VAT",
    defaultTaxPercent: 20,
    paymentFields: [
      { key: "bankName", label: "Bank name", placeholder: "Barclays" },
      { key: "sortCode", label: "Sort code", placeholder: "12-34-56" },
      { key: "accountNumber", label: "Account number", placeholder: "12345678" },
      { key: "iban", label: "IBAN (optional)", placeholder: "GB00 XXXX …" },
    ],
  },
  AU: {
    code: "AU",
    label: "Australia",
    currencyCode: "AUD",
    taxLabel: "GST",
    defaultTaxPercent: 10,
    paymentFields: [
      { key: "bankName", label: "Bank name", placeholder: "Commonwealth Bank" },
      { key: "accountNumber", label: "Account number", placeholder: "12345678" },
      { key: "routingNumber", label: "BSB", placeholder: "062-000" },
    ],
  },
  CA: {
    code: "CA",
    label: "Canada",
    currencyCode: "CAD",
    taxLabel: "GST/HST",
    defaultTaxPercent: 5,
    paymentFields: [
      { key: "bankName", label: "Bank name", placeholder: "RBC" },
      { key: "accountNumber", label: "Account number", placeholder: "XXXXXXXXXX" },
      { key: "routingNumber", label: "Transit / institution number", placeholder: "00001-001" },
    ],
  },
  EU: {
    code: "EU",
    label: "European Union",
    currencyCode: "EUR",
    taxLabel: "VAT",
    defaultTaxPercent: 20,
    paymentFields: [
      { key: "bankName", label: "Bank name", placeholder: "Deutsche Bank" },
      { key: "iban", label: "IBAN", placeholder: "DE89 3704 0044 0532 0130 00" },
      { key: "accountNumber", label: "Account number (if needed)", placeholder: "" },
    ],
  },
  OTHER: {
    code: "OTHER",
    label: "Other / International",
    currencyCode: "USD",
    taxLabel: "VAT",
    defaultTaxPercent: 0,
    paymentFields: OTHER_PAYMENT_FIELDS,
  },
};

function buildGenericConfig(code: string): CountryConfig {
  const iso = getIsoCountry(code);
  const currencyCode = iso?.currencyCode ?? "USD";
  const label = iso?.name ?? code;

  if (EURO_ZONE.has(code)) {
    return {
      code,
      label,
      currencyCode: "EUR",
      taxLabel: "VAT",
      defaultTaxPercent: 20,
      paymentFields: PROFILE_COUNTRY_CONFIGS.EU.paymentFields,
    };
  }

  return {
    code,
    label,
    currencyCode,
    taxLabel: "VAT",
    defaultTaxPercent: 0,
    paymentFields: OTHER_PAYMENT_FIELDS,
  };
}

export function normalizeCountryCode(code: string | null | undefined): CountryCode {
  if (!code) return "US";
  if (code in PROFILE_COUNTRY_CONFIGS) return code;
  if (getIsoCountry(code)) return code;
  return "US";
}

export function getCountryConfig(code: string | null | undefined): CountryConfig {
  const normalized = normalizeCountryCode(code);
  if (PROFILE_COUNTRY_CONFIGS[normalized]) {
    return PROFILE_COUNTRY_CONFIGS[normalized];
  }
  return buildGenericConfig(normalized);
}

export function getCountryLabel(code: string | null | undefined): string {
  if (!code) return "";
  if (PROFILE_COUNTRY_CONFIGS[code]) return PROFILE_COUNTRY_CONFIGS[code].label;
  return getIsoCountryName(code);
}

export function getPaymentFieldsForCountry(
  code: string | null | undefined
): PaymentFieldConfig[] {
  return getCountryConfig(code).paymentFields;
}

export function emptyPaymentDetails(): PaymentDetails {
  return {
    bankName: "",
    accountNumber: "",
    upiId: "",
    routingNumber: "",
    iban: "",
    sortCode: "",
  };
}

export function sanitizePaymentForCountry(
  payment: PaymentDetails,
  countryCode: string | null | undefined
): PaymentDetails {
  const allowed = new Set(
    getPaymentFieldsForCountry(countryCode).map((f) => f.key)
  );
  const next = { ...emptyPaymentDetails(), ...payment };
  for (const key of Object.keys(next) as PaymentFieldKey[]) {
    if (!allowed.has(key)) {
      next[key] = "";
    }
  }
  return next;
}

export function paymentHasVisibleDetails(
  payment: PaymentDetails,
  countryCode: string | null | undefined
): boolean {
  const fields = getPaymentFieldsForCountry(countryCode);
  return fields.some((f) => Boolean(payment[f.key]?.trim()));
}

export function applyCountryDefaults(
  countryCode: CountryCode,
  current?: Partial<{
    currencyCode: string;
    taxLabel: string;
    payment: PaymentDetails;
  }>
): {
  countryCode: CountryCode;
  currencyCode: string;
  taxLabel: string;
  payment: PaymentDetails;
} {
  const config = getCountryConfig(countryCode);
  return {
    countryCode: config.code,
    currencyCode: config.currencyCode,
    taxLabel: config.taxLabel,
    payment: sanitizePaymentForCountry(
      current?.payment ?? emptyPaymentDetails(),
      config.code
    ),
  };
}

/** All ISO currencies, with the country's default currency listed first. */
export function getCurrencyOptionsForCountry(countryCode: string | null | undefined) {
  const primary = getCountryConfig(countryCode).currencyCode;
  const rest = CURRENCY_OPTIONS.filter((c) => c.code !== primary);
  const first = CURRENCY_OPTIONS.find((c) => c.code === primary);
  return first ? [first, ...rest] : CURRENCY_OPTIONS;
}
