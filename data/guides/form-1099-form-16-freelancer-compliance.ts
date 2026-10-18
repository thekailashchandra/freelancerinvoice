import type { GuideArticle } from "./types";

export const form1099Form16FreelancerCompliance: GuideArticle = {
  slug: "form-1099-form-16-freelancer-compliance",
  title: "1099 and Form 16A Compliance for Freelancers: US and India Guide",
  description:
    "What freelancers need to know about US Form 1099-NEC and Indian TDS Form 16A - reporting requirements, client obligations, and records to keep for tax compliance.",
  keywords: [
    "1099 freelancer",
    "1099-NEC freelancer",
    "Form 16A freelancer India",
    "TDS freelancer India",
    "freelance tax compliance US India",
  ],
  category: "Tax & Compliance",
  pillar: "tax-compliance-currency",
  publishedAt: "2026-06-10",
  readingTimeMinutes: 10,
  sections: [
    {
      id: "overview",
      heading: "Two countries, two compliance systems",
      paragraphs: [
        "US clients report payments to freelancers via Form 1099-NEC. Indian clients deduct tax at source (TDS) and issue Form 16A. If you work internationally, you may deal with both - plus your own country's income tax filing.",
        "Understanding these forms before tax season prevents surprises and missing deductions.",
      ],
    },
    {
      id: "1099-nec",
      heading: "US Form 1099-NEC for freelancers",
      paragraphs: [
        "US businesses must issue Form 1099-NEC to non-employees paid $600 or more in a calendar year for services. Copy goes to the IRS and to you.",
      ],
      list: [
        "You must provide a W-9 (US persons) or W-8BEN (non-US persons) before payment",
        "Report 1099 income on your US tax return even if you never receive the form",
        "Keep copies of all 1099s received - they must match your reported income",
        "Deductions (home office, software, equipment) offset 1099 income on Schedule C",
        "Quarterly estimated taxes may be required if no withholding applies",
      ],
    },
    {
      id: "form-16a",
      heading: "Indian Form 16A and TDS (Section 194J)",
      paragraphs: [
        "When an Indian client pays a freelancer for professional or technical services, they may deduct TDS at 10% under Section 194J (rates subject to change - verify current law).",
        "Form 16A is the certificate proving tax was deducted. You need it to claim credit when filing your income tax return.",
      ],
      list: [
        "Request Form 16A quarterly from each client who deducts TDS",
        "Verify your PAN, TDS amount, and challan details on the certificate",
        "Claim TDS credit in your ITR - mismatches trigger notices",
        "If a client did not deduct TDS when required, you still owe the tax",
        "GST registration is separate from TDS - see our GST invoicing guides",
      ],
    },
    {
      id: "records",
      heading: "Records to keep for compliance",
      list: [
        "All invoices issued (with dates, amounts, and client details)",
        "Payment receipts and bank statements",
        "1099 forms received (US)",
        "Form 16A certificates (India)",
        "FIRC for foreign inward remittances (Indian freelancers)",
        "Expense receipts for deductible business costs",
        "Contracts showing payment terms and scope",
      ],
    },
    {
      id: "cross-border",
      heading: "Working with both US and Indian clients",
      paragraphs: [
        "Indian freelancers billing US clients typically receive USD via wire or Wise. US clients usually do not issue Indian Form 16A - they may issue 1099 if you are a US tax person, or no form if you are a foreign contractor.",
        "You still report foreign income in India. The Double Taxation Avoidance Agreement (DTAA) may provide relief - consult a chartered accountant.",
      ],
      note: "Tax law changes frequently. This guide is educational. Work with a qualified CA or CPA for your specific situation.",
    },
    {
      id: "tooling",
      heading: "Use your invoice system as a compliance backbone",
      list: [
        "Issue numbered invoices for every payment request",
        "Store client legal names and tax IDs where applicable",
        "Track paid vs pending to reconcile against 1099 and 16A",
        "Export PDF records annually for your accountant",
        "Separate domestic and international client folders",
      ],
    },
  ],
};
