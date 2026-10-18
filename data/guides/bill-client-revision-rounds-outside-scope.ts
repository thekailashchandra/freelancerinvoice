import type { GuideArticle } from "./types";

export const billClientRevisionRoundsOutsideScope: GuideArticle = {
  slug: "how-to-bill-client-revision-rounds-outside-scope",
  title: "How to Bill a Client for Revision Rounds Outside Scope",
  description:
    "Step-by-step guide for freelancers billing extra revision rounds - contract language, change orders, invoice line items, and email scripts when clients ask for work beyond agreed rounds.",
  keywords: [
    "how to bill a client for revision rounds outside scope",
    "extra revisions invoice freelancer",
    "billable revision rounds",
    "out of scope revisions billing",
    "freelance revision invoice",
  ],
  category: "Client Management",
  pillar: "client-management",
  hubClusterId: "freelance-invoicing-getting-paid",
  publishedAt: "2026-06-12",
  readingTimeMinutes: 9,
  coreBlock: {
    id: "revision-billing-workflow",
    heading: "How to bill out-of-scope revision rounds",
    steps: [
      {
        title: "Confirm the request exceeds included rounds",
        description:
          "Reference the contract clause that caps revision rounds per deliverable.",
      },
      {
        title: "Quote the extra round before starting work",
        description:
          "Send hourly or flat-fee estimate with expected turnaround time.",
      },
      {
        title: "Get written approval (email is sufficient)",
        description:
          "Save the approval - it becomes your change-order documentation.",
      },
      {
        title: "Complete the revision round",
        description:
          "Track time if billing hourly; note deliverable version in your project log.",
      },
      {
        title: "Invoice with a dedicated line item",
        description:
          'Label it "Additional revision round - [Project], Change Order #[N]" with the approved amount.',
      },
    ],
  },
  contentUpgrade: {
    title: "Revision billing template pack",
    description:
      "Copy-paste contract clause, change-order email, and invoice line items for out-of-scope revision rounds.",
    items: [
      "── CONTRACT CLAUSE ──",
      "Revisions: [2] rounds of consolidated feedback per deliverable are included.",
      "Additional revision rounds or material scope changes are billed at [USD $X/hour]",
      "or [flat fee per round] and require written approval before work begins.",
      "",
      "── CHANGE ORDER EMAIL ──",
      "Subject: Change order - additional revision round, [Project name]",
      "",
      "Hi [Name],",
      "Happy to do another revision round. Per our agreement, rounds beyond [2]",
      "are billed at [$X/hour | $Y flat]. This round is estimated at [Z] hours = [$Total].",
      "Reply to approve and I'll add it to the next invoice.",
      "",
      "── INVOICE LINE ITEMS ──",
      "Additional revision round - Homepage v3 feedback (CR-004) | 4 hrs × $95 | $380",
      "Out-of-scope layout changes per email 12 Jun (CR-005) | 2 hrs × $95 | $190",
      "",
      "Notes: Original scope included 2 revision rounds per SOW dated [date].",
      "CR-004 and CR-005 approved via email [dates].",
    ],
    ctaLabel: "Create revision invoice free",
    ctaHref: "/signup",
  },
  sections: [
    {
      id: "problem",
      heading: "The revision round problem",
      paragraphs: [
        "Clients often treat revisions as unlimited. Designers, developers, and writers absorb extra rounds because saying no feels awkward - then wonder why the project was unprofitable.",
        "Revision rounds outside scope are billable work. The fix is contractual clarity plus a simple billing process you run every time.",
      ],
    },
    {
      id: "define-rounds",
      heading: "Define what counts as a revision round",
      paragraphs: [
        "A revision round is one batch of consolidated feedback applied to a deliverable - not every Slack message or email.",
      ],
      list: [
        "Round 1: client submits all feedback in one document or call",
        "You implement and deliver updated files",
        "Round 2: second consolidated feedback batch (if included)",
        "New requests after sign-off start a new round or change order",
        "Scope additions (new pages, features, assets) are never \"revisions\"",
      ],
    },
    {
      id: "contract",
      heading: "Contract language before work starts",
      list: [
        "Number of included revision rounds per deliverable",
        "Hourly or flat fee for additional rounds",
        "Requirement for consolidated feedback (not drip requests)",
        "48-hour client feedback window or work is deemed approved",
        "Written approval before out-of-scope work begins",
      ],
      note: "Use the free template pack above for copy-paste contract and email wording.",
    },
    {
      id: "billing-process",
      heading: "How to bill extra revision rounds",
      paragraphs: [
        "Step 1: Client requests another round. Acknowledge and quote - do not start work.",
        "Step 2: Send a one-line change order email with hours or flat fee.",
        "Step 3: Get written approval (email reply is enough).",
        "Step 4: Complete the work.",
        "Step 5: Invoice with a clear line item referencing the change order ID.",
      ],
    },
    {
      id: "invoice-line-items",
      heading: "Invoice line items for revision billing",
      list: [
        "Label: \"Additional revision round - [deliverable] (CR-00X)\"",
        "Show hours × rate OR flat fee per round",
        "Reference change order date and approval email in notes",
        "Separate from the original milestone invoice when possible",
        "Never bury revision fees inside a vague \"design work\" line",
      ],
    },
    {
      id: "scripts",
      heading: "Scripts when clients push back",
      paragraphs: [
        "\"Our agreement includes two revision rounds - we're now on round four. I can absolutely keep going; rounds three and four are [$X] as quoted in my email on [date].\"",
        "",
        "\"I want this to stay fair for both of us. Extra rounds are billed at my standard rate so I can prioritize your project properly.\"",
      ],
    },
    {
      id: "prevention",
      heading: "Prevent revision disputes proactively",
      list: [
        "Send deliverables with \"included rounds remaining\" in the handoff email",
        "Require consolidated feedback in a single Figma comment pass or doc",
        "Charge deposits so clients have skin in the game",
        "Use milestone billing - revisions on locked milestones cost extra",
        "Link to your scope creep guide for larger additions",
      ],
    },
  ],
};
