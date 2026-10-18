import type { GuideArticle } from "./types";

export const crossBorderWireFeesFreelancers: GuideArticle = {
  slug: "cross-border-wire-fees-freelancers",
  title: "Cross-Border Wire Fees for Freelancers: SWIFT, Wise, and PayPal Compared",
  description:
    "How cross-border payment fees affect freelancer net income - SWIFT wire costs, Wise vs PayPal pricing, and how to invoice international clients to protect your margins.",
  keywords: [
    "cross border wire fees freelancer",
    "SWIFT fee freelancer",
    "Wise vs PayPal freelancer",
    "international payment fees freelancer",
    "freelance wire transfer cost",
  ],
  category: "Tax & Compliance",
  pillar: "tax-compliance-currency",
  publishedAt: "2026-06-10",
  readingTimeMinutes: 9,
  sections: [
    {
      id: "why-fees-matter",
      heading: "Why wire fees matter to your freelance rate",
      paragraphs: [
        "A $5,000 invoice can become $4,920 after SWIFT intermediary fees - or less if your bank charges receiving fees. Over a year, payment friction can cost thousands.",
        "Pricing international work without accounting for transfer costs is one of the most common freelancer financial mistakes.",
      ],
    },
    {
      id: "swift",
      heading: "SWIFT wire transfers",
      paragraphs: [
        "SWIFT is the traditional bank-to-bank network. Clients send from their bank; you receive in yours. Fees are opaque and often split between sender and receiver.",
      ],
      list: [
        "Sender fees: typically $15–$50 per wire (varies by bank and country)",
        "Intermediary fees: $10–$30 deducted in transit for some corridors",
        "Receiving fees: $0–$25 depending on your bank",
        "Exchange rate markup: banks often add 2–4% above mid-market rate",
        "Best for: large payments ($10k+) where client insists on bank transfer",
      ],
    },
    {
      id: "wise",
      heading: "Wise (formerly TransferWise)",
      list: [
        "Transparent fee shown upfront (often 0.4–1.5% of transfer amount)",
        "Mid-market exchange rate with no hidden markup",
        "Multi-currency account - hold USD, EUR, GBP, INR separately",
        "Popular with freelancers billing US and EU clients",
        "Indian freelancers: can receive foreign currency and convert to INR",
      ],
      paragraphs: [
        "Wise is often the lowest-cost option for freelancers who can convince clients to pay via Wise instead of SWIFT.",
      ],
    },
    {
      id: "paypal",
      heading: "PayPal and similar platforms",
      list: [
        "Convenient for small clients and marketplace-style payments",
        "Fees: typically 2.9% + fixed fee for goods and services",
        "Currency conversion adds 3–4% above mid-market",
        "Withdrawal to bank may incur additional fees",
        "Best for: smaller invoices under $2,000 or clients who refuse bank transfer",
      ],
    },
    {
      id: "pricing",
      heading: "How to price for cross-border fees",
      list: [
        "Build a 3–5% buffer into international rates",
        "Specify in your contract: client pays all transfer fees (OUR, not SHA)",
        "Offer Wise payment details to reduce client and your costs",
        "Invoice in the client's preferred currency to avoid double conversion",
        "For Indian freelancers: keep FIRC from your bank as proof of inward remittance",
      ],
    },
    {
      id: "invoice",
      heading: "What to put on international invoices",
      list: [
        "Currency code and symbol on every line item and total",
        "Bank SWIFT/BIC, IBAN or account number, and beneficiary name",
        "Wise payment link or email if applicable",
        "Note: \"Client responsible for transfer fees unless otherwise agreed\"",
        "Payment reference: invoice number for easy reconciliation",
      ],
    },
  ],
};
