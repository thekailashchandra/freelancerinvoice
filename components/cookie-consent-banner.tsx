"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/components/locale-provider";
import {
  OPEN_COOKIE_CONSENT_EVENT,
  readConsentCookie,
  saveCookieConsent,
  type CookieConsentChoice,
} from "@/lib/cookie-consent";

export function CookieConsentBanner() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const open = () => {
      setVisible(true);
      requestAnimationFrame(() => {
        bannerRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      });
    };

    if (!readConsentCookie()) {
      open();
    } else if (window.location.hash === "#cookie-preferences") {
      open();
    }

    const onHashChange = () => {
      if (window.location.hash === "#cookie-preferences") {
        open();
      }
    };

    window.addEventListener(OPEN_COOKIE_CONSENT_EVENT, open);
    window.addEventListener("hashchange", onHashChange);
    return () => {
      window.removeEventListener(OPEN_COOKIE_CONSENT_EVENT, open);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);

  const handleChoice = (choice: CookieConsentChoice) => {
    saveCookieConsent(choice);
    setVisible(false);
    if (window.location.hash === "#cookie-preferences") {
      window.history.replaceState(null, "", window.location.pathname);
    }
  };

  if (!visible) return null;

  return (
    <div
      ref={bannerRef}
      role="dialog"
      aria-labelledby="cookie-consent-message"
      className="fixed inset-x-0 bottom-0 z-[100] border-t border-border bg-background/95 px-4 py-3 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/90"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <p
          id="cookie-consent-message"
          className="text-xs leading-snug text-muted-foreground sm:text-sm"
        >
          {t("cookie.message")}{" "}
          <Link href="/privacy" className="text-primary underline-offset-4 hover:underline">
            {t("cookie.privacyPolicy")}
          </Link>
          .
        </p>

        <div className="flex shrink-0 gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 px-3 text-xs sm:text-sm"
            onClick={() => handleChoice("essential")}
          >
            {t("cookie.essentialOnly")}
          </Button>
          <Button
            type="button"
            size="sm"
            className="h-8 px-3 text-xs sm:text-sm"
            onClick={() => handleChoice("all")}
          >
            {t("cookie.accept")}
          </Button>
        </div>
      </div>
    </div>
  );
}
