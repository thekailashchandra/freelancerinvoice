import type { GuideArticle } from "./types";

export const clientDisputesBillableHours: GuideArticle = {
  slug: "client-disputes-billable-hours",
  title: "How to Handle Client Disputes Over Billable Tracked Hours",
  description:
    "Resolve freelancer billing disputes over tracked hours - documentation, de-escalation scripts, contract clauses, and how to get hourly invoices approved.",
  keywords: [
    "billable hours dispute freelancer",
    "client disputes invoice hours",
    "freelancer time tracking dispute",
    "hourly billing dispute",
    "tracked hours client disagreement",
  ],
  category: "Invoicing & Billing",
  pillar: "invoicing-billing",
  hubClusterId: "freelance-invoicing-getting-paid",
  publishedAt: "2026-06-11",
  readingTimeMinutes: 8,
  coreBlock: {
    id: "dispute-resolution-steps",
    heading: "Billable hours dispute resolution workflow",
    steps: [
      {
        title: "Pull the contract and scope document",
        description:
          "Identify the agreed hourly rate, billable vs non-billable rules, and approval requirements.",
      },
      {
        title: "Export task-level timesheets",
        description:
          "Show date, task description, duration, and any client approvals for each line item.",
      },
      {
        title: "Schedule a 15-minute review call",
        description:
          "Walk through disputed entries calmly - assume miscommunication, not fraud.",
      },
      {
        title: "Offer a good-faith adjustment if warranted",
        description:
          "Remove clearly non-billable time (internal meetings, rework from your error) to preserve the relationship.",
      },
      {
        title: "Reissue the invoice with references",
        description:
          "Link each line item to a task ID or change-order number so accounts payable can approve faster.",
      },
    ],
  },
  sections: [
    {
      id: "why-disputes-happen",
      heading: "Why clients dispute billable hours",
      paragraphs: [
        "Hour disputes usually stem from mismatched expectations - not dishonesty. The client expected a fixed price; you billed hourly. They did not realize how long tasks take. They question time spent in meetings or revisions.",
        "Prevention is cheaper than resolution. Define billable vs non-billable time in your contract before the first hour is logged.",
      ],
    },
    {
      id: "contract-clauses",
      heading: "Contract clauses that prevent disputes",
      list: [
        "Hourly rate and minimum billing increment (e.g. 15-minute blocks)",
        "What counts as billable: client calls, revisions, research, admin",
        "What is non-billable: your learning curve, internal errors, scope not approved",
        "Estimate cap: \"Work beyond 40 hours requires written approval\"",
        "Timesheet sharing: weekly summary sent every Friday for review",
        "Dispute window: client must raise issues within 7 days of timesheet",
      ],
    },
    {
      id: "documentation",
      heading: "Documentation that wins disputes",
      list: [
        "Time entries with task descriptions, not just \"work\" or \"dev\"",
        "Links to deliverables produced during logged time",
        "Email or Slack approval for out-of-scope tasks before logging",
        "Meeting notes showing client attendance and decisions made",
        "Weekly timesheet summaries sent proactively - silence = acceptance",
      ],
      paragraphs: [
        "A timesheet that says \"2.5 hrs - homepage layout revisions per March 12 feedback email\" is defensible. \"2.5 hrs - design\" is not.",
      ],
    },
    {
      id: "de-escalation",
      heading: "How to de-escalate when a dispute arises",
      paragraphs: [
        "Step 1: Acknowledge calmly. \"I understand the total is higher than expected. Let me walk you through the breakdown.\"",
        "Step 2: Share the detailed timesheet with task-level notes.",
        "Step 3: Reference the contract and any approvals for extra work.",
        "Step 4: Offer a good-faith adjustment only if you genuinely over-billed - not to appease unreasonable clients.",
        "Step 5: Propose a fixed-price phase for future work if hourly friction persists.",
      ],
    },
    {
      id: "scripts",
      heading: "Response scripts",
      paragraphs: [
        "\"I've attached a detailed breakdown of the [X] hours. Each entry maps to a task we discussed in [meeting/email date]. Happy to review any specific line item you're questioning.\"",
        "",
        "\"The additional [X] hours were for [specific change request] approved on [date] via [channel]. I can forward that thread if helpful.\"",
        "",
        "\"Going forward, I can send weekly timesheet previews so we catch any concerns before the final invoice. Would that work for you?\"",
      ],
    },
    {
      id: "invoice-format",
      heading: "Invoice format for hourly work",
      list: [
        "Group hours by week or project phase",
        "Show rate × hours = amount per line",
        "Attach or link to the full timesheet as backup",
        "Note the contract reference and approved estimate",
        "Separate disputed hours from undisputed hours if negotiating",
      ],
    },
    {
      id: "when-to-walk",
      heading: "When to stand firm vs compromise",
      paragraphs: [
        "Stand firm when hours were contractually billable, documented, and approved. Compromise when you genuinely exceeded estimates without warning the client - a one-time goodwill credit builds trust.",
        "Chronic disputants are a client problem. After two disputes, switch to fixed-price milestones or end the engagement.",
      ],
    },
  ],
};
