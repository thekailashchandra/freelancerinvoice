import type { ComparisonPage } from "./types";

export const vsWave: ComparisonPage = {
  slug: "wave",
  competitorName: "Wave",
  title: "Invoice for Freelance vs Wave - Freelancer Invoice Comparison",
  metaDescription:
    "Invoice for Freelance vs Wave for freelancers. Compare invoicing, PDF export, cloud history, and freelancer-focused workflows side by side.",
  h1: "Invoice for Freelance vs Wave",
  summary:
    "Wave offers free accounting and invoicing with payment processing fees. Invoice for Freelance is a dedicated freelancer invoice generator - PDF export on the Cloud plan, cloud history, and no payment-processor lock-in required.",
  keywords: [
    "Wave alternative freelancer",
    "Invoice for Freelance vs Wave",
    "free invoice software comparison",
    "Wave invoicing alternative",
  ],
  publishedAt: "2026-06-10",
  rows: [
    { feature: "Focus", us: "Freelancer invoicing only", them: "Accounting + invoicing platform" },
    { feature: "Price", us: "Self-host free; Cloud ₹299/month or ₹999/year India / $5/month or $19/year elsewhere", them: "Free software; fees on payments" },
    { feature: "PDF invoices", us: "One-click branded PDF", them: "Yes" },
    { feature: "India / GST", us: "GST, UPI, SAC fields", them: "Primarily North America focused" },
    { feature: "Account required", us: "Free signup", them: "Free signup" },
    { feature: "Payment processing", us: "Bring your own UPI/bank/wire", them: "Integrated card payments" },
  ],
  whyChooseUs: [
    "You bill international and Indian clients with UPI or wire",
    "You want invoicing without accounting module overhead",
    "You need GST-ready fields for Indian freelance work",
  ],
  faqItems: [
    {
      question: "How does Invoice for Freelance compare to Wave?",
      answer:
        "Both have free ways to start. Invoice for Freelance is narrower and optimized for freelancers globally, with strong India/GST and UPI support, and it can be self-hosted.",
    },
    {
      question: "Is Wave or Invoice for Freelance better for Indian freelancers?",
      answer:
        "Invoice for Freelance includes GST-related fields, UPI, and India-focused templates. Wave is less tailored to Indian compliance workflows.",
    },
  ],
  relatedComparisons: ["freshbooks", "zoho-invoice"],
};
