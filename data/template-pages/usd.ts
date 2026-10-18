import type { TemplatePage } from "./types";

export const usdInvoiceTemplate: TemplatePage = {
  slug: "usd-invoice-template",
  title: "USD Invoice Template for Freelancers - Bill International Clients",
  description:
    "Free USD invoice template for freelancers billing US and global clients. Show amounts in dollars, payment details for wire/Wise, and export a professional PDF.",
  keywords: [
    "USD invoice template",
    "invoice in dollars freelancer",
    "US client invoice template",
    "international freelancer USD billing",
    "dollar invoice format",
  ],
  category: "Currency",
  publishedAt: "2026-06-10",
  readingTimeMinutes: 8,
  relatedSlugs: [
    "invoice-template-for-developers",
    "invoice-template-for-designers",
    "invoice-template-for-marketers",
    "gst-invoice-template",
  ],
  sections: [
    {
      id: "why-usd",
      heading: "Why freelancers invoice in USD",
      paragraphs: [
        "USD is the default currency for many US startups and global companies paying overseas contractors. Invoicing in dollars reduces conversion confusion for American accounts payable teams and aligns with contracts quoted in USD.",
        "If you are outside the US, you still need clear payment instructions and currency labels on every line and total.",
      ],
    },
    {
      id: "what-to-include",
      heading: "What to include on a USD invoice",
      list: [
        "Currency code USD on all amounts and the grand total",
        "Your legal name and address (as on bank account)",
        "Client legal name and billing address",
        "Invoice number, issue date, and due date",
        "Itemized services with rates in USD",
        "Payment instructions: SWIFT/BIC, IBAN or US routing/account",
        "Wise or PayPal details if offered as alternatives",
        "Note on who pays transfer fees if relevant",
      ],
    },
    {
      id: "payment-methods",
      heading: "Getting paid in USD across borders",
      paragraphs: [
        "International wire (SWIFT) suits larger invoices. Wise and similar multi-currency accounts often reduce fees. Some clients prefer PayPal for smaller amounts. List one primary method and keep details on the PDF so finance does not email you for routing numbers.",
      ],
    },
    {
      id: "tax-forms",
      heading: "W-8BEN and US clients",
      paragraphs: [
        "US companies paying foreign freelancers may request Form W-8BEN to document your non-US status for withholding. Your invoice does not replace tax forms but should match the name and address on those filings.",
      ],
    },
  ],
  faqItems: [
    {
      question: "How do I invoice a US client in USD?",
      answer:
        "Set currency to USD, list services in dollars, include wire or Wise details on the invoice, and send a PDF. Agree on USD in your contract before the first bill.",
    },
    {
      question: "Should I show only USD on the invoice if I convert to my local currency?",
      answer:
        "Yes - show USD as the invoice currency. Your bank converts on receipt; do not mix currencies on one invoice unless explicitly agreed.",
    },
    {
      question: "What payment details do US clients need on a USD invoice?",
      answer:
        "For US domestic payers: routing and account numbers. For international wires: SWIFT/BIC and IBAN or account number. Include beneficiary name exactly as registered at the bank.",
    },
    {
      question: "Is a free USD invoice template available for freelancers?",
      answer:
        "Invoice for Freelance lets you set USD, add line items, export PDFs, and store invoices free in the cloud.",
    },
    {
      question: "Do I charge US sales tax on a USD invoice as a foreign freelancer?",
      answer:
        "Usually not for pure services exported from abroad, but rules vary. US clients often handle sales tax on their side - confirm with a tax advisor.",
    },
    {
      question: "Which professions use USD invoices most?",
      answer:
        "Developers, designers, marketers, and video editors billing US startups commonly use USD - see our profession-specific templates for line item examples.",
    },
  ],
};
