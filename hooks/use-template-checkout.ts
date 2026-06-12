"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";
import {
  getInvoiceTemplate,
  getTemplatePricing,
  type InvoiceTemplateId,
} from "@/lib/invoice-templates";
import type { MarketRegion } from "@/lib/geo-market";
import { unlockTemplate } from "@/lib/template-unlocks";
import {
  buildReceiptData,
  downloadPaymentReceiptPdf,
} from "@/lib/payment-receipt-pdf";

type UseTemplateCheckoutOptions = {
  market: MarketRegion;
  onUnlocked?: () => void;
};

export function useTemplateCheckout({
  market,
  onUnlocked,
}: UseTemplateCheckoutOptions) {
  const [unlockDialogOpen, setUnlockDialogOpen] = useState(false);
  const [pendingTemplateId, setPendingTemplateId] = useState<InvoiceTemplateId>(
    "modern"
  );
  const [unlockingKofi, setUnlockingKofi] = useState(false);

  const pricing = getTemplatePricing(market);

  const openKofiUnlock = useCallback((templateId: InvoiceTemplateId) => {
    setPendingTemplateId(templateId);
    setUnlockDialogOpen(true);
  }, []);

  const confirmKofiUnlock = useCallback(() => {
    setUnlockingKofi(true);
    const unlock = {
      templateId: pendingTemplateId,
      sessionId: `kofi_${Date.now()}`,
      unlockedAt: new Date().toISOString(),
      amountDisplay: pricing.displayAmount,
      currency: pricing.currency,
    };
    unlockTemplate(unlock);
    setUnlockDialogOpen(false);
    setUnlockingKofi(false);
    onUnlocked?.();
    toast.success("Template unlocked!", {
      description: "You can now download your PDF.",
      action: {
        label: "Download receipt",
        onClick: () => {
          void downloadPaymentReceiptPdf(buildReceiptData(unlock, null));
        },
      },
    });
  }, [pendingTemplateId, pricing, onUnlocked]);

  const startCheckout = useCallback(
    async (templateId: InvoiceTemplateId) => {
      const template = getInvoiceTemplate(templateId);

      if (!template.isPremium) {
        return true;
      }

      openKofiUnlock(templateId);
      return false;
    },
    [openKofiUnlock]
  );

  return {
    checkingOut: false,
    unlockDialogOpen,
    setUnlockDialogOpen,
    pendingTemplateId,
    unlockingKofi,
    pricing,
    openKofiUnlock,
    confirmKofiUnlock,
    startCheckout,
  };
}
