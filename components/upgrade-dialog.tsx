"use client";

import Link from "next/link";
import { ArrowRight, Check, Loader2, Lock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CLOUD_PLAN_FEATURES,
  getSubscriptionPriceOptions,
  type SubscriptionBillingInterval,
  type SubscriptionPricing,
} from "@/lib/subscription";

type UpgradeReason = "generic" | "download" | "print" | "receipt";

const REASON_COPY: Record<UpgradeReason, { title: string; description: string }> = {
  generic: {
    title: "Unlock the finished invoice",
    description:
      "Your workspace is ready. Add the Cloud plan to export, print, and share finished documents.",
  },
  download: {
    title: "PDF downloads are a Cloud feature",
    description:
      "Keep building and previewing for free. Upgrade when you are ready to send a client-ready PDF.",
  },
  print: {
    title: "Printing is a Cloud feature",
    description:
      "Preview every layout for free. The Cloud plan unlocks clean, isolated printing.",
  },
  receipt: {
    title: "Receipt exports are a Cloud feature",
    description:
      "The Cloud plan unlocks payment receipts alongside invoice PDFs and printing.",
  },
};

type UpgradeDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pricing: SubscriptionPricing;
  interval: SubscriptionBillingInterval;
  onIntervalChange: (interval: SubscriptionBillingInterval) => void;
  reason?: UpgradeReason;
  checkoutAvailable: boolean;
  provider?: "dodo" | "razorpay";
  paying: boolean;
  onSubscribe: () => void | Promise<void>;
};

export function UpgradeDialog({
  open,
  onOpenChange,
  pricing,
  interval,
  onIntervalChange,
  reason = "generic",
  checkoutAvailable,
  provider = "razorpay",
  paying,
  onSubscribe,
}: UpgradeDialogProps) {
  const copy = REASON_COPY[reason];
  const options = getSubscriptionPriceOptions(pricing.market);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent hideClose className="max-w-md gap-0 overflow-hidden p-0">
        <div className="border-b border-border bg-foreground px-6 py-6 text-background">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-background/25">
                <Lock className="h-3.5 w-3.5" aria-hidden />
              </span>
              <span className="eyebrow text-[9px] text-background/60">
                Cloud plan
              </span>
            </div>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-md p-1 text-background/60 transition-colors hover:bg-background/10 hover:text-background"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <DialogHeader className="mt-5 space-y-2 text-left">
            <DialogTitle className="display-serif text-2xl leading-tight text-background">
              {copy.title}
            </DialogTitle>
            <DialogDescription className="text-sm leading-relaxed text-background/65">
              {copy.description}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-5 flex items-baseline gap-1.5">
            <span className="display-serif text-4xl leading-none">
              {pricing.displayAmount}
            </span>
            <span className="text-sm text-background/60">
              {pricing.intervalLabel}
            </span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-1 rounded-lg border border-background/20 p-1">
            {(["monthly", "yearly"] as const).map((option) => {
              const selected = interval === option;
              const price = options[option];
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => onIntervalChange(option)}
                  className={
                    selected
                      ? "rounded-md bg-background px-3 py-2 text-left text-foreground"
                      : "rounded-md px-3 py-2 text-left text-background/65 hover:bg-background/10"
                  }
                >
                  <span className="block text-[10px] uppercase tracking-[0.14em]">
                    {option}
                  </span>
                  <span className="mt-0.5 block text-sm font-semibold">
                    {price.displayAmount}
                    {price.intervalLabel}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="mt-1.5 text-[11px] text-background/50">
            {pricing.marketNote}
            {pricing.monthlyEquivalent
              ? ` · ${pricing.monthlyEquivalent}`
              : ""}{" "}
            · Access runs for {pricing.periodDays} days
          </p>
        </div>

        <div className="px-6 py-5">
          <ul className="grid gap-2.5 text-sm">
            {CLOUD_PLAN_FEATURES.map((feature) => (
              <li key={feature} className="flex items-start gap-2.5">
                <Check className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <Button
            size="lg"
            className="mt-6 w-full gap-2"
            onClick={() => void onSubscribe()}
            disabled={paying || !checkoutAvailable}
          >
            {paying ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowRight className="h-4 w-4" />
            )}
            {paying
              ? "Opening checkout…"
              : checkoutAvailable
                ? `Continue with ${pricing.displayAmount}`
                : "Payments unavailable"}
          </Button>

          {!checkoutAvailable ? (
            <p className="mt-2.5 text-center text-[11px] text-muted-foreground">
              This deployment has not finished setting up cloud payments.
            </p>
          ) : null}

          <p className="mt-3 text-center text-[10px] leading-relaxed text-muted-foreground">
            <Link href="/refund-policy" className="underline underline-offset-4">
              Refund policy
            </Link>{" "}
            · Payments are processed by{" "}
            {provider === "dodo" ? "Dodo Payments" : "Razorpay"}.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
