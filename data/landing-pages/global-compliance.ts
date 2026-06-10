import type { SeoLandingPage } from "./types";

export const globalFreelanceInvoicingCompliance: SeoLandingPage = {
  slug: "global-freelance-invoicing-compliance",
  title:
    "Global Freelance Invoicing Compliance — Cross-Border Banking & Wire Formats",
  metaDescription:
    "International freelance invoicing compliance guide — USD, EUR, and GBP wire formats, SWIFT/IBAN layouts, tax withholding declarations, and multi-currency PDF invoices.",
  h1: "Global freelance invoicing compliance",
  heroSummary:
    "Bill clients worldwide with the correct banking layout for each corridor — US ACH routing, UK sort codes, EU IBAN, and international SWIFT wires. Currency defaults to your region automatically; compliance fields are built into every invoice.",
  keywords: [
    "global freelance invoicing compliance",
    "international invoice wire format",
    "cross border freelancer invoice",
    "IBAN SWIFT invoice template",
    "freelancer tax withholding invoice",
  ],
  category: "Global",
  market: "GLOBAL",
  publishedAt: "2026-06-12",
  benefits: [
    "Region-aware currency defaults (USD, EUR, GBP, AUD)",
    "Country-specific payment fields on every PDF",
    "Wire format guidance for US, UK, EU, and AU clients",
    "Tax withholding documentation references",
    "Free PDF export without signup",
  ],
  features: [
    {
      title: "International banking layouts",
      description:
        "Routing numbers for US clients, IBAN for EU, sort code for UK — shown on the invoice PDF.",
    },
    {
      title: "Multi-currency billing",
      description:
        "Invoice in USD, EUR, GBP, or AUD with live preview and correct symbol formatting.",
    },
    {
      title: "Withholding & compliance notes",
      description:
        "Reference W-9/1099 (US), VAT reverse charge (EU), and export declarations (India).",
    },
  ],
  useCases: [
    "US freelancers billing domestic LLC clients",
    "EU consultants invoicing cross-border B2B services",
    "UK contractors with VAT-registered clients",
    "Australian freelancers exporting services abroad",
  ],
  faqItems: [
    {
      question: "What currency should I invoice international clients in?",
      answer:
        "Invoice in the client's preferred settlement currency — usually USD for US companies and EUR for EU businesses. State the currency explicitly on every line item and total.",
    },
    {
      question: "What banking details belong on an international invoice?",
      answer:
        "US: routing + account. UK: sort code + account or IBAN. EU: IBAN + BIC/SWIFT. Always include the beneficiary name exactly as registered at the bank.",
    },
    {
      question: "How do tax withholding rules affect freelancer invoices?",
      answer:
        "US clients may require W-9 and issue 1099-NEC at year-end. EU B2B services often use reverse-charge VAT. Indian export invoices may reference LUT. Keep invoices aligned with each jurisdiction.",
    },
    {
      question: "Does the tool set currency based on my location?",
      answer:
        "Yes. Default currency and payment fields are set from your geographic region — USD for North America, EUR for Western Europe, INR for India, and so on. You can override any field manually.",
    },
  ],
  relatedSlugs: [
    "invoice-generator-for-freelancers",
    "usd-invoice-template",
  ],
  relatedLinks: [
    { href: "/usd-invoice-template", label: "USD invoice template" },
    { href: "/blog/how-to-bill-international-clients", label: "International billing guide" },
    { href: "/blog/cross-border-wire-fees-freelancers", label: "Wire fee comparison" },
  ],
};
