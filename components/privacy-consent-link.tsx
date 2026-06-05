"use client";

import { cn } from "@/lib/utils";

type PrivacyConsentLinkProps = {
  className?: string;
  label?: string;
};

/** Re-opens Google's CMP so users can change consent (IAB TCF requirement). */
export function PrivacyConsentLink({
  className,
  label = "Cookie settings",
}: PrivacyConsentLinkProps) {
  const openConsent = () => {
    const googlefc = (
      window as Window & {
        googlefc?: {
          callbackQueue?: Array<Record<string, () => void>>;
          showRevocationMessage?: () => void;
        };
      }
    ).googlefc;

    if (!googlefc) return;

    googlefc.callbackQueue = googlefc.callbackQueue ?? [];
    googlefc.callbackQueue.push({
      INITIAL_CONSENT_DATA_READY: () => {
        googlefc.showRevocationMessage?.();
      },
    });
  };

  return (
    <button
      type="button"
      onClick={openConsent}
      className={cn(
        "cursor-pointer bg-transparent p-0 text-inherit hover:underline",
        className
      )}
    >
      {label}
    </button>
  );
}
