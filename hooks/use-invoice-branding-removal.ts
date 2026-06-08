"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";
import { updateProfileAction } from "@/lib/actions/profile";
import type { Invoice } from "@/types/invoice";

export function useInvoiceBrandingRemoval(
  invoice: Invoice | null,
  onInvoiceUpdate?: (invoice: Invoice) => void
) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const hideBranding = invoice?.company.hideInvoiceBranding ?? false;

  const requestRemoval = useCallback(() => {
    setDialogOpen(true);
  }, []);

  const confirmRemoval = useCallback(async () => {
    setConfirming(true);
    try {
      await updateProfileAction({ hideInvoiceBranding: true });
      if (invoice && onInvoiceUpdate) {
        onInvoiceUpdate({
          ...invoice,
          company: { ...invoice.company, hideInvoiceBranding: true },
        });
      }
      setDialogOpen(false);
      toast.success("Branding removed", {
        description: "Thank you for supporting the project.",
      });
    } catch (err) {
      toast.error("Could not remove branding", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setConfirming(false);
    }
  }, [invoice, onInvoiceUpdate]);

  return {
    hideBranding,
    dialogOpen,
    setDialogOpen,
    requestRemoval,
    confirmRemoval,
    confirming,
  };
}
