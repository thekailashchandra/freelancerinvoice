/** Set NEXT_PUBLIC_RAZORPAY_ENABLED=true after verification, migrations, and live keys. */
export function isRazorpayEnabled(): boolean {
  return process.env.NEXT_PUBLIC_RAZORPAY_ENABLED === "true";
}
