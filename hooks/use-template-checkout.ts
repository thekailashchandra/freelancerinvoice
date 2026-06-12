"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";
import {
  getInvoiceTemplate,
  getTemplatePricing,
  type InvoiceTemplateId,
} from "@/lib/invoice-templates";
import type { MarketRegion } from "@/lib/geo-market";
import { openRazorpayCheckout } from "@/lib/razorpay-checkout";
import { unlockTemplate } from "@/lib/template-unlocks";
import {
  buildReceiptData,
  downloadPaymentReceiptPdf,
} from "@/lib/payment-receipt-pdf";
import { isRazorpayEnabled } from "@/lib/razorpay-feature";

type UseTemplateCheckoutOptions = {
  market: MarketRegion;
  razorpayConfigured?: boolean;
  onUnlocked?: () => void;
};

export function useTemplateCheckout({
  market,
  razorpayConfigured = false,
  onUnlocked,
}: UseTemplateCheckoutOptions) {
  const [unlockDialogOpen, setUnlockDialogOpen] = useState(false);
  const [pendingTemplateId, setPendingTemplateId] = useState<InvoiceTemplateId>(
    "modern"
  );
  const [unlockingKofi, setUnlockingKofi] = useState(false);
  const [payingRazorpay, setPayingRazorpay] = useState(false);

  const pricing = getTemplatePricing(market);
  const razorpayEnabled =
    isRazorpayEnabled() && market === "IN" && razorpayConfigured;

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

  const confirmRazorpayUnlock = useCallback(async () => {
    setPayingRazorpay(true);
    try {
      const orderRes = await fetch("/api/razorpay/template-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: pendingTemplateId,
          market,
        }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        throw new Error(orderData.error ?? "Could not start Razorpay checkout");
      }

      const template = getInvoiceTemplate(pendingTemplateId);
      const payment = await openRazorpayCheckout({
        keyId: orderData.keyId,
        orderId: orderData.orderId,
        amountPaise: orderData.amountPaise,
        currency: orderData.currency,
        name: orderData.merchantName,
        description: orderData.description,
        notes: {
          template_id: pendingTemplateId,
          purpose: "template",
        },
      });

      const verifyRes = await fetch("/api/razorpay/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payment),
      });
      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) {
        throw new Error(verifyData.error ?? "Payment verification failed");
      }

      const unlock = {
        templateId: pendingTemplateId,
        sessionId: payment.razorpay_payment_id,
        unlockedAt: new Date().toISOString(),
        amountDisplay: pricing.displayAmount,
        currency: pricing.currency,
      };
      unlockTemplate(unlock);
      setUnlockDialogOpen(false);
      onUnlocked?.();
      toast.success(`${template.name} template unlocked`, {
        description: "Payment verified via Razorpay.",
        action: {
          label: "Download receipt",
          onClick: () => {
            void downloadPaymentReceiptPdf(buildReceiptData(unlock, null));
          },
        },
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Razorpay checkout failed";
      if (message !== "Payment cancelled") {
        toast.error("Payment failed", { description: message });
      }
    } finally {
      setPayingRazorpay(false);
    }
  }, [pendingTemplateId, market, pricing, onUnlocked]);

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
    checkingOut: payingRazorpay,
    unlockDialogOpen,
    setUnlockDialogOpen,
    pendingTemplateId,
    unlockingKofi,
    payingRazorpay,
    razorpayEnabled,
    pricing,
    openKofiUnlock,
    confirmKofiUnlock,
    confirmRazorpayUnlock,
    startCheckout,
  };
}
