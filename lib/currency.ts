/** ISO 4217 codes supported in onboarding / settings */
export const CURRENCY_OPTIONS = [
  { code: "USD", label: "US Dollar ($)", symbol: "$" },
  { code: "EUR", label: "Euro (€)", symbol: "€" },
  { code: "GBP", label: "British Pound (£)", symbol: "£" },
  { code: "INR", label: "Indian Rupee (₹)", symbol: "₹" },
  { code: "AUD", label: "Australian Dollar (A$)", symbol: "A$" },
  { code: "CAD", label: "Canadian Dollar (C$)", symbol: "C$" },
  { code: "JPY", label: "Japanese Yen (¥)", symbol: "¥" },
] as const;

export function getCurrencySymbol(code: string): string {
  return (
    CURRENCY_OPTIONS.find((c) => c.code === code)?.symbol ?? code
  );
}

export function formatMoney(amount: number, currencyCode: string): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currencyCode,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${getCurrencySymbol(currencyCode)}${amount.toFixed(2)}`;
  }
}
