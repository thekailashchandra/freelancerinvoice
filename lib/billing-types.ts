import type { SubscriptionBillingInterval, SubscriptionPlanId } from "@/lib/subscription";

export type BillingPaymentStatus = "paid" | "pending" | "failed" | "refunded";

export type BillingHistoryItem = {
  id: string;
  provider: "dodo" | "razorpay";
  providerLabel: string;
  paymentId: string;
  description: string;
  amount: number;
  currencyCode: string;
  amountDisplay: string;
  status: BillingPaymentStatus;
  statusLabel: string;
  paidAt: string;
  customerEmail: string | null;
  paymentMethod: string | null;
  plan: SubscriptionPlanId | null;
  interval: SubscriptionBillingInterval | null;
  /** Dodo's official invoice PDF, when available. */
  receiptUrl: string | null;
};
