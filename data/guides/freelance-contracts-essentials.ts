import type { GuideArticle } from "./types";

export const freelanceContractsEssentials: GuideArticle = {
  slug: "freelance-contracts-essentials",
  title: "Freelance Contracts: Essential Clauses Every Freelancer Needs",
  description:
    "A practical guide to freelance contract essentials - scope, payment terms, IP ownership, revisions, confidentiality, and termination before you send the first invoice.",
  keywords: [
    "freelance contract",
    "freelancer contract template",
    "freelance agreement clauses",
    "independent contractor contract",
    "freelance contract essentials",
  ],
  category: "Client Management",
  pillar: "client-management",
  publishedAt: "2026-06-10",
  readingTimeMinutes: 10,
  sections: [
    {
      id: "why-contracts",
      heading: "Why a contract comes before the invoice",
      paragraphs: [
        "An invoice requests payment for agreed work. A contract defines what was agreed. Without a contract, disputes over scope, revisions, and payment timing become he-said-she-said - and invoices become harder to enforce.",
        "A one-page freelance agreement is enough for most projects. What matters is that both parties sign before work begins.",
      ],
    },
    {
      id: "scope",
      heading: "Scope of work",
      paragraphs: [
        "Define deliverables with specificity. \"Website design\" is vague; \"Homepage and 3 inner page mockups in Figma, desktop and mobile\" is enforceable.",
      ],
      list: [
        "List every deliverable with format and quantity",
        "State what is explicitly excluded",
        "Define the revision policy (see below)",
        "Include a timeline with client feedback deadlines",
      ],
    },
    {
      id: "payment",
      heading: "Payment terms",
      list: [
        "Total fee or hourly rate with estimated hours",
        "Deposit percentage and when it is due",
        "Milestone schedule or billing cycle",
        "Payment methods accepted (bank transfer, UPI, Wise, PayPal)",
        "Late payment fees and work-pause triggers",
        "Currency for international clients",
      ],
    },
    {
      id: "ip",
      heading: "Intellectual property ownership",
      paragraphs: [
        "Default rule: you own the work until the client pays in full. After final payment, IP transfers to the client unless you retain portfolio rights.",
        "For stock assets, fonts, and third-party licenses, clarify who pays and who holds the license.",
      ],
    },
    {
      id: "revisions",
      heading: "Revisions and change requests",
      paragraphs: [
        "Include a fixed number of revision rounds (for example, two rounds of feedback per deliverable). Additional revisions are billed at your hourly rate or a flat change-order fee.",
        "This clause is your primary defense against scope creep.",
      ],
    },
    {
      id: "termination",
      heading: "Termination and kill fees",
      list: [
        "Either party may terminate with written notice (typically 14 days)",
        "Client pays for all work completed to date plus non-refundable deposit",
        "Kill fee if client cancels after work has started (for example, 25% of remaining balance)",
        "You deliver work-in-progress files upon payment of amounts due",
      ],
    },
    {
      id: "other",
      heading: "Other clauses worth including",
      list: [
        "Confidentiality / NDA for sensitive client data",
        "Independent contractor status (not employee)",
        "Liability cap limited to fees paid",
        "Governing law and dispute resolution",
        "Portfolio rights to display work after launch",
      ],
      note: "This article is educational, not legal advice. Have a lawyer review contracts for high-value or complex engagements.",
    },
  ],
};
