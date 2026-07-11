/**
 * Direct-to-answer summaries for informational content (GEO).
 * Each entry is exactly two sentences — optimized for AI Overview extraction.
 */
export const geoDirectAnswers: Record<string, string> = {
  "ultimate-guide-freelance-invoicing-getting-paid":
    "Freelance invoicing is the process of billing clients with a professional document that lists deliverables, payment terms, and a due date. Getting paid on time requires clear contracts, visible due dates on every invoice, deposit requirements for new clients, and a consistent overdue follow-up sequence.",
  "overdue-invoice-email-templates":
    "An overdue invoice email is a written follow-up that references the invoice number, amount, and due date when payment has not arrived. Polite but firm templates escalate tone over 2–3 weeks — from friendly reminders to final notices with late-fee references.",
  "net-30-vs-net-60-payment-terms":
    "Net 30 means payment is due 30 days after the invoice date; Net 60 means 60 days. Independent creators should prefer Net 14 or Net 30 with a deposit — Net 60 doubles cash-flow risk unless compensated with higher rates or milestone payments.",
  "legally-required-freelance-invoice-information":
    "A legally sufficient freelance invoice identifies the seller and buyer, includes a unique invoice number and dates, and itemizes services with a total amount due. Required fields vary by country — the US, UK, EU, and India each add tax IDs, VAT, or GST elements when applicable.",
  "client-disputes-billable-hours":
    "A billable hours dispute occurs when a client questions time logged on an hourly invoice. Resolve it with contract-defined billable rules, task-level timesheets, written approvals for extra work, and invoice line items that reference change-order IDs.",
  "how-to-bill-client-revision-rounds-outside-scope":
    "Revision rounds outside scope are billable when your contract limits included rounds and the client requests additional feedback batches. Quote the extra round before starting work, get written approval, then invoice with a clear line item referencing the change order.",
  "late-payment-recovery-freelancers":
    "Late payment recovery is the structured process of chasing overdue freelance invoices through reminders, late fees, and work pauses. Run the same 7-touch sequence every time — pre-due reminder, due-date notice, and escalating follow-ups through day 30.",
  "milestone-vs-hourly-billing-freelancers":
    "Milestone billing ties payment to approved deliverables; hourly billing ties payment to time spent. Use milestones for fixed-scope projects and hourly rates for fluid or ongoing work — most freelancers combine both with hourly change orders.",
  "freelance-contracts-essentials":
    "A freelance contract is a signed agreement that defines scope, payment terms, revisions, IP ownership, and termination before work begins. Essential clauses include deliverable lists, deposit schedules, late-fee policies, and the number of included revision rounds.",
  "scope-creep-mitigation-freelancers":
    "Scope creep is unpaid work that grows beyond the original agreement — extra pages, features, or revision rounds. Mitigate it with written scope definitions, capped revision rounds, and a change-request workflow that requires approval before out-of-scope work starts.",
  "cross-border-wire-fees-freelancers":
    "Cross-border wire fees are bank and intermediary charges deducted when international clients pay freelancers via SWIFT. Wise and PayPal often cost less than traditional wires — build a 3–5% buffer into international rates or specify that clients pay transfer fees.",
  "form-1099-form-16-freelancer-compliance":
    "US clients issue Form 1099-NEC when they pay non-employees $600+ per year; Indian clients issue Form 16A when they deduct TDS under Section 194J. Freelancers must report all income and keep invoices, payment records, and tax certificates for filing.",
  "how-to-bill-international-clients":
    "Billing international clients requires agreeing on currency, payment method, and who pays transfer fees before work starts. Invoice in USD for US clients, include SWIFT or Wise details, and keep FIRC records if you are an Indian freelancer receiving foreign remittance.",
  "freelance-tax-requirements":
    "Freelance tax requirements depend on your country of tax residence — income must be reported even when clients do not withhold tax. Keep copies of every invoice, expense receipt, and tax certificate (1099, Form 16A) for annual filing.",
  "freelancer-invoice-checklist":
    "A freelancer invoice checklist ensures every bill includes business and client details, line items, payment terms, and a due date. Missing any element slows accounts payable and increases the risk of late payment.",
  "payment-terms-for-freelancers":
    "Payment terms define when invoice balances are due — common options are due on receipt, Net 14, and Net 30. Freelancers should state terms in the contract, repeat them on every invoice, and require deposits from new clients.",
  "gst-invoicing-india-freelancers":
    "GST invoicing in India requires GST-registered freelancers to issue tax invoices with GSTIN, SAC codes, and CGST/SGST or IGST breakdowns. Export services to foreign clients may be zero-rated when LUT conditions are met — consult a chartered accountant for your status.",
  "printable-graphic-designer-invoice-layout-logo-upload":
    "A printable graphic designer invoice layout is a PDF-ready bill formatted for A4 or US Letter with your logo, line items, and payment details. Upload your logo once and export branded invoices clients can print or forward to accounts payable.",
  "invoice-template-for-developers":
    "A developer invoice template itemizes hourly, sprint, or milestone work with technical deliverable descriptions. It helps engineering and finance stakeholders approve payment without back-and-forth over vague line items.",
  "free-dynamic-invoice-generator-for-developers-no-signup":
    "A dynamic invoice generator for developers updates the invoice preview live as you edit line items, rates, and notes. Invoice for Freelance lets developers explore the builder free and sign up only when saving PDFs to cloud history.",
  "freelance-contractor-invoice-format-inr-us-clients":
    "Indian contractors billing US clients typically invoice in USD with export or LUT notes, SAC codes, and international payment instructions. The invoice format must show currency, service description, and SWIFT or Wise details for cross-border settlement.",
  "gst-compliant-invoice-template-independent-contractors-india":
    "A GST-compliant contractor invoice in India includes GSTIN, SAC code, taxable value, and CGST/SGST or IGST lines on every bill. Independent contractors must also document TDS under Section 194J when clients deduct tax at source.",
  "global-freelance-invoicing-compliance":
    "Global freelance invoicing compliance means matching each invoice to local rules — US routing numbers, EU IBAN, UK sort codes, and correct tax withholding references. Currency should default to the client's settlement region: USD, EUR, or GBP.",
  "invoice-for-freelance":
    "An invoice for freelance work is the bill you send after completing client deliverables — it lists services, amounts, due dates, and payment instructions. Invoice for Freelance lets you generate that invoice online with live preview and free PDF export instead of wrestling with Word or Excel templates.",
  "invoice-for-freelance-us":
    "US freelancers generate invoices with USD totals, routing and account numbers, and clear Net payment terms for corporate AP teams. Invoice for Freelance defaults to US payment fields and exports print-ready PDFs for 1099 contractors and consultants.",
  "invoice-for-freelance-uk":
    "UK freelancers invoice with GBP amounts, sort codes, optional IBAN, and VAT labels when registered. Invoice for Freelance formats bills the way British sole traders and limited-company contractors need for domestic and international clients.",
};

/** Returns the GEO direct-answer block for an article slug, if defined. */
export function getGeoDirectAnswer(slug: string): string | undefined {
  return geoDirectAnswers[slug];
}

/** Resolves direct answer from article field or central GEO map. */
export function resolveArticleDirectAnswer(article: {
  slug: string;
  directAnswer?: string;
  description: string;
}): string {
  return (
    article.directAnswer ??
    geoDirectAnswers[article.slug] ??
    article.description
  );
}
