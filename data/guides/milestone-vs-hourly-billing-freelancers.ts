import type { GuideArticle } from "./types";

export const milestoneVsHourlyBillingFreelancers: GuideArticle = {
  slug: "milestone-vs-hourly-billing-freelancers",
  title: "Milestone vs Hourly Billing for Freelancers: Which Model to Use",
  description:
    "Compare milestone billing and hourly billing for freelancers — when each model fits, how to structure invoices, and hybrid approaches for deposits and change requests.",
  keywords: [
    "milestone billing freelancer",
    "hourly billing freelancer",
    "freelance billing model",
    "project milestone invoice",
    "freelancer hourly rate invoice",
  ],
  category: "Invoicing & Billing",
  pillar: "invoicing-billing",
  publishedAt: "2026-06-10",
  readingTimeMinutes: 8,
  sections: [
    {
      id: "overview",
      heading: "Two billing models, one goal: predictable income",
      paragraphs: [
        "Milestone billing ties payment to defined deliverables. Hourly billing ties payment to time spent. The right choice depends on scope clarity, client type, and how much risk you are willing to absorb.",
      ],
    },
    {
      id: "milestone-billing",
      heading: "Milestone billing: best for fixed-scope projects",
      paragraphs: [
        "Milestone billing works when deliverables, timelines, and acceptance criteria are clear before work starts. You invoice when each phase is approved — not when hours accumulate.",
      ],
      list: [
        "Website redesign: 30% kickoff, 40% design approval, 30% launch",
        "Brand identity: 50% concepts, 50% final files",
        "Development sprint: invoice per completed sprint or feature set",
        "Consulting engagement: invoice per completed workshop or report",
      ],
      note: "Always define what \"approval\" means in writing to avoid disputes at invoice time.",
    },
    {
      id: "hourly-billing",
      heading: "Hourly billing: best for ongoing or undefined scope",
      paragraphs: [
        "Hourly billing protects you when scope is fluid, clients request frequent changes, or work is advisory and open-ended. You invoice for actual time with detailed timesheets or line items.",
      ],
      list: [
        "Retainer support and maintenance",
        "Early-stage strategy where scope is still forming",
        "Staff augmentation embedded in a client team",
        "Emergency or rush work outside the original agreement",
      ],
    },
    {
      id: "comparison",
      heading: "Milestone vs hourly: quick comparison",
      list: [
        "Cash flow predictability: Milestone wins for fixed projects",
        "Scope risk: Hourly shifts scope risk to the client",
        "Client preference: Corporates often prefer milestones; startups may prefer hourly",
        "Invoice complexity: Milestones need phase descriptions; hourly needs time logs",
        "Pricing transparency: Milestones show total project value upfront",
      ],
    },
    {
      id: "hybrid",
      heading: "The hybrid model most freelancers use",
      paragraphs: [
        "Many experienced freelancers combine both: a fixed-price milestone contract for the core project, plus an hourly rate for change requests billed separately.",
        "State the hourly rate for out-of-scope work in your contract. When a change request arrives, quote hours before starting and invoice on a Net 7 cycle.",
      ],
    },
    {
      id: "invoicing",
      heading: "How to invoice each model",
      list: [
        "Milestone invoice: label the phase, reference the contract, attach deliverable proof",
        "Hourly invoice: itemize dates, hours, and task descriptions per line",
        "Both: show subtotal, taxes if applicable, due date, and payment terms",
        "Both: send the invoice the day the milestone is approved or the billing period ends",
      ],
    },
  ],
};
