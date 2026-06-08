import type { GuideArticle } from "./types";

export const gstInvoicingIndiaFreelancers: GuideArticle = {
  slug: "gst-invoicing-india-freelancers",
  title: "GST Invoicing for Freelancers in India: A Practical Guide",
  description:
    "How Indian freelancers handle GST on invoices: registration thresholds, GSTIN on bills, CGST/SGST vs IGST, and what to include when billing domestic and international clients.",
  keywords: [
    "GST invoicing freelancers India",
    "freelancer GST invoice",
    "GSTIN invoice freelancer",
    "India freelance invoice GST",
    "IGST freelancer invoice",
  ],
  category: "Tax & compliance",
  publishedAt: "2026-05-20",
  readingTimeMinutes: 10,
  sections: [
    {
      id: "gst-overview",
      heading: "Do freelancers need GST registration?",
      paragraphs: [
        "In India, GST (Goods and Services Tax) applies to many freelance services. Registration is generally required when aggregate turnover crosses the prescribed threshold, or if you make inter-state taxable supplies from day one in certain cases.",
        "Thresholds and rules change; verify current limits on the official GST portal or with a chartered accountant. Many freelancers register voluntarily before the threshold to claim input tax credit on business expenses.",
      ],
      note: "This guide is educational, not tax advice. Consult a CA for registration and filing decisions.",
    },
    {
      id: "invoice-fields",
      heading: "Fields to include on a GST invoice",
      list: [
        "Your name or business name and address",
        "GSTIN (15-character GST identification number)",
        "Invoice number and date",
        "Client name, address, and GSTIN if they are registered",
        "Place of supply and state code",
        "HSN or SAC code for the service",
        "Taxable value, GST rate, and tax amount (CGST/SGST or IGST)",
        "Total invoice value in words and figures",
        "Signature or digital signature where required",
      ],
      paragraphs: [
        "Unregistered freelancers below the threshold issue a bill of supply or invoice per current rules rather than a full tax invoice. Your CA can confirm which document applies.",
      ],
    },
    {
      id: "intra-vs-inter",
      heading: "CGST + SGST vs IGST",
      paragraphs: [
        "When you and your client are in the same state, intra-state supplies typically split tax into CGST and SGST. When the client is in another state, IGST usually applies on inter-state supplies.",
        "Your invoice should show the correct split so the client's accounts team can claim input tax credit. Invoice tools that support Indian GST supply types reduce manual calculation errors.",
      ],
    },
    {
      id: "international-clients",
      heading: "Billing international clients from India",
      paragraphs: [
        "Exports of services often have specific GST treatment, including zero-rated supplies in qualifying cases with LUT/bond arrangements. Documentation and contracts should support the export of services.",
        "Include payment details clients abroad can use (SWIFT, Wise, PayPal) alongside any domestic UPI or bank fields you use for Indian clients.",
      ],
      list: [
        "Confirm export treatment with your CA before quoting zero tax to foreign clients",
        "Keep FIRC or payment proof for export proceeds",
        "Issue invoices in the currency agreed with the client",
        "Maintain separate numbering series if your CA recommends it",
      ],
    },
    {
      id: "upi-and-payment",
      heading: "UPI and payment details on Indian invoices",
      paragraphs: [
        "Domestic clients often pay via UPI or NEFT. Listing your UPI ID and bank details on the invoice speeds up payment. A QR code on the invoice preview helps mobile payers.",
        "Always match the invoice total to the UPI amount when you share a payment link or QR to avoid partial payments.",
      ],
    },
    {
      id: "record-keeping",
      heading: "Filing and record keeping",
      list: [
        "File GSTR-1 and GSTR-3B (or applicable returns) on schedule",
        "Reconcile invoices issued with payments received each month",
        "Store PDF invoices for at least the statutory retention period",
        "Track reverse charge supplies if you purchase services from overseas platforms",
      ],
      paragraphs: [
        "Clean invoice records make GST filing a data export exercise instead of a forensic search through email.",
      ],
    },
  ],
};
