import type { GuideArticle } from "./types";

export const paymentTermsForFreelancers: GuideArticle = {
  slug: "payment-terms-for-freelancers",
  title: "Payment Terms for Freelancers: Net 30, Deposits, and Late Fees",
  description:
    "Learn how to write freelance payment terms that protect your cash flow: deposits, milestone billing, Net 30 vs Net 14, late fees, and what to put on your invoice.",
  keywords: [
    "payment terms for freelancers",
    "freelance payment terms",
    "net 30 freelancer invoice",
    "freelancer deposit invoice",
    "late payment freelancer",
  ],
  category: "Invoicing & Billing",
  pillar: "invoicing-billing",
  publishedAt: "2026-05-25",
  readingTimeMinutes: 8,
  sections: [
    {
      id: "what-are-payment-terms",
      heading: "What payment terms mean on a freelance invoice",
      paragraphs: [
        "Payment terms tell the client when money is due and under what conditions. They belong in your contract and on every invoice so accounts payable does not need to guess.",
        "\"Net 30\" means the balance is due thirty days after the invoice date. \"Due on receipt\" means immediately. Clear terms reduce awkward conversations later.",
      ],
    },
    {
      id: "common-terms",
      heading: "Common payment terms freelancers use",
      list: [
        "Due on receipt: best for small projects and trusted repeat clients",
        "Net 7 or Net 14: faster cash flow while still corporate-friendly",
        "Net 30: standard at large companies; plan your runway accordingly",
        "50% deposit upfront, 50% on delivery: common for new clients or custom work",
        "Milestone billing: tie payments to approved phases of a project",
        "Monthly retainer billed in advance: stabilizes recurring revenue",
      ],
    },
    {
      id: "deposits",
      heading: "When to require a deposit",
      paragraphs: [
        "Deposits protect you from scope creep and client ghosting after work begins. They are especially important for fixed-price projects longer than two weeks.",
        "Send a deposit invoice before kickoff. Label it clearly (for example, \"Project deposit, 40% of total fee\") and reference the final project total in notes.",
      ],
      list: [
        "New clients with no payment history",
        "Custom design, development, or strategy engagements",
        "Projects where you block other work on your calendar",
        "Expensive third-party costs you pay upfront (licenses, stock, ads)",
      ],
    },
    {
      id: "late-fees",
      heading: "Late fees and follow-up",
      paragraphs: [
        "A late fee policy motivates on-time payment only if clients know about it before work starts. State the percentage or flat fee in your contract and repeat it in invoice notes.",
        "Start with polite reminders: three days before due date, on the due date, and three and seven days after. Escalate to a phone call or pause work according to your contract.",
      ],
      note: "Late fee enforceability varies by jurisdiction. Ask a lawyer for wording that fits your country and client type.",
    },
    {
      id: "on-invoice",
      heading: "How to display terms on the invoice",
      list: [
        "Add a \"Payment terms\" field (for example, Net 14)",
        "Show a bold due date near the total",
        "Repeat primary payment method details below the total",
        "Include late fee language in notes if applicable",
      ],
      paragraphs: [
        "Clients scan the bottom right of an invoice for the total and due date. Put both where they expect them.",
      ],
    },
  ],
};
