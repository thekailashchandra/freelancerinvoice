"use client";

import { useCallback, useEffect, useState } from "react";
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
  const [payingRazorpay, setPayingRazorpay] = useState(false);
  const [razorpayEnabled, setRazorpayEnabled] = useState(false);

  const pricing = getTemplatePricing(market);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/razorpay/status", { cache: "no-store" })
      .then((res) => res.json())
      .then((data: { templateCheckout?: boolean }) => {
        if (!cancelled) setRazorpayEnabled(Boolean(data.templateCheckout));
      })
      .catch(() => {
        if (!cancelled) setRazorpayEnabled(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const openUnlockDialog = useCallback((templateId: InvoiceTemplateId) => {
    setPendingTemplateId(templateId);
    setUnlockDialogOpen(true);
  }, []);

  const payWithRazorpay = useCallback(async () => {
    if (!razorpayEnabled) {
      toast.error("Payments unavailable", {
        description: "Premium templates are not available for purchase yet.",
      });
      return;
    }

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
        if (orderRes.status === 401) {
          throw new Error("Sign in to unlock premium templates.");
        }
        throw new Error(orderData.error ?? "Could not start checkout");
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
        description: "Payment verified.",
        action: {
          label: "Download receipt",
          onClick: () => {
            void downloadPaymentReceiptPdf(buildReceiptData(unlock, null));
          },
        },
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Checkout failed";
      if (message !== "Payment cancelled") {
        toast.error("Payment failed", { description: message });
      }
    } finally {
      setPayingRazorpay(false);
    }
  }, [pendingTemplateId, market, pricing, onUnlocked, razorpayEnabled]);

  const startCheckout = useCallback(
    async (templateId: InvoiceTemplateId) => {
      const template = getInvoiceTemplate(templateId);

      if (!template.isPremium) {
        return true;
      }

      if (!razorpayEnabled) {
        toast.message(`Premium templates coming soon`, {
          description: `The free Classic template is available now.`,
        });
        openUnlockDialog(templateId);
        return false;
      }

      openUnlockDialog(templateId);
      return false;
    },
    [openUnlockDialog, razorpayEnabled]
  );

  return {
    checkingOut: payingRazorpay,
    unlockDialogOpen,
    setUnlockDialogOpen,
    pendingTemplateId,
    payingRazorpay,
    razorpayEnabled,
    pricing,
    openUnlockDialog,
    payWithRazorpay,
    startCheckout,
  };
}
