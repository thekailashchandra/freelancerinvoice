import type { GuideArticle } from "./types";

export const howToBillInternationalClients: GuideArticle = {
  slug: "how-to-bill-international-clients",
  title: "How to Bill International Clients as a Freelancer",
  description:
    "A practical guide to invoicing overseas clients: currency, payment methods, tax IDs, contracts, and professional invoice formatting for global freelance work.",
  keywords: [
    "how to bill international clients",
    "invoice international clients freelancer",
    "freelance international invoicing",
    "bill overseas clients",
    "cross-border freelancer billing",
  ],
  category: "Tax & Compliance",
  pillar: "tax-compliance-currency",
  publishedAt: "2026-06-01",
  readingTimeMinutes: 9,
  sections: [
    {
      id: "why-international-billing-matters",
      heading: "Why international billing needs a different approach",
      paragraphs: [
        "Working with clients in another country is normal for designers, developers, writers, and consultants. What is not normal is treating an overseas invoice exactly like a domestic one. Currency, payment rails, tax treatment, and client expectations all shift when a client sits in a different jurisdiction.",
        "A clear international invoice reduces payment delays, accounting confusion, and disputes. It also signals professionalism, which matters when a client compares you to local vendors who already know how billing works in their market.",
      ],
    },
    {
      id: "choose-the-right-currency",
      heading: "Choose the right invoice currency",
      paragraphs: [
        "You can usually invoice in your home currency, the client's currency, or a neutral currency such as USD. The best choice depends on who bears exchange-rate risk and how you will actually receive funds.",
      ],
      list: [
        "Invoice in your home currency when you want predictable income and your client can pay via international transfer.",
        "Invoice in the client's currency when they require local-currency accounting and you can hold or convert that currency affordably.",
        "Use USD for US-based or global clients when both sides are comfortable with it and your bank supports USD receipts.",
        "State the currency code clearly on every line item and on the total (for example, USD, EUR, GBP, or INR).",
      ],
      note: "Agree on currency in your contract or statement of work before you send the first invoice.",
    },
    {
      id: "what-to-include",
      heading: "What to include on an international freelancer invoice",
      paragraphs: [
        "Beyond standard line items, international invoices should make it easy for a client's accounts payable team to approve and pay you without back-and-forth email.",
      ],
      list: [
        "Your legal name or registered business name and full address",
        "Client company name, billing contact, and address",
        "Unique invoice number and issue date",
        "Payment due date and payment terms (for example, Net 14 or Net 30)",
        "Itemized services with quantities, rates, and subtotal",
        "Tax or VAT details only when applicable (see below)",
        "Total amount due in the agreed currency",
        "Accepted payment methods with the details the client needs (SWIFT/IBAN, routing number, Wise details, PayPal, etc.)",
        "Purchase order number if the client's procurement team requires it",
      ],
    },
    {
      id: "payment-methods",
      heading: "Payment methods that work across borders",
      paragraphs: [
        "Bank wire transfers are common for larger amounts but carry fees on both sides. Wise, PayPal, and similar services can be faster for smaller invoices, though fees and conversion rates vary.",
        "List one primary method and one backup. If you accept wire transfer, include SWIFT/BIC and IBAN (or account and routing numbers for US payments) directly on the invoice so finance teams do not have to hunt for them.",
      ],
      list: [
        "International wire (SWIFT): best for larger project payments",
        "Wise or similar multi-currency accounts: often lower fees than traditional wires",
        "PayPal: convenient for smaller amounts; confirm who pays withdrawal fees",
        "Stripe or card payments: useful when the client expects a pay link (if you offer it)",
      ],
    },
    {
      id: "tax-and-compliance",
      heading: "Tax IDs, VAT, and withholding",
      paragraphs: [
        "Cross-border tax rules are complex and depend on your country, the client's country, and the type of service. You are responsible for understanding your obligations, but your invoice should surface the identifiers finance teams expect.",
        "If you are registered for VAT, GST, or sales tax, include your registration number when local rules require it. If no tax applies, say so explicitly on the invoice to avoid the client withholding incorrectly.",
        "Some countries require clients to withhold tax on payments to foreign contractors. Your contract should clarify who handles withholding and whether you provide tax residency certificates (such as Form W-8BEN for US clients paying non-US freelancers).",
      ],
      note: "This guide is general information, not tax advice. Consult a qualified accountant for your situation.",
    },
    {
      id: "contracts-and-terms",
      heading: "Contracts, payment terms, and late fees",
      paragraphs: [
        "International projects run smoother when payment terms are written before work begins. Specify deposit requirements, milestone billing, final payment upon delivery, and what happens if a client pays late.",
        "Net 30 is common in corporate environments but slow for freelancers. Many independent contractors use Net 14, due on receipt for smaller jobs, or 50% upfront for new overseas clients.",
        "If you charge late fees or interest, state the policy on the invoice and in your contract. Keep the language simple so it is enforceable and easy for accounts payable to process.",
      ],
    },
    {
      id: "common-mistakes",
      heading: "Common mistakes when billing overseas clients",
      list: [
        "Sending an invoice without confirming currency and payment method",
        "Omitting SWIFT/IBAN or routing details, which stalls payment for weeks",
        "Using vague line items like \"consulting\" instead of deliverable-based descriptions",
        "Forgetting to match the invoice to a purchase order number",
        "Not keeping PDF copies and payment records for tax filing",
        "Assuming tax does not apply simply because the client is abroad",
      ],
      paragraphs: [
        "Most payment delays are operational, not malicious. A complete invoice fixes the majority of them.",
      ],
    },
    {
      id: "workflow",
      heading: "A simple international billing workflow",
      paragraphs: [
        "Use a consistent workflow so every overseas client gets the same professional experience.",
      ],
      list: [
        "Confirm currency, payment method, and terms in writing before starting work.",
        "Issue invoices with unique numbers and clear due dates as soon as milestones are approved.",
        "Send PDF invoices to the client's accounts payable email when you have it.",
        "Track status as pending, paid, or overdue and follow up three days before and after the due date.",
        "Store invoices and proof of payment together for year-end tax reporting.",
      ],
      note: "Invoice for Freelance supports multi-currency invoices, country-specific payment fields, and PDF export so you can bill international clients from one place.",
    },
  ],
};
