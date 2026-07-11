import { NextRequest, NextResponse } from "next/server";
import {
  GEO_IP_COUNTRY_COOKIE,
  readConsentCountryFromRequest,
} from "@/lib/consent-country";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export async function GET(request: NextRequest) {
  const countryCode = readConsentCountryFromRequest(request);
  const response = NextResponse.json({ ok: true, countryCode });

  if (countryCode) {
    response.cookies.set(GEO_IP_COUNTRY_COOKIE, countryCode, {
      maxAge: COOKIE_MAX_AGE,
      path: "/",
      sameSite: "lax",
    });
  }

  return response;
}
