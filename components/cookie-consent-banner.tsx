"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/components/locale-provider";
import { siteConfig } from "@/data/site";
import { formatMessage } from "@/lib/i18n/format-message";
import {
  OPEN_COOKIE_CONSENT_EVENT,
  readConsentCookie,
  saveCookieConsent,
  type CookieConsentChoice,
} from "@/lib/cookie-consent";

export function CookieConsentBanner() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!readConsentCookie()) {
      setVisible(true);
    }

    const handleOpen = () => setVisible(true);
    window.addEventListener(OPEN_COOKIE_CONSENT_EVENT, handleOpen);
    return () => window.removeEventListener(OPEN_COOKIE_CONSENT_EVENT, handleOpen);
  }, []);

  const handleChoice = (choice: CookieConsentChoice) => {
    saveCookieConsent(choice);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
      className="fixed inset-x-0 bottom-0 z-[100] border-t border-border bg-background/95 p-4 shadow-2xl backdrop-blur supports-[backdrop-filter]:bg-background/90 sm:p-5"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0 space-y-3 pr-1">
          <p id="cookie-consent-title" className="text-sm font-semibold text-foreground">
            {t("cookie.title")}
          </p>
          <div id="cookie-consent-description" className="space-y-2">
            <p className="text-sm leading-relaxed text-muted-foreground">
              {formatMessage(t("cookie.intro"), { name: siteConfig.name })}
            </p>
            <ul className="space-y-1.5 text-xs leading-relaxed text-muted-foreground sm:text-sm">
              <li className="flex gap-2">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" aria-hidden />
                <span>{t("cookie.pointEssential")}</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" aria-hidden />
                <span>{t("cookie.pointAnalytics")}</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" aria-hidden />
                <span>{t("cookie.pointAds")}</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" aria-hidden />
                <span>{t("cookie.pointData")}</span>
              </li>
            </ul>
            <p className="text-sm text-muted-foreground">
              {t("cookie.privacyLead")}{" "}
              <Link href="/privacy" className="text-primary underline-offset-4 hover:underline">
                {t("cookie.privacyPolicy")}
              </Link>
              .
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-stretch lg:flex-col lg:items-stretch xl:flex-row xl:items-center">
          <Button
            type="button"
            variant="outline"
            className="h-auto w-full flex-col gap-0.5 py-2.5 sm:w-auto lg:w-44"
            onClick={() => handleChoice("essential")}
          >
            <span>{t("cookie.essentialOnly")}</span>
            <span className="text-[11px] font-normal text-muted-foreground">
              {t("cookie.essentialHint")}
            </span>
          </Button>
          <Button
            type="button"
            className="h-auto w-full flex-col gap-0.5 py-2.5 sm:w-auto lg:w-44"
            onClick={() => handleChoice("all")}
          >
            <span>{t("cookie.accept")}</span>
            <span className="text-[11px] font-normal text-primary-foreground/80">
              {t("cookie.acceptHint")}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
