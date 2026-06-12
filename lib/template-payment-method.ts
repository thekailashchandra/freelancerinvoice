import type { MarketRegion } from "@/lib/geo-market";

/** Premium templates unlock via Ko-fi (global) or Razorpay when IN + keys configured. */
export function getPreferredTemplatePaymentMethod(
  market: MarketRegion,
  razorpayConfigured?: boolean
): "kofi" | "razorpay" {
  if (market === "IN" && razorpayConfigured) return "razorpay";
  return "kofi";
}

export function templatePaymentMethodLabel(
  market: MarketRegion,
  razorpayConfigured?: boolean
): string {
  return getPreferredTemplatePaymentMethod(market, razorpayConfigured) ===
    "razorpay"
    ? "Razorpay"
    : "Ko-fi";
}
