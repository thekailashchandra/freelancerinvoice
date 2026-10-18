"use client";

import Link from "next/link";
import { ArrowRight, Check, Loader2, Server, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UpgradeDialog } from "@/components/upgrade-dialog";
import { useLocale } from "@/components/locale-provider";
import { useSubscription } from "@/hooks/use-subscription";
import { useSubscriptionCheckout } from "@/hooks/use-subscription-checkout";
import {
  formatSubscriptionExpiry,
  subscriptionDaysRemaining,
} from "@/lib/subscription";
import { cn } from "@/lib/utils";

type CloudPlanCardProps = {
  variant?: "banner" | "card";
  className?: string;
};

export function CloudPlanCard({
  variant = "banner",
  className,
}: CloudPlanCardProps) {
  const { countryCode } = useLocale();
  const market = countryCode === "IN" ? "IN" : "GLOBAL";
  const subscription = useSubscription();
  const {
    openUpgrade,
    pay,
    paying,
    dialogOpen,
    setDialogOpen,
    pricing,
    interval,
    setInterval,
    reason,
    checkoutAvailable,
  } = useSubscriptionCheckout({
    market,
    checkoutAvailable: subscription.checkoutAvailable,
    onSubscribed: () => {
      void subscription.refresh();
    },
  });

  if (subscription.loading) {
    return (
      <div
        className={cn(
          "flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-xs text-muted-foreground",
          className
        )}
      >
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        Checking your plan…
      </div>
    );
  }

  if (!subscription.billingEnabled) {
    return (
      <div
        className={cn(
          "flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-xs text-muted-foreground",
          className
        )}
      >
        <Server className="h-3.5 w-3.5" />
        Self-hosted edition · every feature unlocked
      </div>
    );
  }

  if (subscription.active) {
    const expiry = formatSubscriptionExpiry(subscription.expiresAt);
    const days = subscriptionDaysRemaining(subscription.expiresAt);

    return (
      <div
        className={cn(
          "flex flex-col gap-3 rounded-xl border border-border bg-card px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between",
          className
        )}
      >
        <div className="flex items-start gap-2.5">
          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
            <Check className="h-3.5 w-3.5" />
          </span>
          <div>
            <p className="text-sm font-medium">Cloud plan active</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {expiry
                ? `Access until ${expiry}${days !== null ? ` · ${days} days left` : ""}`
                : "PDF, print, and every template are unlocked."}
            </p>
          </div>
        </div>
        <Button asChild variant="outline" size="sm" className="shrink-0">
          <Link href="/subscribe">Manage plan</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div
        className={cn(
          variant === "card"
            ? "rounded-xl border border-border bg-card p-5"
            : "flex flex-col gap-3 rounded-xl border border-border bg-card px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between",
          className
        )}
      >
        {variant === "card" ? (
          <div className="flex items-start gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            <div>
              <p className="text-sm font-medium">Cloud plan</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                PDF download, printing, receipts, and every template for{" "}
                {pricing.displayAmount}
                {pricing.intervalLabel}. Build and preview free.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-2.5">
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            <div>
              <p className="text-sm font-medium">Preview mode</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Export and print are locked. Unlock Cloud for{" "}
                {pricing.displayAmount}
                {pricing.intervalLabel}.
              </p>
            </div>
          </div>
        )}
        <Button
          size="sm"
          className={cn("shrink-0 gap-1.5", variant === "card" && "mt-4 w-full")}
          onClick={() => openUpgrade("generic")}
        >
          Unlock Cloud
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </div>

      <UpgradeDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        pricing={pricing}
        reason={reason}
        interval={interval}
        onIntervalChange={setInterval}
        checkoutAvailable={checkoutAvailable}
        paying={paying}
        onSubscribe={pay}
      />
    </>
  );
}
