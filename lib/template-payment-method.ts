import type { MarketRegion } from "@/lib/geo-market";

/** Premium templates unlock only via verified Razorpay payment. */
export function getPreferredTemplatePaymentMethod(
  _market: MarketRegion,
  razorpayConfigured?: boolean
): "razorpay" | null {
  return razorpayConfigured ? "razorpay" : null;
}

export function templatePaymentMethodLabel(
  _market: MarketRegion,
  razorpayConfigured?: boolean
): string {
  return razorpayConfigured ? "Razorpay" : "Unavailable";
}
