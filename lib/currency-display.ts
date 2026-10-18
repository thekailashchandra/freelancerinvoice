import { ISO_COUNTRIES, ISO_CURRENCIES } from "@/lib/iso-data";
import { formatInvoiceAmount } from "@/lib/utils";

const currencyByCode = new Map(ISO_CURRENCIES.map((c) => [c.code, c]));

/** Regional indicator flag from ISO 3166-1 alpha-2. */
export function countryCodeToFlag(code: string): string {
  if (code.length !== 2) return "🏳️";
  const upper = code.toUpperCase();
  return String.fromCodePoint(
    ...[...upper].map((c) => 0x1f1e6 - 65 + c.charCodeAt(0))
  );
}

const currencyFlagMap = (() => {
  const map = new Map<string, string>();
  map.set("EUR", "🇪🇺");
  map.set("USD", "🇺🇸");
  map.set("GBP", "🇬🇧");
  map.set("INR", "🇮🇳");
  for (const country of ISO_COUNTRIES) {
    if (!map.has(country.currencyCode)) {
      map.set(country.currencyCode, countryCodeToFlag(country.code));
    }
  }
  return map;
})();

export function getCurrencySymbol(code: string): string {
  return currencyByCode.get(code)?.symbol ?? code;
}

export function getCurrencyName(code: string): string {
  return currencyByCode.get(code)?.name ?? code;
}

export function getCurrencyFlag(code: string): string {
  return currencyFlagMap.get(code) ?? "💱";
}

export function getCurrencyLabel(code: string): string {
  const c = currencyByCode.get(code);
  if (!c) return code;
  return `${c.name} (${c.symbol})`;
}

/** Amount with symbol for invoice preview/PDF (e.g. ₹630.00). */
export function formatInvoiceMoney(amount: number, currencyCode: string): string {
  const symbol = getCurrencySymbol(currencyCode);
  const formatted = formatInvoiceAmount(amount);
  if (/^[A-Z]{3}$/.test(symbol)) {
    return `${symbol} ${formatted}`;
  }
  return `${symbol}${formatted}`;
}

/** HTML snippet for PDF export - symbol + amount only. */
export function invoiceMoneyHtml(amount: number, currencyCode: string): string {
  const money = formatInvoiceMoney(amount, currencyCode);
  return `<span style="white-space:nowrap">${money}</span>`;
}

export function formatMoney(amount: number, currencyCode: string): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currencyCode,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return formatInvoiceMoney(amount, currencyCode);
  }
}
