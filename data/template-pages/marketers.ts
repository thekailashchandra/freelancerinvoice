import type { TemplatePage } from "./types";

export const invoiceTemplateForMarketers: TemplatePage = {
  slug: "invoice-template-for-marketers",
  title: "Invoice Template for Marketers - Freelance & Agency Billing",
  description:
    "Professional invoice template for freelance marketers, content strategists, and SEO consultants. Bill retainers, campaigns, and performance projects with clear line items.",
  keywords: [
    "invoice template for marketers",
    "marketing consultant invoice",
    "freelance marketer invoice template",
    "SEO invoice template",
    "content marketing invoice",
  ],
  category: "By profession",
  publishedAt: "2026-06-10",
  readingTimeMinutes: 7,
  relatedSlugs: [
    "invoice-template-for-designers",
    "invoice-template-for-developers",
    "invoice-template-for-video-editors",
    "usd-invoice-template",
  ],
  sections: [
    {
      id: "marketing-invoice-overview",
      heading: "Invoicing as a freelance marketer",
      paragraphs: [
        "Marketing freelancers bill retainers, campaign projects, audits, and channel-specific work (SEO, paid ads, email, content). Clients expect invoices that map to channels or KPIs discussed in the proposal - not a single vague “marketing services” line.",
      ],
    },
    {
      id: "line-items",
      heading: "Line items marketers should use",
      list: [
        "Monthly retainer - hours included and reporting cadence",
        "Campaign setup (tracking, pixels, landing pages coordination)",
        "Content calendar - posts, blogs, or newsletters delivered",
        "SEO audit or ongoing optimization - scope and period",
        "Ad spend management fee (separate from ad spend itself)",
        "Strategy workshop or discovery - fixed fee",
      ],
    },
    {
      id: "retainers",
      heading: "Retainer invoices that avoid scope creep",
      paragraphs: [
        "State the retainer period, included deliverables, and what triggers additional billing. When the client requests out-of-scope work, add a new line on the next invoice rather than absorbing it silently.",
      ],
    },
    {
      id: "reporting",
      heading: "Tie invoices to outcomes without guaranteeing them",
      paragraphs: [
        "Reference campaign names and reporting periods on the invoice. Avoid promising specific ROI on the invoice itself - describe services delivered, not guaranteed results, unless your contract explicitly structures performance fees.",
      ],
    },
  ],
  faqItems: [
    {
      question: "How do freelance marketers invoice monthly retainers?",
      answer:
        "Send a recurring invoice each period with the retainer fee, included services, and any overage lines. Use the same invoice number series for easy client accounting.",
    },
    {
      question: "Should ad spend appear on my marketing invoice?",
      answer:
        "List your management fee as a service line. Ad spend is usually billed directly by platforms or reimbursed separately - clarify in the invoice notes to avoid double-counting.",
    },
    {
      question: "What payment terms do marketing consultants use?",
      answer:
        "Net 14 or Net 30 is common. For new clients, request a deposit or first month upfront. State due dates clearly on every invoice.",
    },
    {
      question: "Can I bill multiple marketing channels on one invoice?",
      answer:
        "Yes. Use separate line items per channel (SEO, email, social) so clients can allocate budgets internally.",
    },
    {
      question: "Is there a free invoice template for marketing freelancers?",
      answer:
        "Invoice for Freelance is free and supports multi-line projects, PDF export, currency options, and cloud history - ideal for ongoing client retainers.",
    },
  ],
};
