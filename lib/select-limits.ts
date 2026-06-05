/** Trim long ISO lists for faster first paint; full list available via search */

const COMMON_CURRENCY_CODES = [
  "USD", "EUR", "GBP", "INR", "CAD", "AUD", "JPY", "CHF", "SGD", "AED",
  "NZD", "ZAR", "BRL", "MXN", "HKD", "SEK", "NOK", "DKK", "PLN", "CNY",
  "KRW", "THB", "MYR", "IDR", "PHP", "PKR", "BDT", "NGN", "EGP", "TRY",
];

const COMMON_COUNTRY_CODES = [
  "US", "IN", "GB", "CA", "AU", "DE", "FR", "NL", "SG", "AE", "CH", "JP",
  "NZ", "IE", "ES", "IT", "BR", "MX", "ZA", "PL", "SE", "NO", "DK", "BE",
  "AT", "PT", "HK", "MY", "PH", "ID", "TH", "KR", "CN", "PK", "BD", "NG",
];

export function limitSelectOptions<T extends { code: string }>(
  options: T[],
  search: string,
  selectedCode: string,
  commonCodes: string[],
  limit = 40
): { items: T[]; truncated: boolean } {
  const q = search.trim().toLowerCase();
  if (q) {
    const items = options.filter(
      (o) =>
        o.code.toLowerCase().includes(q) ||
        ("label" in o && String((o as { label: string }).label).toLowerCase().includes(q)) ||
        ("name" in o && String((o as { name: string }).name).toLowerCase().includes(q))
    );
    return { items, truncated: false };
  }

  const byCode = new Map(options.map((o) => [o.code, o]));
  const picked = new Set<string>();
  const items: T[] = [];

  const add = (code: string) => {
    if (picked.has(code)) return;
    const row = byCode.get(code);
    if (row) {
      items.push(row);
      picked.add(code);
    }
  };

  if (selectedCode) add(selectedCode);
  for (const code of commonCodes) add(code);

  for (const row of options) {
    if (items.length >= limit) break;
    if (!picked.has(row.code)) {
      items.push(row);
      picked.add(row.code);
    }
  }

  return { items, truncated: items.length < options.length };
}

export function limitCurrencyOptions<
  T extends { code: string; name?: string; symbol?: string; label?: string },
>(options: T[], search: string, selectedCode: string) {
  const q = search.trim().toLowerCase();
  if (q) {
    const items = options.filter(
      (c) =>
        c.code.toLowerCase().includes(q) ||
        c.name?.toLowerCase().includes(q) ||
        c.symbol?.toLowerCase().includes(q) ||
        c.label?.toLowerCase().includes(q)
    );
    return { items, truncated: false };
  }
  return limitSelectOptions(options, search, selectedCode, COMMON_CURRENCY_CODES, 36);
}

export function limitCountryOptions<T extends { code: string; label: string }>(
  options: T[],
  search: string,
  selectedCode: string
) {
  const q = search.trim().toLowerCase();
  if (q) {
    const items = options.filter(
      (c) =>
        c.label.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
    );
    return { items, truncated: false };
  }
  return limitSelectOptions(options, search, selectedCode, COMMON_COUNTRY_CODES, 36);
}
