/**
 * Test credentials and checkout steps for Razorpay integration review.
 * Use Razorpay Test Mode keys only — never commit live secrets.
 */

export const razorpayIntegrationDemo = {
  title: "Razorpay integration test guide",
  description:
    "Use these credentials to walk through invoice payment checkout on Invoice for Freelance. All flows use Razorpay Test Mode. Money is collected in the merchant's own Razorpay account (BYOK).",
  merchantApp: {
    heading: "Demo merchant (Invoice for Freelance app)",
    email: "razorpay.demo.merchant@invoiceforfreelance.com",
    password: "RazorpayDemo2026!",
    note: "Create this user in Supabase Auth if it does not exist, or sign up with your own email and add Test Mode keys in Settings → Razorpay payment gateway.",
  },
  razorpayDashboard: {
    heading: "Razorpay Test Mode keys (Settings → Razorpay payment gateway)",
    keyIdExample: "rzp_test_XXXXXXXXXXXXXXXX",
    keySecretNote:
      "Generate from Razorpay Dashboard → Settings → API Keys → Test Mode. The secret is stored server-side only and never returned to the browser.",
    webhookUrl: "/api/razorpay/webhook",
  },
  testPayer: {
    heading: "Test payer at checkout",
    card: "4111 1111 1111 1111",
    cvv: "Any 3 digits",
    expiry: "Any future date",
    upi: "success@razorpay",
    netbanking: "Select any test bank and approve",
  },
  checkoutFlow: [
    "Sign in with the demo merchant account (or your own account).",
    "Open Settings and paste your Razorpay Test Key ID and Key Secret.",
    "Create an invoice and save it, then open it from Invoice History.",
    "Click Copy Razorpay link and open the link in an incognito window (simulates your client).",
    "Enter payer name and click Pay with Razorpay.",
    "Complete checkout with the test card or UPI above.",
    "Invoice status updates to paid; order is stored in razorpay_payments for refunds and webhooks.",
  ],
  orderMapping: {
    receiptPrefix: "inv_",
    notesFields: ["invoice_id", "invoice_number", "user_id", "purpose"],
  },
  samplePayPath: "/pay/{invoiceId}",
  integrationPagePath: "/razorpay-integration",
} as const;
