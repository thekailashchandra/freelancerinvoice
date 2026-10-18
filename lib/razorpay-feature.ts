/** Platform Razorpay keys + webhooks. User-facing UI is gated by RAZORPAY_OWNER_EMAIL. */
export function isRazorpayEnabled(): boolean {
  return process.env.NEXT_PUBLIC_RAZORPAY_ENABLED === "true";
}

/**
 * Public freelancer invoice payments (/pay, invoice-order).
 * Off by default - invoice creation only until explicitly enabled.
 */
export function isFreelancerInvoicePaymentEnabled(): boolean {
  return process.env.NEXT_PUBLIC_INVOICE_PAYMENTS_ENABLED === "true";
}
