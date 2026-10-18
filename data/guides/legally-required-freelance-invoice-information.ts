import type { GuideArticle } from "./types";

export const legallyRequiredFreelanceInvoiceInformation: GuideArticle = {
  slug: "legally-required-freelance-invoice-information",
  title: "What Information Is Legally Required on a Freelance Invoice?",
  description:
    "Mandatory invoice fields for freelancers in the US, UK, EU, and India - plus best-practice fields that speed up client payment.",
  keywords: [
    "legally required invoice information",
    "freelance invoice requirements",
    "what to include on freelancer invoice",
    "invoice legal requirements",
    "mandatory invoice fields",
  ],
  category: "Invoicing & Billing",
  pillar: "invoicing-billing",
  hubClusterId: "freelance-invoicing-getting-paid",
  publishedAt: "2026-06-11",
  readingTimeMinutes: 9,
  coreBlock: {
    id: "required-fields-by-region",
    heading: "Legally required invoice fields by region",
    table: {
      caption: "Mandatory freelance invoice fields in the US, UK, EU, and India",
      headers: ["Field", "US", "UK", "EU", "India"],
      rows: [
        ["Seller identity", "Required", "Required", "Required", "Required (GSTIN if registered)"],
        ["Buyer identity", "Required", "Required", "Required", "Required"],
        ["Invoice number", "Required", "Required", "Required", "Required (sequential)"],
        ["Invoice & due dates", "Required", "Required", "Required", "Required"],
        ["Line items & total", "Required", "Required", "Required", "Required"],
        ["Tax ID / VAT", "EIN on W-9", "VAT number if registered", "VAT number if registered", "GSTIN + HSN/SAC"],
        ["Tax breakdown", "If sales tax applies", "VAT amount", "VAT rate & amount", "CGST/SGST or IGST"],
      ],
    },
  },
  sections: [
    {
      id: "universal",
      heading: "Fields every freelance invoice should include",
      paragraphs: [
        "Regardless of country, a professional invoice identifies who is billing, who is being billed, what was delivered, how much is owed, and when payment is due. Missing any of these slows accounts payable.",
      ],
      list: [
        "Seller name and contact information",
        "Buyer name and billing address",
        "Unique invoice number",
        "Invoice date and payment due date",
        "Description of goods or services",
        "Quantity, unit price, and line totals",
        "Total amount due",
        "Payment instructions",
      ],
    },
    {
      id: "united-states",
      heading: "United States requirements",
      paragraphs: [
        "The US does not mandate a single federal invoice format for freelancers. However, invoices must support tax reporting - especially if you receive 1099-NEC income.",
      ],
      list: [
        "Your legal name or business name",
        "Your address and contact details",
        "Client name and address",
        "Invoice number and date",
        "Description of services and amount",
        "Your EIN or SSN (on W-9, not always on the invoice itself)",
        "Sales tax if applicable (varies by state and service type)",
      ],
      note: "Consult a CPA for state-specific sales tax obligations on your services.",
    },
    {
      id: "united-kingdom",
      heading: "United Kingdom requirements",
      list: [
        "Your name and business address",
        "Client name and address",
        "Unique invoice number",
        "Invoice date and tax point date",
        "Description of services",
        "VAT rate and amount if VAT-registered",
        "Your VAT registration number (if registered)",
        "Total amount payable",
      ],
      paragraphs: [
        "If you are not VAT-registered, you do not charge VAT but should still issue clear invoices for income tax records.",
      ],
    },
    {
      id: "european-union",
      heading: "European Union requirements",
      list: [
        "Seller and buyer identification (name, address, VAT ID if applicable)",
        "Invoice number and date",
        "Description and quantity of services",
        "VAT rate and amount (or reverse-charge note for B2B cross-border)",
        "Total amount due",
        "Payment terms",
      ],
      paragraphs: [
        "Cross-border EU B2B services often use reverse charge - the client accounts for VAT, not you. State this on the invoice.",
      ],
    },
    {
      id: "india",
      heading: "India requirements (GST and non-GST)",
      paragraphs: [
        "GST-registered freelancers must issue tax invoices with specific mandatory fields under GST law.",
      ],
      list: [
        "Supplier name, address, and GSTIN",
        "Invoice number and date",
        "Recipient name, address, and GSTIN (if registered)",
        "HSN/SAC code for services",
        "Taxable value, CGST/SGST or IGST amounts",
        "Total invoice value in words and figures",
        "Place of supply",
        "Signature or digital signature",
      ],
      note: "Non-GST-registered freelancers below the threshold issue regular invoices without GST breakdown but should still include PAN and business details.",
    },
    {
      id: "best-practice",
      heading: "Best-practice fields that speed up payment",
      list: [
        "Purchase order (PO) number if the client provided one",
        "Project name or reference code",
        "Payment terms in plain language (Net 30, due on receipt)",
        "Multiple payment options (bank, UPI, Wise)",
        "Late fee policy reference",
        "Currency code for international invoices (USD, INR, EUR)",
      ],
    },
    {
      id: "mistakes",
      heading: "Common mistakes that delay payment",
      list: [
        "Missing or duplicate invoice numbers",
        "No due date - AP teams deprioritize undated invoices",
        "Vague line items (\"consulting\" instead of \"March 2026 strategy retainer\")",
        "Wrong client entity name (billing the parent company incorrectly)",
        "Missing bank details or incorrect account numbers",
        "Sending invoices to the wrong email address",
      ],
    },
  ],
};
