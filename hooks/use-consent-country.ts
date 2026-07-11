"use client";

import { useEffect, useState } from "react";
import {
  GEO_IP_COUNTRY_COOKIE,
  resolveDefaultCountryCode,
} from "@/lib/geo-market";
import { guessConsentCountryFromTimezone } from "@/lib/consent-country";

function readIpCountryCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${GEO_IP_COUNTRY_COOKIE}=([^;]*)`)
  );
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Country for legal consent — IP detection only, not locale switcher.
 */
export function useConsentCountry(initialCountryCode?: string | null): string | null {
  const [countryCode, setCountryCode] = useState<string | null>(() => {
    const fromCookie = readIpCountryCookie();
    if (fromCookie) return resolveDefaultCountryCode(fromCookie);
    if (initialCountryCode) return resolveDefaultCountryCode(initialCountryCode);
    return null;
  });

  useEffect(() => {
    let cancelled = false;

    async function resolve() {
      const fromCookie = readIpCountryCookie();
      if (fromCookie) {
        if (!cancelled) {
          setCountryCode(resolveDefaultCountryCode(fromCookie));
        }
        return;
      }

      try {
        const res = await fetch("/api/geo/consent-country", {
          cache: "no-store",
        });
        const data = (await res.json()) as {
          ok?: boolean;
          countryCode?: string | null;
        };
        if (!cancelled && data.ok && data.countryCode) {
          setCountryCode(resolveDefaultCountryCode(data.countryCode));
          return;
        }
      } catch {
        // fall through
      }

      if (!cancelled) {
        const guessed = guessConsentCountryFromTimezone();
        if (guessed) {
          setCountryCode(guessed);
        } else if (initialCountryCode) {
          setCountryCode(resolveDefaultCountryCode(initialCountryCode));
        }
      }
    }

    void resolve();

    return () => {
      cancelled = true;
    };
  }, [initialCountryCode]);

  return countryCode;
}
