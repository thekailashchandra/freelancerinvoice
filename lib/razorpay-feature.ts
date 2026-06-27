/** Platform Razorpay keys + webhooks. User-facing UI is gated by RAZORPAY_OWNER_EMAIL. */
export function isRazorpayEnabled(): boolean {
  return process.env.NEXT_PUBLIC_RAZORPAY_ENABLED === "true";
}
