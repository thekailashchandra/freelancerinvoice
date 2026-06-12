"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";
import { updateProfileClient } from "@/lib/api/profile-client";
import { getBrandingRemovalPricing } from "@/lib/invoice-branding";
import type { MarketRegion } from "@/lib/geo-market";
import type { CompanySettings, Invoice } from "@/types/invoice";

function readHideBranding(value: Invoice | CompanySettings): boolean {
  if ("company" in value) {
    return value.company.hideInvoiceBranding ?? false;
  }
  return value.hideInvoiceBranding ?? false;
}

export function useInvoiceBrandingRemoval<T extends Invoice | CompanySettings>(
  value: T | null,
  onUpdate: (next: T) => void
) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const hideBranding = value ? readHideBranding(value) : false;

  const market: MarketRegion =
    value && "company" in value
      ? value.company.countryCode === "IN"
        ? "IN"
        : "GLOBAL"
      : value?.countryCode === "IN"
        ? "IN"
        : "GLOBAL";

  const pricing = getBrandingRemovalPricing(market);

  const requestRemoval = useCallback(() => {
    setDialogOpen(true);
  }, []);

  const confirmKofiRemoval = useCallback(async () => {
    if (!value) return;

    setConfirming(true);
    try {
      await updateProfileClient({ hideInvoiceBranding: true });

      if ("company" in value) {
        onUpdate({
          ...value,
          company: { ...value.company, hideInvoiceBranding: true },
        } as T);
      } else {
        onUpdate({ ...value, hideInvoiceBranding: true } as T);
      }

      setDialogOpen(false);
      toast.success("Footer removed", {
        description: "The Powered by line will no longer appear on your invoices.",
      });
    } catch (err) {
      toast.error("Could not save preference", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setConfirming(false);
    }
  }, [value, onUpdate]);

  return {
    hideBranding,
    dialogOpen,
    setDialogOpen,
    requestRemoval,
    confirmKofiRemoval,
    confirming,
    pricing,
  };
}
