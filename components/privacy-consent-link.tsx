"use client";

import { cn } from "@/lib/utils";
import { useTranslation } from "@/components/locale-provider";
import { openCookieConsentPreferences } from "@/lib/cookie-consent";

type PrivacyConsentLinkProps = {
  className?: string;
  label?: string;
};

/** Re-opens the site cookie consent banner so users can change their choices. */
export function PrivacyConsentLink({ className, label }: PrivacyConsentLinkProps) {
  const { t } = useTranslation();

  return (
    <a
      href="#cookie-preferences"
      onClick={(event) => {
        event.preventDefault();
        openCookieConsentPreferences();
      }}
      className={cn(
        "not-prose cursor-pointer font-medium text-primary underline underline-offset-4 hover:opacity-90",
        className
      )}
    >
      {label ?? t("cookie.cookieSettings")}
    </a>
  );
}
