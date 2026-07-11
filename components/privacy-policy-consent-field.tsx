"use client";

import Link from "next/link";
import { useConsentCountry } from "@/hooks/use-consent-country";
import { getPrimaryDataLaw } from "@/data/data-protection-laws";
import { getIsoCountryName } from "@/lib/iso-data";
import { cn } from "@/lib/utils";

type PrivacyPolicyConsentFieldProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  id?: string;
  className?: string;
  compact?: boolean;
  /** SSR hint from IP geo cookie. */
  initialCountryCode?: string;
};

export function PrivacyPolicyConsentField({
  checked,
  onCheckedChange,
  id = "privacy-policy-consent",
  className,
  compact = false,
  initialCountryCode,
}: PrivacyPolicyConsentFieldProps) {
  const countryCode = useConsentCountry(initialCountryCode);
  const law = countryCode ? getPrimaryDataLaw(countryCode) : null;
  const countryName = countryCode ? getIsoCountryName(countryCode) : "";
  const showRegional = Boolean(
    countryCode && law && law.id !== "general" && countryName
  );

  if (compact) {
    return (
      <label
        htmlFor={id}
        className={cn(
          "flex cursor-pointer items-start gap-2.5 text-left text-[11px] leading-snug text-muted-foreground",
          className
        )}
      >
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onCheckedChange(e.target.checked)}
          required
          className="mt-0.5 h-3.5 w-3.5 shrink-0 rounded border-border accent-primary"
        />
        <span>
          I agree to the{" "}
          <Link href="/terms" className="text-foreground hover:underline">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-foreground hover:underline">
            Privacy Policy
          </Link>
          {showRegional && law ? (
            <span className="text-muted-foreground/80">
              {" "}
              ({law.shortName}, {countryName})
            </span>
          ) : null}
          .
        </span>
      </label>
    );
  }

  return (
    <label
      htmlFor={id}
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-lg border border-border/60 bg-muted/20 p-3 text-left text-xs leading-relaxed text-muted-foreground",
        className
      )}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
        required
        className="mt-0.5 h-4 w-4 shrink-0 rounded border-border accent-primary"
      />
      <span>
        I agree to the{" "}
        <Link href="/terms" className="text-foreground hover:underline">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="text-foreground hover:underline">
          Privacy Policy
        </Link>
        {showRegional && law ? (
          <span className="text-muted-foreground/90">
            {" "}
            ({law.shortName}, {countryName})
          </span>
        ) : null}
        .
      </span>
    </label>
  );
}
