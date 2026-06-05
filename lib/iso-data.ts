import countriesJson from "@/data/iso-countries.json";
import currenciesJson from "@/data/iso-currencies.json";

export type IsoCountry = {
  code: string;
  name: string;
  currencyCode: string;
};

export type IsoCurrency = {
  code: string;
  name: string;
  symbol: string;
};

export const ISO_COUNTRIES: IsoCountry[] = countriesJson as IsoCountry[];
export const ISO_CURRENCIES: IsoCurrency[] = currenciesJson as IsoCurrency[];

const countryByCode = new Map(ISO_COUNTRIES.map((c) => [c.code, c]));

export function getIsoCountry(code: string | null | undefined): IsoCountry | undefined {
  if (!code) return undefined;
  return countryByCode.get(code);
}

export function getIsoCountryName(code: string | null | undefined): string {
  if (!code) return "";
  if (code === "EU") return "European Union";
  if (code === "OTHER") return "Other / International";
  return getIsoCountry(code)?.name ?? code;
}
