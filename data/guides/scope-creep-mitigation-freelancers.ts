import type { GuideArticle } from "./types";

export const scopeCreepMitigationFreelancers: GuideArticle = {
  slug: "scope-creep-mitigation-freelancers",
  title: "Scope Creep Mitigation for Freelancers: Protect Your Time and Revenue",
  description:
    "How freelancers prevent and bill for scope creep — defining boundaries, change request workflows, and invoicing out-of-scope work professionally.",
  keywords: [
    "scope creep freelancer",
    "freelance scope management",
    "out of scope work freelancer",
    "freelancer change request",
    "scope creep billing",
  ],
  category: "Client Management",
  pillar: "client-management",
  publishedAt: "2026-06-10",
  readingTimeMinutes: 8,
  sections: [
    {
      id: "what-is-scope-creep",
      heading: "What scope creep looks like in freelance work",
      paragraphs: [
        "Scope creep is unpaid or unbilled work that grows beyond the original agreement — extra pages, additional features, more revision rounds, or \"quick favors\" that accumulate into hours of labor.",
        "It usually starts innocently: \"Can you also…\" or \"While you're at it…\" Without a process, you absorb the cost and train the client to expect free extras.",
      ],
    },
    {
      id: "define-scope",
      heading: "Define scope before work starts",
      list: [
        "Write deliverables as a checklist in the contract",
        "List explicit exclusions (\"Does not include copywriting, SEO, or ongoing maintenance\")",
        "Cap revision rounds (two rounds per deliverable is standard)",
        "Set a feedback window (client must respond within 5 business days)",
        "Name your hourly rate for out-of-scope requests upfront",
      ],
    },
    {
      id: "change-request",
      heading: "The change request workflow",
      paragraphs: [
        "When a client asks for something outside scope, do not start work immediately. Run a simple change request process every time.",
      ],
      list: [
        "Acknowledge the request: \"Happy to add this — it is outside our current scope.\"",
        "Estimate hours or a fixed fee for the addition",
        "Send a written quote or change order for client approval",
        "Invoice separately or add a line item to the next milestone",
        "Only begin work after written approval",
      ],
    },
    {
      id: "scripts",
      heading: "Scripts for common scope creep situations",
      paragraphs: [
        "\"That is a great idea and falls outside our current agreement. I can add it for [X hours at $Y/hour]. Want me to send a change order?\"",
        "\"I have included two revision rounds in this phase. Additional rounds are billed at $Z/hour — shall I send an updated invoice?\"",
        "\"Happy to help with that in a separate engagement. Here is a quick quote.\"",
      ],
    },
    {
      id: "invoicing",
      heading: "Invoicing scope creep professionally",
      list: [
        "Label line items clearly: \"Additional homepage section (out of scope, CR-003)\"",
        "Reference the change request date and approval email in invoice notes",
        "Use a separate invoice for large additions to keep milestone invoices clean",
        "Track change requests in your project management tool or spreadsheet",
      ],
    },
    {
      id: "when-to-walk",
      heading: "When to push back or walk away",
      paragraphs: [
        "If a client repeatedly refuses to approve change orders but keeps requesting extras, that is a relationship problem — not a scope problem. Document the pattern, enforce your contract, and consider ending the engagement professionally.",
        "Protecting your scope protects every future invoice.",
      ],
    },
  ],
};
