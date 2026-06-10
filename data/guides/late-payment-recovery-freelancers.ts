import type { GuideArticle } from "./types";

export const latePaymentRecoveryFreelancers: GuideArticle = {
  slug: "late-payment-recovery-freelancers",
  title: "Late Payment Recovery for Freelancers: A Step-by-Step Playbook",
  description:
    "How to recover overdue freelance invoices — reminder sequences, late fee enforcement, when to pause work, and escalation without damaging client relationships.",
  keywords: [
    "late payment recovery freelancer",
    "overdue invoice freelancer",
    "chase unpaid invoice",
    "freelancer late payment",
    "invoice collection freelancer",
  ],
  category: "Invoicing & Billing",
  pillar: "invoicing-billing",
  publishedAt: "2026-06-10",
  readingTimeMinutes: 9,
  sections: [
    {
      id: "why-late-payments-happen",
      heading: "Why freelance invoices go unpaid",
      paragraphs: [
        "Late payments are rarely personal. Accounts payable runs on its own schedule, invoices get lost in approval chains, and clients sometimes treat freelancers as lowest priority in the payment queue.",
        "Recovery starts with systems — clear terms upfront, professional invoices with visible due dates, and a documented follow-up sequence you run every time.",
      ],
    },
    {
      id: "prevention",
      heading: "Prevent late payments before they start",
      list: [
        "State payment terms in your contract and repeat them on every invoice",
        "Use Net 14 instead of Net 30 when cash flow is tight",
        "Require deposits on new clients and large projects",
        "Send invoices the same day work is delivered or approved",
        "Include a bold due date and payment instructions near the total",
        "Track invoice status (sent, viewed, overdue) in your billing tool",
      ],
    },
    {
      id: "reminder-sequence",
      heading: "The 7-touch reminder sequence",
      paragraphs: [
        "Run the same sequence for every overdue invoice. Consistency signals professionalism and makes recovery predictable.",
      ],
      list: [
        "Day −3: Friendly heads-up that payment is due soon",
        "Day 0: Due date reminder with invoice PDF attached",
        "Day +3: Polite overdue notice — ask if there are blockers",
        "Day +7: Firmer follow-up referencing contract terms",
        "Day +14: Final notice before late fees or work pause",
        "Day +21: Escalate to the client's finance lead or sponsor",
        "Day +30+: Collections, mediation, or legal per your contract",
      ],
    },
    {
      id: "late-fees",
      heading: "Enforcing late fees",
      paragraphs: [
        "Late fees only work if clients agreed to them before work began. Include a clause in your contract (for example, 1.5% per month on balances overdue by 14+ days) and reference it in invoice notes.",
        "When applying a late fee, send a revised invoice or a separate line item clearly labeled \"Late payment fee per contract Section X.\"",
      ],
      note: "Late fee enforceability varies by country and client type. Consult a lawyer for wording that fits your jurisdiction.",
    },
    {
      id: "pause-work",
      heading: "When to pause work",
      paragraphs: [
        "Your contract should state that overdue payments trigger a work pause. Pausing is often more effective than endless email reminders because it affects the client's timeline.",
        "Notify the client in writing before pausing. Resume only when payment clears or a written payment plan is agreed.",
      ],
    },
    {
      id: "documentation",
      heading: "Document everything for recovery",
      list: [
        "Signed contract with payment and late-fee terms",
        "Original invoice with sent date and due date",
        "Email thread showing deliverable approval",
        "Reminder emails with dates and recipients",
        "Bank records showing non-payment",
      ],
      paragraphs: [
        "This paper trail supports small-claims court, collections agencies, or platform disputes if escalation becomes necessary.",
      ],
    },
  ],
};
