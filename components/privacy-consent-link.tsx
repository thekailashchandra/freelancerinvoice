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
    <button
      type="button"
      onClick={openCookieConsentPreferences}
      className={cn(
        "cursor-pointer bg-transparent p-0 text-inherit hover:underline",
        className
      )}
    >
      {label ?? t("cookie.cookieSettings")}
    </button>
  );
}
