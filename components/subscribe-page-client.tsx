"use client";

import Link from "next/link";
import {
  ArrowRight,
  Check,
  CreditCard,
  ExternalLink,
  Loader2,
  ReceiptText,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/page-transition";
import { UpgradeDialog } from "@/components/upgrade-dialog";
import { BillingReceiptButton } from "@/components/billing-receipt-button";
import { useSubscriptionCheckout } from "@/hooks/use-subscription-checkout";
import type { BillingHistoryItem } from "@/lib/billing-types";
import {
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
  history: BillingHistoryItem[];
  dodoStatus?: "success" | "cancelled" | null;
};

function formatHistoryDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function SubscribePageClient({
  access,
  market,
  history,
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
    provider: checkoutProvider,
  } = useSubscriptionCheckout({
    market,
    checkoutAvailable: access.checkoutAvailable,
    dodoCheckoutAvailable: access.dodoCheckoutAvailable,
  });
  const options = getSubscriptionPriceOptions(market);
  const expiry = formatSubscriptionExpiry(access.expiresAt);
  const daysLeft = subscriptionDaysRemaining(access.expiresAt);
  const planName =
    access.plan === "cloud_yearly"
      ? "Cloud yearly"
      : access.plan === "cloud_monthly"
        ? "Cloud monthly"
        : "Cloud plan";
  const latestPayment =
    history.find((payment) => payment.status === "paid") ?? history[0] ?? null;

  return (
    <PageTransition className="mx-auto max-w-4xl px-6 py-12 lg:px-10 lg:py-16">
      {dodoStatus === "success" ? (
        <div className="mb-6 flex flex-col gap-2 rounded-xl border border-border bg-card px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium">Payment received</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {access.active
                ? "Your Cloud plan is active and the payment is in your history."
                : "Your Cloud plan is being activated. If it does not appear in a few seconds, refresh this page."}
            </p>
          </div>
          {!access.active ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
            >
              Refresh plan
            </Button>
          ) : null}
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

      <header>
        <p className="eyebrow text-muted-foreground">Billing</p>
        <h1 className="display-serif mt-3 text-4xl leading-[1.02] sm:text-5xl">
          Your Cloud plan.
        </h1>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
          Review your access, payment history, and receipts in one place.
        </p>
      </header>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
        <section className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow text-muted-foreground">Current plan</p>
              <h2 className="display-serif mt-3 text-2xl">
                {access.active ? planName : "No active plan"}
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {access.active
                  ? expiry
                    ? `Access runs until ${expiry}.`
                    : "Every export and template is unlocked."
                  : "Choose a 30-day or 365-day pass to unlock PDFs, printing, and every template."}
              </p>
            </div>
            <span className="shrink-0 rounded-full border border-border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {access.active ? "Active" : "Inactive"}
            </span>
          </div>

          {access.active ? (
            <div className="mt-5 grid grid-cols-2 gap-4 border-t border-border pt-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  Days left
                </p>
                <p className="mt-1 text-sm font-semibold">
                  {daysLeft === null ? "Unlimited" : daysLeft}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  Last payment
                </p>
                <p className="mt-1 text-sm font-semibold">
                  {latestPayment
                    ? `${latestPayment.amountDisplay} · ${formatHistoryDate(latestPayment.paidAt)}`
                    : "No payment recorded"}
                </p>
              </div>
            </div>
          ) : (
            <ul className="mt-5 grid gap-2 border-t border-border pt-4 text-xs text-muted-foreground sm:grid-cols-2">
              {[
                "PDF download and print",
                "Every invoice template",
                "Payment receipts",
                "Cloud history and clients",
              ].map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-foreground bg-foreground p-6 text-background">
          <div className="flex items-center gap-2">
            {access.active ? (
              <ShieldCheck className="h-4 w-4" aria-hidden />
            ) : (
              <CreditCard className="h-4 w-4" aria-hidden />
            )}
            <p className="eyebrow text-[9px] text-background/60">
              {access.active ? "Add more access" : "Start Cloud"}
            </p>
          </div>
          <div className="mt-4 flex items-baseline gap-1.5">
            <span className="display-serif text-4xl leading-none">
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

          <Button
            size="lg"
            className="mt-4 w-full gap-2 bg-background text-foreground hover:bg-background/90"
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
            {access.active
              ? `Add ${pricing.periodDays} days for ${pricing.displayAmount}`
              : checkoutAvailable
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
        </section>
      </div>

      <section className="mt-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow text-muted-foreground">Payments</p>
            <h2 className="display-serif mt-2 text-2xl">Payment history</h2>
          </div>
          <p className="hidden text-xs text-muted-foreground sm:block">
            Receipts are available for completed payments.
          </p>
        </div>

        {history.length === 0 ? (
          <div className="mt-4 flex flex-col items-center rounded-2xl border border-border bg-card px-6 py-10 text-center">
            <ReceiptText className="h-6 w-6 text-muted-foreground" aria-hidden />
            <p className="mt-3 text-sm font-medium">No payments yet</p>
            <p className="mt-1 max-w-xs text-xs leading-relaxed text-muted-foreground">
              Your Cloud payments and downloadable receipts will appear here
              after your first purchase.
            </p>
          </div>
        ) : (
          <div className="mt-4 divide-y divide-border rounded-2xl border border-border bg-card">
            {history.map((payment) => (
              <div
                key={payment.id}
                className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium">{payment.description}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {formatHistoryDate(payment.paidAt)} · {payment.providerLabel}
                    {payment.paymentMethod
                      ? ` · ${payment.paymentMethod}`
                      : ""}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5 sm:justify-end">
                  <span className="text-sm font-semibold tabular-nums">
                    {payment.amountDisplay}
                  </span>
                  <span className="rounded-full border border-border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    {payment.statusLabel}
                  </span>
                  {payment.receiptUrl ? (
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="gap-1.5"
                    >
                      <a
                        href={payment.receiptUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Receipt
                        <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                      </a>
                    </Button>
                  ) : payment.status === "paid" ? (
                    <BillingReceiptButton payment={payment} />
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        <Link href="/refund-policy" className="underline underline-offset-4">
          Refund policy
        </Link>{" "}
        ·{" "}
        <Link href="/pricing" className="underline underline-offset-4">
          Compare plans
        </Link>{" "}
        ·{" "}
        <Link href="/support" className="underline underline-offset-4">
          Support
        </Link>
      </p>

      <UpgradeDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        pricing={pricing}
        reason={reason}
        interval={interval}
        onIntervalChange={setInterval}
        checkoutAvailable={checkoutAvailable}
        provider={checkoutProvider}
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
