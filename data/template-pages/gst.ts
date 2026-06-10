import type { TemplatePage } from "./types";

export const gstInvoiceTemplate: TemplatePage = {
  slug: "gst-invoice-template",
  title: "GST Invoice Template for Freelancers — Free & Compliant Format",
  description:
    "Free GST invoice template for Indian freelancers and service providers. Include GSTIN, HSN/SAC, taxable value, CGST/SGST or IGST, and download a professional PDF.",
  keywords: [
    "GST invoice template",
    "GST invoice format freelancer",
    "GST bill template India",
    "freelancer GST invoice",
    "SAC code invoice template",
  ],
  category: "India & tax",
  publishedAt: "2026-06-10",
  readingTimeMinutes: 9,
  relatedSlugs: [
    "how-to-create-freelance-invoice-in-india",
    "invoice-template-india",
    "invoice-template-for-developers",
    "usd-invoice-template",
  ],
  sections: [
    {
      id: "what-is-gst-invoice",
      heading: "What is a GST invoice?",
      paragraphs: [
        "A GST invoice is a tax invoice issued by a registered supplier under India’s Goods and Services Tax regime. It documents taxable supply of goods or services and shows tax charged at the applicable rate so the recipient can claim input tax credit where allowed.",
        "Freelancers and consultants registered under GST must issue invoices that meet statutory fields — not just a generic bill with a total.",
      ],
    },
    {
      id: "mandatory-fields",
      heading: "Mandatory fields on a GST invoice",
      list: [
        "Supplier name, address, and GSTIN",
        "Invoice number and date (consecutive series)",
        "Customer name, address, and GSTIN (if registered)",
        "Description of services with SAC code where applicable",
        "Taxable value, discount if any, and tax rate",
        "CGST + SGST for intra-state or IGST for inter-state",
        "Total invoice value in words and figures",
        "Place of supply for services",
      ],
    },
    {
      id: "sac-codes",
      heading: "SAC codes for common freelance services",
      paragraphs: [
        "Services use SAC (Services Accounting Code) instead of HSN. Design, IT, marketing, and professional services each map to SAC categories. Use the code that matches your primary service; your chartered accountant can confirm the right SAC for mixed work.",
      ],
      list: [
        "IT/design/development services — common SAC 998314 family (verify with CA)",
        "Marketing and advertising services — relevant SAC under 99836x",
        "Professional/consulting — check current SAC schedule for your activity",
      ],
      note: "Tax rates and SAC mapping change — confirm with a qualified tax professional for your filings.",
    },
    {
      id: "intra-vs-inter-state",
      heading: "CGST/SGST vs IGST",
      paragraphs: [
        "If you and your client are in the same state, you typically show CGST and SGST split. For inter-state supply, IGST applies. Your invoice template should calculate and display the correct split based on place of supply.",
      ],
    },
  ],
  faqItems: [
    {
      question: "Do all freelancers in India need a GST invoice?",
      answer:
        "Only if you are registered under GST or required to register based on turnover and rules. Unregistered freelancers issue regular invoices without GST breakdown until registration applies.",
    },
    {
      question: "What is the difference between a GST invoice and a regular invoice?",
      answer:
        "A GST invoice includes GSTIN, tax rate, taxable value, and CGST/SGST or IGST lines. A regular invoice may omit tax breakdown if you are not charging GST.",
    },
    {
      question: "Can I create a GST invoice online for free?",
      answer:
        "Yes. Invoice for Freelance supports GST-related fields, PDF export, and cloud storage so Indian freelancers can bill clients without manual Excel templates.",
    },
    {
      question: "What SAC code should I put on a freelance invoice?",
      answer:
        "Use the SAC that matches your primary service category. When unsure, consult your CA — wrong codes can cause compliance issues.",
    },
    {
      question: "How does IGST work on a freelancer invoice?",
      answer:
        "When place of supply is another state, IGST is charged instead of CGST+SGST. Show IGST amount separately on the invoice.",
    },
    {
      question: "Where can I find an India-specific invoice template?",
      answer:
        "See our invoice template for India page for currency, UPI, and domestic client billing alongside GST workflows.",
    },
  ],
};
