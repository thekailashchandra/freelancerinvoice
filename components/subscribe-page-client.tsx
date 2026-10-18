"use client";

import Link from "next/link";
import {
  ArrowRight,
  Check,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/page-transition";
import { UpgradeDialog } from "@/components/upgrade-dialog";
import { useSubscriptionCheckout } from "@/hooks/use-subscription-checkout";
import {
  CLOUD_PLAN_FEATURES,
  formatSubscriptionExpiry,
  getSubscriptionPriceOptions,
  subscriptionDaysRemaining,
  type SubscriptionAccess,
  type SubscriptionBillingInterval,
} from "@/lib/subscription";
import type { MarketRegion } from "@/lib/geo-market";

type SubscribePageClientProps = {
  access: SubscriptionAccess;
  market: MarketRegion;
  dodoStatus?: "success" | "cancelled" | null;
};

export function SubscribePageClient({
  access,
  market,
  dodoStatus = null,
}: SubscribePageClientProps) {
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
    checkoutAvailable: access.checkoutAvailable,
    dodoCheckoutAvailable: access.dodoCheckoutAvailable,
  });
  const options = getSubscriptionPriceOptions(market);
  const expiry = formatSubscriptionExpiry(access.expiresAt);
  const daysLeft = subscriptionDaysRemaining(access.expiresAt);

  return (
    <PageTransition className="mx-auto max-w-5xl px-6 py-14 lg:px-10 lg:py-20">
      {dodoStatus === "success" ? (
        <div className="mb-6 flex flex-col gap-2 rounded-xl border border-border bg-card px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium">Payment received</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Your Cloud plan is being activated. If it does not appear in a few
              seconds, refresh this page.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
          >
            Refresh plan
          </Button>
        </div>
      ) : null}
      {dodoStatus === "cancelled" ? (
        <div className="mb-6 rounded-xl border border-border bg-card px-4 py-3">
          <p className="text-sm font-medium">Checkout cancelled</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            No payment was taken. You can try again whenever you are ready.
          </p>
        </div>
      ) : null}

      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div>
          <p className="eyebrow text-muted-foreground">Cloud plan</p>
          <h1 className="display-serif mt-4 text-4xl leading-[1.02] sm:text-5xl">
            A finished invoice, every time.
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
            Build and preview for free. Cloud unlocks the last mile: polished PDF
            downloads, clean printing, payment receipts, brand colors, and every
            template.
          </p>

          <ul className="mt-8 grid gap-3 text-sm sm:grid-cols-2">
            {CLOUD_PLAN_FEATURES.map((feature) => (
              <li key={feature} className="flex items-start gap-2.5">
                <Check className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 rounded-xl border border-border bg-card p-4">
            <p className="text-sm font-medium">Yearly access saves more</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Monthly is {options.monthly.displayAmount}
              {options.monthly.intervalLabel}. Yearly is{" "}
              {options.yearly.displayAmount}
              {options.yearly.intervalLabel}, about{" "}
              {options.yearly.monthlyEquivalent}. Switch any time before
              checkout.
            </p>
          </div>
        </div>

        <aside className="rounded-2xl border border-foreground bg-foreground p-7 text-background sm:p-8">
          {access.active ? (
            <>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" aria-hidden />
                <p className="eyebrow text-[9px] text-background/60">
                  Plan active
                </p>
              </div>
              <h2 className="display-serif mt-4 text-3xl leading-tight">
                You are on Cloud.
              </h2>
              <p className="mt-2 text-sm text-background/65">
                {expiry
                  ? `Access runs until ${expiry}${
                      daysLeft !== null ? ` · ${daysLeft} days left` : ""
                    }.`
                  : "Every export and template is unlocked."}
              </p>
              <div className="mt-6 rounded-xl border border-background/15 bg-background/[0.04] p-4">
                <p className="text-xs text-background/55">
                  Adding another period extends from your current expiry, not from
                  today.
                </p>
                <p className="mt-2 text-sm font-medium">
                  {pricing.displayAmount}
                  <span className="font-normal text-background/55">
                    {" "}
                    {pricing.intervalLabel}
                  </span>
                </p>
              </div>
              <IntervalToggle
                interval={interval}
                onChange={setInterval}
                monthly={options.monthly.displayAmount}
                yearly={options.yearly.displayAmount}
              />
              <Button
                size="lg"
                className="mt-4 w-full gap-2 bg-background text-foreground hover:bg-background/90"
                onClick={() => void pay()}
                disabled={paying || !access.checkoutAvailable}
              >
                {paying ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )}
                Add {pricing.periodDays} days
              </Button>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between gap-3">
                <p className="eyebrow text-[9px] text-background/60">
                  Cloud access
                </p>
                <span className="rounded-full border border-background/20 px-2 py-0.5 text-[9px] uppercase tracking-[0.14em] text-background/60">
                  {interval === "yearly" ? "365 days" : "30 days"}
                </span>
              </div>
              <div className="mt-5 flex items-baseline gap-1.5">
                <span className="display-serif text-5xl leading-none">
                  {pricing.displayAmount}
                </span>
                <span className="text-sm text-background/55">
                  {pricing.intervalLabel}
                </span>
              </div>
              <p className="mt-2 text-xs text-background/50">
                {pricing.marketNote}
                {pricing.monthlyEquivalent
                  ? ` · ${pricing.monthlyEquivalent}`
                  : ""}
              </p>

              <IntervalToggle
                interval={interval}
                onChange={setInterval}
                monthly={options.monthly.displayAmount}
                yearly={options.yearly.displayAmount}
              />

              <ul className="mt-6 space-y-3 text-sm">
                {[
                  "PDF download and print",
                  "Every invoice template",
                  "Brand color customization",
                  "Cloud history and clients",
                  "Payment receipts",
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <Check className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                size="lg"
                className="mt-7 w-full gap-2 bg-background text-foreground hover:bg-background/90"
                onClick={() =>
                  checkoutAvailable ? void pay() : openUpgrade("generic")
                }
                disabled={paying}
              >
                {paying ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )}
                {checkoutAvailable
                  ? `Subscribe for ${pricing.displayAmount}`
                  : "Check availability"}
              </Button>

              <p className="mt-3 text-center text-[10px] leading-relaxed text-background/45">
                Paid securely via{" "}
          {market === "GLOBAL" && access.dodoCheckoutAvailable
            ? "Dodo Payments"
            : "Razorpay"}
          . No automatic renewal.
              </p>
            </>
          )}

          <p className="mt-5 border-t border-background/15 pt-4 text-center text-[10px] text-background/45">
            <Link href="/refund-policy" className="underline underline-offset-4">
              Refund policy
            </Link>{" "}
            ·{" "}
            <Link href="/pricing" className="underline underline-offset-4">
              Compare plans
            </Link>
          </p>
        </aside>
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
    </PageTransition>
  );
}

function IntervalToggle({
  interval,
  onChange,
  monthly,
  yearly,
}: {
  interval: SubscriptionBillingInterval;
  onChange: (value: SubscriptionBillingInterval) => void;
  monthly: string;
  yearly: string;
}) {
  return (
    <div className="mt-5 grid grid-cols-2 gap-1 rounded-lg border border-background/20 p-1">
      {(["monthly", "yearly"] as const).map((option) => {
        const selected = interval === option;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
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
              {option === "monthly" ? monthly : yearly}
            </span>
          </button>
        );
      })}
    </div>
  );
}
