"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { openRazorpayCheckout } from "@/lib/razorpay-checkout";
import {
  getSubscriptionPricing,
  type SubscriptionBillingInterval,
  type SubscriptionPricing,
} from "@/lib/subscription";
import type { MarketRegion } from "@/lib/geo-market";

type UseSubscriptionCheckoutOptions = {
  market: MarketRegion;
  checkoutAvailable: boolean;
  onSubscribed?: () => void;
};

export function useSubscriptionCheckout({
  market,
  checkoutAvailable,
  onSubscribed,
}: UseSubscriptionCheckoutOptions) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [paying, setPaying] = useState(false);
  const [interval, setInterval] =
    useState<SubscriptionBillingInterval>("monthly");
  const [reason, setReason] = useState<
    "generic" | "download" | "print" | "receipt"
  >("generic");

  const pricing: SubscriptionPricing = getSubscriptionPricing(market, interval);

  const openUpgrade = useCallback(
    (nextReason: typeof reason = "generic") => {
      setReason(nextReason);
      setDialogOpen(true);
    },
    []
  );

  const pay = useCallback(async () => {
    if (!checkoutAvailable) {
      toast.error("Cloud billing is not available yet", {
        description:
          "This deployment has not finished setting up payments. Try again later.",
      });
      return;
    }

    setPaying(true);
    try {
      const orderRes = await fetch("/api/razorpay/subscription-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ market, interval }),
      });
      const orderData = await orderRes.json().catch(() => ({}));
      if (!orderRes.ok) {
        if (orderRes.status === 401) {
          throw new Error("Sign in to subscribe.");
        }
        throw new Error(
          orderData.error ??
            `Could not start checkout (HTTP ${orderRes.status}).`
        );
      }

      const payment = await openRazorpayCheckout({
        keyId: orderData.keyId,
        orderId: orderData.orderId,
        amountPaise: orderData.amountPaise,
        currency: orderData.currency,
        name: orderData.merchantName,
        description: orderData.description,
        notes: {
          purpose: "subscription",
          plan: orderData.planId,
          interval,
          market,
        },
      });

      const verifyRes = await fetch("/api/razorpay/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payment),
      });
      const verifyData = await verifyRes.json().catch(() => ({}));
      if (!verifyRes.ok) {
        throw new Error(
          verifyData.error ?? `Payment verification failed (HTTP ${verifyRes.status}).`
        );
      }

      setDialogOpen(false);
      onSubscribed?.();
      router.refresh();
      toast.success("Cloud plan activated", {
        description: "PDF download, print, and every template are now unlocked.",
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Checkout failed";
      if (message !== "Payment cancelled") {
        toast.error("Payment failed", { description: message });
      }
    } finally {
      setPaying(false);
    }
  }, [checkoutAvailable, interval, market, onSubscribed, router]);

  return {
    dialogOpen,
    setDialogOpen,
    openUpgrade,
    pay,
    paying,
    pricing,
    interval,
    setInterval,
    reason,
    checkoutAvailable,
  };
}
