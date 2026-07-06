import { type NextRequest, NextResponse } from "next/server";
import { applyApiRateLimit } from "@/lib/api-rate-limit";
import { applyGeoCookies } from "@/lib/geo-routing";
import { applySecurityHeaders } from "@/lib/security-headers";
import { defaultLocaleForCountry } from "@/lib/i18n/country-locale";
import { LOCALE_COOKIE, LOCALE_COUNTRY_COOKIE } from "@/lib/i18n/types";
import { isLocaleCode } from "@/lib/i18n/translate";
import { GEO_COUNTRY_COOKIE } from "@/lib/geo-market";
import { updateSession } from "@/lib/supabase/middleware";

const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/** App pages migrated to API routes — block stale Server Action POSTs in dev. */
const DEV_API_ONLY_PREFIXES = [
  "/dashboard",
  "/create-invoice",
  "/invoice-history",
  "/customers",
  "/settings",
  "/onboarding",
  "/support",
  "/signup",
  "/login",
];

function isServerActionRequest(request: NextRequest): boolean {
  return (
    request.method === "POST" &&
    (request.headers.has("next-action") ||
      request.headers.has("Next-Action") ||
      request.headers.has("x-action"))
  );
}

function blockStaleDevServerAction(request: NextRequest): NextResponse | null {
  if (process.env.NODE_ENV !== "development") return null;
  if (!isServerActionRequest(request)) return null;

  const pathname = request.nextUrl.pathname;
  const isApiOnlyRoute = DEV_API_ONLY_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (!isApiOnlyRoute) return null;

  return NextResponse.json(
    {
      error:
        "Stale client bundle — this page no longer uses Server Actions. Reloading…",
    },
    {
      status: 410,
      headers: {
        "Cache-Control": "no-store",
        "X-IFF-Stale-Action": "1",
      },
    }
  );
}

function applyDevNoStore(response: Response) {
  if (process.env.NODE_ENV === "development") {
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, max-age=0"
    );
  }
  return response;
}

function finalizeResponse(request: NextRequest, response: Response) {
  return applySecurityHeaders(request, applyDevNoStore(response));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/")) {
    const limited = await applyApiRateLimit(request);
    if (limited) return finalizeResponse(request, limited);
    return finalizeResponse(request, NextResponse.next());
  }

  const blocked = blockStaleDevServerAction(request);
  if (blocked) return finalizeResponse(request, blocked);

  const response = await updateSession(request);
  const withGeo = applyGeoCookies(request, response);

  if (!request.cookies.has(LOCALE_COOKIE)) {
    const country =
      withGeo.cookies.get(GEO_COUNTRY_COOKIE)?.value ??
      request.cookies.get(GEO_COUNTRY_COOKIE)?.value ??
      "US";
    const locale = defaultLocaleForCountry(country);
    withGeo.cookies.set(LOCALE_COOKIE, locale, {
      maxAge: LOCALE_COOKIE_MAX_AGE,
      path: "/",
      sameSite: "lax",
    });
    withGeo.cookies.set(LOCALE_COUNTRY_COOKIE, country, {
      maxAge: LOCALE_COOKIE_MAX_AGE,
      path: "/",
      sameSite: "lax",
    });
  } else {
    const existing = request.cookies.get(LOCALE_COOKIE)?.value;
    if (existing && !isLocaleCode(existing)) {
      const country = withGeo.cookies.get(GEO_COUNTRY_COOKIE)?.value ?? "US";
      withGeo.cookies.set(LOCALE_COOKIE, defaultLocaleForCountry(country), {
        maxAge: LOCALE_COOKIE_MAX_AGE,
        path: "/",
        sameSite: "lax",
      });
    }
  }

  return finalizeResponse(request, withGeo);
}

export const config = {
  matcher: [
    "/api/:path*",
    "/((?!_next/static|_next/image|favicon.ico|ads\\.txt|icon|apple-icon|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
