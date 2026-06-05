import { ISO_CURRENCIES } from "@/lib/iso-data";
import {
  formatMoney,
  getCurrencyLabel,
  getCurrencySymbol,
} from "@/lib/currency-display";

export type CurrencyOption = {
  code: string;
  label: string;
  symbol: string;
  name: string;
};

export const CURRENCY_OPTIONS: CurrencyOption[] = ISO_CURRENCIES.map((c) => ({
  code: c.code,
  name: c.name,
  symbol: c.symbol,
  label: `${c.name} (${c.symbol})`,
}));

export { formatMoney, getCurrencyLabel, getCurrencySymbol };
