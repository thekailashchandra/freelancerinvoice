import type { MarketRegion } from "@/lib/geo-market";

export type MarketLandingPath = {
  href: string;
  label: string;
  description: string;
};

export const indiaMarketLandingPaths: MarketLandingPath[] = [
  {
    href: "/gst-compliant-invoice-template-independent-contractors-india",
    label: "GST invoice for independent contractors",
    description:
      "GST-compliant template with SAC codes, CGST/SGST/IGST, and UPI fields.",
  },
  {
    href: "/gst-invoice-generator-india",
    label: "GST invoice generator India",
    description: "Free GST-ready invoice builder with PDF export.",
  },
  {
    href: "/gst-invoice-template",
    label: "GST invoice template",
    description: "Printable GST tax invoice layout for freelancers.",
  },
  {
    href: "/freelance-contractor-invoice-format-inr-us-clients",
    label: "INR invoice format for US clients",
    description: "Cross-border contractor billing from India to the US.",
  },
  {
    href: "/how-to-create-freelance-invoice-in-india",
    label: "How to invoice in India",
    description: "GST, UPI, TDS, LUT, and export service guide.",
  },
];

export const globalMarketLandingPaths: MarketLandingPath[] = [
  {
    href: "/global-freelance-invoicing-compliance",
    label: "Global invoicing compliance",
    description:
      "Cross-border banking layouts, wire formats, and international tax declarations.",
  },
  {
    href: "/usd-invoice-template",
    label: "USD invoice template",
    description: "US-style invoice with routing number and sales tax fields.",
  },
  {
    href: "/invoice-generator-for-freelancers",
    label: "Freelancer invoice generator",
    description: "Multi-currency billing for international clients.",
  },
  {
    href: "/blog/cross-border-wire-fees-freelancers",
    label: "Cross-border wire fees guide",
    description: "Compare Wise, PayPal, and SWIFT costs.",
  },
  {
    href: "/blog/how-to-bill-international-clients",
    label: "Bill international clients",
    description: "Currency, payment method, and fee allocation.",
  },
];

export function getMarketLandingPaths(market: MarketRegion): MarketLandingPath[] {
  return market === "IN" ? indiaMarketLandingPaths : globalMarketLandingPaths;
}

export const indiaMarketHero = {
  badge: "GST-compliant · No signup required for PDF export",
  title: "Free GST Invoice Generator for Indian Freelancers",
  summary:
    "Build GST-ready invoices with SAC codes, CGST/SGST/IGST breakdowns, UPI and bank details, and instant PDF download. Designed for independent contractors billing Indian and US clients.",
};

export const globalMarketHero = {
  badge: "No signup required to build & download PDFs",
  title: "Free Invoice for Freelancers — Start Invoicing Now",
  summary:
    "Create professional invoices with live preview and one-click PDF export. Currency defaults to your region — USD, EUR, GBP, or AUD — with cross-border banking fields built in.",
};
