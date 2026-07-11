"use client";

import { useCallback, useEffect, useState } from "react";
import { PolicyUpdateDialog } from "@/components/policy-update-dialog";
import { GEO_IP_COUNTRY_COOKIE } from "@/lib/geo-market";
import type { OutstandingLegalUpdates } from "@/lib/legal-consent";

function readIpCountryCookie(): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${GEO_IP_COUNTRY_COOKIE}=([^;]*)`)
  );
  return match ? decodeURIComponent(match[1]) : undefined;
}

type ConsentStatusResponse = {
  ok?: boolean;
  required?: boolean;
  updates?: OutstandingLegalUpdates;
};

export function PolicyUpdateGate() {
  const [open, setOpen] = useState(false);
  const [updates, setUpdates] = useState<OutstandingLegalUpdates>({
    privacy: true,
    terms: true,
  });
  const [checked, setChecked] = useState(false);

  const loadStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/legal-consent", { cache: "no-store" });
      const data = (await res.json()) as ConsentStatusResponse;
      if (!data.ok) return;

      setChecked(true);
      if (data.required && data.updates) {
        setUpdates(data.updates);
        setOpen(true);
      } else {
        setOpen(false);
      }
    } catch {
      // Retry on next navigation if the check fails.
    }
  }, []);

  useEffect(() => {
    void loadStatus();
  }, [loadStatus]);

  if (!checked) return null;

  return (
    <PolicyUpdateDialog
      open={open}
      updates={updates}
      initialCountryCode={readIpCountryCookie()}
      onAccepted={() => {
        setOpen(false);
        void loadStatus();
      }}
    />
  );
}
