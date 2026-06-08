import type { GuideArticle } from "./types";

export const freelancerInvoiceChecklist: GuideArticle = {
  slug: "freelancer-invoice-checklist",
  title: "Freelancer Invoice Checklist: What Every Bill Must Include",
  description:
    "Use this freelancer invoice checklist to include every field clients and accountants expect: IDs, dates, line items, taxes, payment details, and professional formatting.",
  keywords: [
    "freelancer invoice checklist",
    "what to include on freelancer invoice",
    "freelance invoice requirements",
    "professional freelancer invoice",
  ],
  category: "Invoicing basics",
  publishedAt: "2026-05-28",
  readingTimeMinutes: 7,
  sections: [
    {
      id: "why-checklist",
      heading: "Why a checklist beats a template guess",
      paragraphs: [
        "Clients approve invoices quickly when nothing is missing. A freelancer invoice checklist ensures you include identifiers, dates, and payment instructions that accounts payable teams scan for in the first thirty seconds.",
        "Missing one field can delay payment by weeks. This list works for project invoices, hourly billing, and retainers.",
      ],
    },
    {
      id: "header",
      heading: "Header and identity",
      list: [
        "Your business or legal name",
        "Logo (optional but improves recognition)",
        "Your address, email, and phone",
        "Tax or registration ID when required in your country",
        "Client company name and billing contact",
        "Client address and email",
      ],
      paragraphs: [
        "Match the client name to their purchase order or contract. Nicknames slow down approval.",
      ],
    },
    {
      id: "invoice-meta",
      heading: "Invoice metadata",
      list: [
        "Unique invoice number (never reuse numbers)",
        "Invoice issue date",
        "Payment due date",
        "Payment terms in plain language (Due on receipt, Net 14, Net 30)",
        "Purchase order number if the client provided one",
        "Project or engagement name for context",
      ],
    },
    {
      id: "line-items",
      heading: "Line items and totals",
      list: [
        "Each service or deliverable on its own row",
        "Quantity and unit rate where applicable",
        "Short description so finance understands the charge",
        "Subtotal before tax and discounts",
        "Discounts or credits if agreed in advance",
        "Tax or VAT line when applicable",
        "Grand total in the invoice currency",
      ],
      paragraphs: [
        "Vague line items like \"design work\" invite questions. Tie each row to a deliverable, sprint, or approved scope.",
      ],
    },
    {
      id: "payment",
      heading: "Payment instructions",
      list: [
        "Accepted payment methods",
        "Bank name, account number, routing or SWIFT/IBAN as needed",
        "UPI ID or local payment details for domestic Indian clients",
        "Late fee or interest policy if you enforce one",
        "Notes with thank-you message or remittance instructions",
      ],
    },
    {
      id: "after-send",
      heading: "After you send the invoice",
      list: [
        "Save a PDF copy in your invoice history",
        "Mark the invoice as sent or pending in your tracker",
        "Follow up three days before the due date",
        "Mark paid when funds arrive and archive proof of payment",
      ],
      paragraphs: [
        "A checklist only works if you use it every time. Consistency is what makes you look like an established business, even when you are a team of one.",
      ],
    },
  ],
};
