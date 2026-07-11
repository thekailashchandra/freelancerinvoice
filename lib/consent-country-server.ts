import "server-only";

import { cookies, headers } from "next/headers";
import { resolveConsentCountryCode } from "@/lib/consent-country";
import { GEO_IP_COUNTRY_COOKIE } from "@/lib/geo-market";

export async function readConsentCountryFromServerCookies(): Promise<
  string | null
> {
  const cookieStore = await cookies();
  const headerStore = await headers();

  return resolveConsentCountryCode({
    ipCookie: cookieStore.get(GEO_IP_COUNTRY_COOKIE)?.value ?? null,
    requestHeaders: headerStore,
  });
}
