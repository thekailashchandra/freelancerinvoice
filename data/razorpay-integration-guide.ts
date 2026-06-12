/**
 * Live Razorpay integration reference for merchants and Razorpay review.
 * Keys are BYOK — each user adds Live Mode keys in Settings.
 */

export const razorpayIntegrationGuide = {
  title: "Razorpay live integration",
  description:
    "Invoice for Freelance uses Razorpay Live Mode. Each merchant connects their own API keys; payments settle to their Razorpay account.",
  merchantApp: {
    heading: "Merchant login (Invoice for Freelance)",
    email: "razorpay.demo.merchant@invoiceforfreelance.com",
    password: "RazorpayDemo2026!",
    note: "Use this account for Razorpay verification, or sign up with your own email and add Live keys in Settings.",
  },
  razorpayDashboard: {
    heading: "Live API keys (Settings → Razorpay payment gateway)",
    keyIdExample: "rzp_live_XXXXXXXXXXXXXXXX",
    keySecretNote:
      "Generate from Razorpay Dashboard → Settings → API Keys → Live Mode. The secret is stored server-side only.",
    webhookUrl: "/api/razorpay/webhook",
  },
  checkoutFlow: [
    "Sign in to Invoice for Freelance.",
    "Open Settings and paste your Razorpay Live Key ID and Key Secret.",
    "Create an invoice and save it, then open it from Invoice History.",
    "Click Copy Razorpay link and share it with your client.",
    "Client completes checkout with card, UPI, or netbanking.",
    "Invoice status updates to paid; order is stored for refunds and webhooks.",
  ],
  orderMapping: {
    receiptPrefix: "inv_",
    notesFields: ["invoice_id", "invoice_number", "user_id", "purpose"],
  },
  samplePayPath: "/pay/{invoiceId}",
} as const;
