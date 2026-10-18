import type { TemplatePage } from "./types";

export const invoiceTemplateForPhotographers: TemplatePage = {
  slug: "invoice-template-for-photographers",
  title: "Invoice Template for Photographers - Sessions, Licensing & Prints",
  description:
    "Free invoice template for freelance photographers. Bill weddings, events, commercial shoots, editing, and image licensing with professional PDF invoices.",
  keywords: [
    "invoice template for photographers",
    "photography invoice template",
    "freelance photographer billing",
    "wedding photography invoice",
    "photo licensing invoice",
  ],
  category: "By profession",
  publishedAt: "2026-06-10",
  readingTimeMinutes: 8,
  relatedSlugs: [
    "invoice-template-for-designers",
    "invoice-template-for-video-editors",
    "invoice-template-for-marketers",
    "usd-invoice-template",
  ],
  sections: [
    {
      id: "photography-billing-basics",
      heading: "Photography billing basics",
      paragraphs: [
        "Photographers often sell a bundle: shooting time, editing, deliverables, and sometimes print or licensing rights. Your invoice should separate these so clients see value and you avoid giving away usage you should charge for.",
      ],
    },
    {
      id: "what-to-include",
      heading: "What to include on a photography invoice",
      list: [
        "Shoot date, location, and event or campaign name",
        "Package name (e.g. 4-hour wedding coverage + 400 edited images)",
        "Add-ons: extra hours, second shooter, rush edit, travel",
        "Licensing scope (personal, commercial, editorial, territory)",
        "Print or album products as separate line items",
        "Deposit applied and balance due",
        "Payment deadline and late-fee policy if you use one",
      ],
    },
    {
      id: "licensing-line-items",
      heading: "How to line-item image licensing",
      paragraphs: [
        "Commercial clients often need explicit usage on the invoice: duration, media (web, print, OOH), and exclusivity. A line such as “Commercial license - 12 months, digital + social, non-exclusive” sets expectations and supports renewals later.",
      ],
    },
    {
      id: "deposits-and-balances",
      heading: "Deposits, retainers, and final balances",
      paragraphs: [
        "Show the deposit as a credit line or subtract it from the total so the client sees the remaining balance clearly. For event photography, many freelancers invoice 50% upfront and 50% before delivery - mirror that on each document.",
      ],
    },
  ],
  faqItems: [
    {
      question: "How should photographers structure invoice line items?",
      answer:
        "Split shooting, editing/delivery, travel, and licensing into separate lines. Clients approve faster when they see what each fee covers.",
    },
    {
      question: "Do wedding photographers need a different invoice template?",
      answer:
        "The same template works; customize line items for package hours, deliverable count, albums, and balance after deposit.",
    },
    {
      question: "How do I bill for photo licensing on an invoice?",
      answer:
        "Add a dedicated line describing usage type, duration, media channels, and exclusivity. Reference the agreement or quote number if you have one.",
    },
    {
      question: "Should I charge tax on photography services?",
      answer:
        "Depends on your country and registration. In India, GST may apply; include GSTIN and tax breakdown on GST invoices. Consult a local accountant for your situation.",
    },
    {
      question: "Can I invoice photography clients in USD?",
      answer:
        "Yes for international clients. Use a USD invoice template, state currency on every total, and list payment details that accept USD.",
    },
  ],
};
