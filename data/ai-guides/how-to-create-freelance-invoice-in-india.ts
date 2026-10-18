import type { AiGuide } from "./types";

export const howToCreateFreelanceInvoiceInIndia: AiGuide = {
  slug: "how-to-create-freelance-invoice-in-india",
  title: "How to Create a Freelance Invoice in India",
  description:
    "Step-by-step guide for Indian freelancers: GST invoices, HSN/SAC codes, UPI payments, export billing, international USD payments, and TDS - with tables, definitions, and FAQs.",
  keywords: [
    "how to create freelance invoice in India",
    "freelancer invoice India GST",
    "SAC code freelancer invoice",
    "UPI on invoice India",
    "export invoice freelancer India",
    "TDS freelancer India",
    "international payment invoice India",
  ],
  category: "India invoicing",
  publishedAt: "2026-06-10",
  readingTimeMinutes: 14,
  summary:
    "Indian freelancers issue tax invoices (with GST if registered), include SAC codes and payment details (UPI, bank), handle TDS when clients deduct tax, and use export or USD formats for overseas clients. This guide covers each element with steps, tables, and definitions.",
  steps: [
    {
      step: 1,
      title: "Confirm your registration status",
      description:
        "Check whether you are GST-registered, operate as a sole proprietor or company, and have PAN details ready. Your invoice format depends on registration.",
      items: [
        "GST-registered → issue GST tax invoice with GSTIN",
        "Not registered → regular invoice without GST lines (until threshold applies)",
        "Keep PAN on all invoices for domestic B2B clients",
      ],
    },
    {
      step: 2,
      title: "Choose domestic, export, or international format",
      description:
        "Domestic Indian clients are usually billed in INR. Export of services may use LUT/zero-rated GST rules. Foreign clients often pay in USD via wire or Wise.",
      items: [
        "Domestic → INR invoice with UPI/bank details",
        "Export of services → export invoice + LUT reference if applicable",
        "Foreign client → USD invoice with SWIFT/Wise details",
      ],
    },
    {
      step: 3,
      title: "Add client and invoice metadata",
      description:
        "Every invoice needs a unique serial number, date, client legal name, address, and GSTIN (if the client is registered). Match names to bank and tax records.",
    },
    {
      step: 4,
      title: "Write line items with SAC codes",
      description:
        "Describe services clearly and add the correct SAC (Services Accounting Code). Finance teams use SAC for GST returns and vendor onboarding.",
      items: [
        "One line per deliverable or billing period",
        "Quantity × rate = taxable value",
        "Mention project name or SOW reference",
      ],
    },
    {
      step: 5,
      title: "Calculate GST or export treatment",
      description:
        "Intra-state: CGST + SGST. Inter-state: IGST. Export under LUT may be zero-rated - confirm with your chartered accountant. Show tax breakdown explicitly.",
    },
    {
      step: 6,
      title: "Add payment details and terms",
      description:
        "Include UPI ID, bank account, IFSC, payment due date (Net 7/15/30), and late-fee policy if any. For international payments, add SWIFT/BIC and beneficiary name as per bank.",
    },
    {
      step: 7,
      title: "Export PDF and track TDS credits",
      description:
        "Send the PDF to your client. If they deduct TDS (e.g. under Section 194J), ensure you receive Form 16A and reflect credits in your income tax return.",
    },
  ],
  definitions: [
    {
      term: "GST (Goods and Services Tax)",
      definition:
        "India's indirect tax on supply of goods and services. GST-registered freelancers charge GST on taxable services and issue tax invoices showing CGST/SGST or IGST.",
    },
    {
      term: "HSN / SAC",
      definition:
        "HSN classifies goods; SAC (Services Accounting Code) classifies services. Freelancers use SAC on invoices so clients and GST systems can categorize your service correctly.",
    },
    {
      term: "UPI (Unified Payments Interface)",
      definition:
        "Instant bank-to-bank payment rail in India. Adding your UPI ID (e.g. name@bank) on invoices speeds up domestic client payments.",
    },
    {
      term: "Export invoice",
      definition:
        "Invoice for services supplied to a foreign client. May be zero-rated under GST when export conditions and LUT/bond requirements are met - seek CA advice.",
    },
    {
      term: "International payment",
      definition:
        "Payment from overseas via SWIFT wire, Wise, PayPal, or similar. Often denominated in USD; include foreign currency amounts and FIRC after receipt for compliance.",
    },
    {
      term: "TDS (Tax Deducted at Source)",
      definition:
        "When a client deducts tax before paying you (common under Section 194J for professional services), they issue Form 16A. You invoice the gross amount; net payment reflects TDS.",
    },
    {
      term: "IGST",
      definition:
        "Integrated GST charged on inter-state supplies of services. Appears on invoices when you and the client are in different states.",
    },
    {
      term: "LUT (Letter of Undertaking)",
      definition:
        "Document filed by exporters of services to supply without IGST payment on zero-rated exports. Relevant when billing foreign clients from India.",
    },
    {
      term: "FIRC",
      definition:
        "Foreign Inward Remittance Certificate - bank proof that foreign currency was received against an export invoice. Useful for GST and income records.",
    },
  ],
  tables: [
    {
      id: "sac-codes",
      caption: "Common SAC codes for freelance services (verify with your CA)",
      headers: ["Service type", "Typical SAC", "Notes"],
      rows: [
        [
          "IT / software development",
          "998314",
          "Information technology design and development services",
        ],
        [
          "Design / creative services",
          "998391",
          "Specialized design services (verify for your activity)",
        ],
        [
          "Marketing / advertising",
          "998361",
          "Advertising services (scope varies)",
        ],
        [
          "Consulting / professional",
          "998312",
          "Business consulting - confirm exact SAC with CA",
        ],
        [
          "Photography / video production",
          "998387",
          "Photographic and video services (check sub-category)",
        ],
      ],
    },
    {
      id: "tds-sections",
      caption: "TDS sections relevant to Indian freelancers (indicative)",
      headers: ["Section", "Payer", "Typical rate", "Form"],
      rows: [
        [
          "194J",
          "Companies / certain deductors",
          "10% on professional fees (2% technical services)",
          "Form 16A",
        ],
        [
          "194C",
          "Contractors / sub-contractors",
          "1% (individual/HUF) or 2% (others)",
          "Form 16A",
        ],
        [
          "194H",
          "Commission payments",
          "5%",
          "Form 16A",
        ],
      ],
    },
    {
      id: "payment-methods",
      caption: "Payment methods on Indian freelance invoices",
      headers: ["Method", "Best for", "Include on invoice"],
      rows: [
        ["UPI", "Domestic quick payments", "UPI ID (name@bank)"],
        ["NEFT / IMPS", "Domestic bank transfer", "Account number + IFSC"],
        ["RTGS", "Large domestic transfers", "Account number + IFSC"],
        ["SWIFT wire", "International USD/EUR", "SWIFT/BIC, IBAN/account"],
        ["Wise / PayPal", "Cross-border smaller amounts", "Account email or link"],
      ],
    },
    {
      id: "gst-breakdown",
      caption: "GST display on freelancer invoices",
      headers: ["Scenario", "Tax lines", "Example"],
      rows: [
        [
          "Same state client",
          "CGST + SGST",
          "9% + 9% on taxable value (18% total - rate varies by service)",
        ],
        [
          "Different state client",
          "IGST",
          "18% IGST on taxable value (rate varies)",
        ],
        [
          "Export with LUT",
          "Zero-rated",
          "No IGST if conditions met - note LUT on invoice",
        ],
        [
          "Not GST registered",
          "No GST lines",
          "Invoice total without tax breakdown",
        ],
      ],
    },
  ],
  comparisons: [
    {
      id: "gst-vs-regular",
      caption: "GST invoice vs regular invoice (India)",
      leftLabel: "GST tax invoice",
      rightLabel: "Regular invoice (non-GST)",
      rows: [
        {
          aspect: "Who issues",
          left: "GST-registered freelancer",
          right: "Freelancer not registered under GST",
        },
        {
          aspect: "GSTIN",
          left: "Required on invoice",
          right: "Not shown",
        },
        {
          aspect: "SAC code",
          left: "Required for services",
          right: "Optional but helpful",
        },
        {
          aspect: "Tax lines",
          left: "CGST/SGST or IGST",
          right: "None",
        },
        {
          aspect: "Client GSTIN",
          left: "Required for B2B registered clients",
          right: "Optional",
        },
      ],
    },
    {
      id: "domestic-vs-export",
      caption: "Domestic INR invoice vs export / international invoice",
      leftLabel: "Domestic (India client)",
      rightLabel: "Export / international client",
      rows: [
        {
          aspect: "Currency",
          left: "INR",
          right: "USD or foreign currency common",
        },
        {
          aspect: "Payment",
          left: "UPI, NEFT, IMPS",
          right: "SWIFT, Wise, PayPal",
        },
        {
          aspect: "GST",
          left: "CGST/SGST or IGST if registered",
          right: "Zero-rated export possible with LUT - consult CA",
        },
        {
          aspect: "TDS",
          left: "194J / 194C may apply",
          right: "Usually no Indian TDS; W-8BEN for US clients",
        },
        {
          aspect: "Records",
          left: "GST returns + ITR",
          right: "FIRC + export documentation",
        },
      ],
    },
  ],
  faqItems: [
    {
      question: "How do I create a freelance invoice in India?",
      answer:
        "Add your business details and PAN/GSTIN, client details, unique invoice number, service line items with SAC codes, GST breakdown if registered, payment details (UPI/bank), and export PDF. Use Invoice for Freelance for a free GST-ready template.",
    },
    {
      question: "Is GST mandatory on freelancer invoices in India?",
      answer:
        "GST applies when you are registered or exceed registration thresholds. Registered freelancers must issue GST tax invoices with GSTIN, SAC, and CGST/SGST or IGST. Unregistered freelancers issue regular invoices without GST until registration is required.",
    },
    {
      question: "What SAC code should I use on a freelance invoice?",
      answer:
        "Use the SAC matching your primary service - e.g. IT services often use 998314. SAC codes vary by activity; confirm with a chartered accountant before filing returns.",
    },
    {
      question: "Should I put UPI on my invoice?",
      answer:
        "Yes for Indian clients. UPI enables instant payment. Display your UPI ID alongside bank account and IFSC for clients who prefer NEFT or RTGS.",
    },
    {
      question: "How do export invoices work for Indian freelancers?",
      answer:
        "Bill the foreign client in USD or agreed currency, describe services as export of services, and follow LUT/zero-rating rules if applicable. Keep FIRC from the bank as proof of foreign inward remittance.",
    },
    {
      question: "How do international payments work for Indian freelancers?",
      answer:
        "Clients pay via SWIFT wire, Wise, or PayPal. Quote in USD, include SWIFT/BIC and beneficiary details on the invoice, and reconcile with FIRC when funds arrive in India.",
    },
    {
      question: "What is TDS on freelancer invoices?",
      answer:
        "Clients may deduct TDS (often 10% under Section 194J for professional services) and pay you the net amount. Invoice the gross fee; claim TDS credit using Form 16A in your income tax return.",
    },
    {
      question: "Can I use a free tool to create India freelancer invoices?",
      answer:
        "Yes. Invoice for Freelance supports INR, UPI fields, GST-related details, PDF export, and templates for India, GST, and USD billing - free for freelancers.",
    },
  ],
  relatedLinks: [
    {
      href: "/gst-invoice-template",
      label: "GST invoice template",
      description: "GSTIN, SAC, and tax line format",
    },
    {
      href: "/invoice-template-india",
      label: "Invoice template India",
      description: "INR, UPI, and domestic billing",
    },
    {
      href: "/usd-invoice-template",
      label: "USD invoice template",
      description: "Bill international clients in dollars",
    },
    {
      href: "/guide/gst-invoicing-india-freelancers",
      label: "GST invoicing guide",
      description: "Extended GST article in our guide",
    },
    {
      href: "/signup",
      label: "Create free invoice",
      description: "Start billing with Invoice for Freelance",
    },
  ],
};
