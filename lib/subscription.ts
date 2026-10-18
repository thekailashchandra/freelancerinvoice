import type { MarketRegion } from "@/lib/geo-market";

/** Cloud billing model: one hosted plan with monthly or yearly access. */

export type SubscriptionPlanId = "cloud_monthly" | "cloud_yearly";
export type SubscriptionBillingInterval = "monthly" | "yearly";
export type SubscriptionStatus = "none" | "active" | "past_due" | "canceled";

export const SUBSCRIPTION_PERIOD_DAYS: Record<
  SubscriptionBillingInterval,
  number
> = {
  monthly: 30,
  yearly: 365,
};

export type SubscriptionAccess = {
  /** True when the signed-in user can export, print, and use every template. */
  active: boolean;
  status: SubscriptionStatus;
  plan: SubscriptionPlanId | null;
  startedAt: string | null;
  expiresAt: string | null;
  /** False in self-hosted deployments. Everything is unlocked for free. */
  billingEnabled: boolean;
  /** True when Razorpay keys are ready. */
  checkoutAvailable: boolean;
  source: "cloud" | "self-hosted";
};

export const SELF_HOSTED_ACCESS: SubscriptionAccess = {
  active: true,
  status: "active",
  plan: "cloud_monthly",
  startedAt: null,
  expiresAt: null,
  billingEnabled: false,
  checkoutAvailable: false,
  source: "self-hosted",
};

/**
 * Self-hosted installs set NEXT_PUBLIC_SELF_HOSTED=true (or explicitly disable
 * cloud billing) and get every feature with no paywall.
 */
export function isSelfHostedMode(): boolean {
  return (
    process.env.NEXT_PUBLIC_SELF_HOSTED === "true" ||
    process.env.NEXT_PUBLIC_CLOUD_BILLING_ENABLED === "false"
  );
}

export function isCloudBillingEnabled(): boolean {
  return !isSelfHostedMode();
}

export type SubscriptionPricing = {
  market: MarketRegion;
  interval: SubscriptionBillingInterval;
  planId: SubscriptionPlanId;
  currency: "INR" | "USD";
  amountMinor: number;
  displayAmount: string;
  intervalLabel: string;
  marketNote: string;
  periodDays: number;
  /** Equivalent per-month cost for yearly plans, otherwise null. */
  monthlyEquivalent: string | null;
};

export function getSubscriptionPricing(
  market: MarketRegion,
  interval: SubscriptionBillingInterval = "monthly"
): SubscriptionPricing {
  const planId: SubscriptionPlanId =
    interval === "yearly" ? "cloud_yearly" : "cloud_monthly";

  if (market === "IN") {
    return interval === "yearly"
      ? {
          market,
          interval,
          planId,
          currency: "INR",
          amountMinor: 99900,
          displayAmount: "₹999",
          intervalLabel: "/year",
          marketNote: "Billed yearly for Indian clients",
          periodDays: SUBSCRIPTION_PERIOD_DAYS.yearly,
          monthlyEquivalent: "₹83/month",
        }
      : {
          market,
          interval,
          planId,
          currency: "INR",
          amountMinor: 29900,
          displayAmount: "₹299",
          intervalLabel: "/month",
          marketNote: "Billed monthly for Indian clients",
          periodDays: SUBSCRIPTION_PERIOD_DAYS.monthly,
          monthlyEquivalent: null,
        };
  }

  return interval === "yearly"
    ? {
        market,
        interval,
        planId,
        currency: "USD",
        amountMinor: 1900,
        displayAmount: "$19",
        intervalLabel: "/year",
        marketNote: "Billed yearly in USD",
        periodDays: SUBSCRIPTION_PERIOD_DAYS.yearly,
        monthlyEquivalent: "$1.58/month",
      }
    : {
        market,
        interval,
        planId,
        currency: "USD",
        amountMinor: 500,
        displayAmount: "$5",
        intervalLabel: "/month",
        marketNote: "Billed monthly in USD",
        periodDays: SUBSCRIPTION_PERIOD_DAYS.monthly,
        monthlyEquivalent: null,
      };
}

export function getSubscriptionPriceOptions(market: MarketRegion) {
  return {
    monthly: getSubscriptionPricing(market, "monthly"),
    yearly: getSubscriptionPricing(market, "yearly"),
  };
}

export const CLOUD_PLAN_FEATURES = [
  "Unlimited invoices and clients",
  "PDF download and print",
  "All eight invoice templates",
  "Brand color customization",
  "Cloud invoice history",
  "Payment status tracking",
  "GST, VAT, and multi-currency fields",
] as const;

export function subscriptionDaysRemaining(
  expiresAt: string | null | undefined
): number | null {
  if (!expiresAt) return null;
  const ms = new Date(expiresAt).getTime() - Date.now();
  if (!Number.isFinite(ms)) return null;
  return Math.max(0, Math.ceil(ms / 86_400_000));
}

export function formatSubscriptionExpiry(
  expiresAt: string | null | undefined
): string | null {
  if (!expiresAt) return null;
  const date = new Date(expiresAt);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Cloud users without an active plan can build invoices but not export them. */
export function canExportWithAccess(access: SubscriptionAccess): boolean {
  if (!access.billingEnabled) return true;
  return access.active;
}
