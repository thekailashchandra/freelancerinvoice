import type { PaymentDetails } from "@/types/invoice";
import { CURRENCY_OPTIONS } from "@/lib/currency";

/** ISO 3166-1 alpha-2 */
export type CountryCode =
  | "IN"
  | "US"
  | "GB"
  | "AU"
  | "CA"
  | "EU"
  | "OTHER";

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

export const COUNTRY_OPTIONS: { code: CountryCode; label: string }[] = [
  { code: "IN", label: "India" },
  { code: "US", label: "United States" },
  { code: "GB", label: "United Kingdom" },
  { code: "AU", label: "Australia" },
  { code: "CA", label: "Canada" },
  { code: "EU", label: "European Union" },
  { code: "OTHER", label: "Other / International" },
];

const COUNTRY_CONFIGS: Record<CountryCode, CountryConfig> = {
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
    paymentFields: [
      { key: "bankName", label: "Bank name", placeholder: "Your bank" },
      { key: "accountNumber", label: "Account number", placeholder: "XXXXXXXXXX" },
      { key: "iban", label: "IBAN / SWIFT reference (optional)", placeholder: "" },
    ],
  },
};

export function normalizeCountryCode(code: string | null | undefined): CountryCode {
  if (code && code in COUNTRY_CONFIGS) {
    return code as CountryCode;
  }
  return "OTHER";
}

export function getCountryConfig(code: string | null | undefined): CountryConfig {
  return COUNTRY_CONFIGS[normalizeCountryCode(code)];
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

/** Drop values for payment fields that do not apply in the selected country. */
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
    countryCode,
    currencyCode: config.currencyCode,
    taxLabel: config.taxLabel,
    payment: sanitizePaymentForCountry(
      current?.payment ?? emptyPaymentDetails(),
      countryCode
    ),
  };
}

/** Currencies shown in settings — primary for country first, then common alternatives. */
export function getCurrencyOptionsForCountry(countryCode: string | null | undefined) {
  const primary = getCountryConfig(countryCode).currencyCode;
  const codes = new Set<string>([primary]);
  const extras: Record<CountryCode, string[]> = {
    IN: ["USD", "EUR"],
    US: ["EUR", "GBP", "CAD"],
    GB: ["EUR", "USD"],
    AU: ["USD", "NZD"],
    CA: ["USD"],
    EU: ["GBP", "USD"],
    OTHER: ["EUR", "GBP", "INR"],
  };
  for (const c of extras[normalizeCountryCode(countryCode)]) {
    codes.add(c);
  }
  const ordered = [primary, ...[...codes].filter((c) => c !== primary)];
  return ordered
    .map((code) => CURRENCY_OPTIONS.find((c) => c.code === code))
    .filter((c): c is (typeof CURRENCY_OPTIONS)[number] => Boolean(c));
}
