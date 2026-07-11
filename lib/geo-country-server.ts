import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { isIndianCountry } from "@/lib/country";
import { GEO_COUNTRY_COOKIE } from "@/lib/geo-market";

export function readGeoCountryFromRequest(
  request: NextRequest
): string | null {
  return request.cookies.get(GEO_COUNTRY_COOKIE)?.value ?? null;
}

export async function readGeoCountryFromServerCookies(): Promise<
  string | null
> {
  const cookieStore = await cookies();
  return cookieStore.get(GEO_COUNTRY_COOKIE)?.value ?? null;
}

export function isIndianGeoCountry(
  countryCode: string | null | undefined
): boolean {
  return isIndianCountry(countryCode);
}
