import type { TemplatePage } from "./types";

export const invoiceTemplateIndia: TemplatePage = {
  slug: "invoice-template-india",
  title: "Invoice Template India — Free Format for Freelancers & Consultants",
  description:
    "Free invoice template for Indian freelancers. Bill in INR with UPI, bank details, GST-ready fields, and professional PDF export for domestic and export clients.",
  keywords: [
    "invoice template India",
    "Indian freelancer invoice format",
    "invoice format for freelancers India",
    "INR invoice template",
    "freelance bill format India",
  ],
  category: "India & tax",
  publishedAt: "2026-06-10",
  readingTimeMinutes: 9,
  relatedSlugs: [
    "how-to-create-freelance-invoice-in-india",
    "gst-invoice-template",
    "invoice-template-for-developers",
    "usd-invoice-template",
  ],
  sections: [
    {
      id: "india-freelance-invoicing",
      heading: "Invoicing as a freelancer in India",
      paragraphs: [
        "Indian freelancers bill domestic clients in INR and export clients in USD or other currencies. A good India invoice template includes your PAN/business details, clear line items, payment methods clients actually use (UPI, NEFT, IMPS), and GST breakdown when you are registered.",
      ],
    },
    {
      id: "essential-fields",
      heading: "Essential fields for an Indian invoice",
      list: [
        "Your name or business name and address",
        "PAN and GSTIN if registered under GST",
        "Client name, address, and GSTIN if B2B registered",
        "Invoice number and date",
        "Description of services and amount in INR",
        "GST components if applicable",
        "Bank account, IFSC, and UPI ID for payment",
        "Payment terms and due date",
      ],
    },
    {
      id: "upi-and-bank",
      heading: "UPI and bank details on the invoice",
      paragraphs: [
        "Most Indian clients prefer UPI or NEFT. Print your UPI ID and bank IFSC on the PDF so accounts teams can pay without asking. For larger companies, include GSTIN and SAC for their vendor portal.",
      ],
    },
    {
      id: "export-services",
      heading: "Billing foreign clients from India",
      paragraphs: [
        "Export of services may have different GST treatment than domestic billing. Many Indian freelancers invoice overseas clients in USD without GST on the invoice when LUT/export rules apply — confirm with your CA. Link to our USD template for dollar-denominated bills.",
      ],
    },
  ],
  faqItems: [
    {
      question: "What is the standard invoice format in India for freelancers?",
      answer:
        "Include supplier and buyer details, invoice number, date, service description, amount, payment details, and GST lines if registered. PDF format is widely accepted.",
    },
    {
      question: "Should I add UPI on my freelance invoice?",
      answer:
        "Yes — UPI is the fastest payment method for many Indian clients. Add UPI ID alongside bank account and IFSC.",
    },
    {
      question: "Do I need GST on every invoice in India?",
      answer:
        "Only if you are GST-registered or legally required to charge GST. Unregistered freelancers issue tax invoices without GST until registration thresholds apply.",
    },
    {
      question: "Can I invoice Indian clients in USD?",
      answer:
        "Domestic rupee transactions are normally in INR. USD is typical for foreign clients. Use the USD template for international work.",
    },
    {
      question: "Where can I get a GST invoice template?",
      answer:
        "See our dedicated GST invoice template page for SAC, CGST/SGST, and IGST fields.",
    },
    {
      question: "Is there a free invoice generator for Indian freelancers?",
      answer:
        "Invoice for Freelance is free, supports INR, UPI fields, GST-related details, PDF export, and cloud invoice history.",
    },
  ],
};
