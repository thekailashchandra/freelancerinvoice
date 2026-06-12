/** Flip to true after Razorpay verification, DB migrations, and test/live keys are ready. */
export function isRazorpayEnabled(): boolean {
  return process.env.NEXT_PUBLIC_RAZORPAY_ENABLED === "true";
}
