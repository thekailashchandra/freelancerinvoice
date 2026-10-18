import type { GuideArticle } from "./types";

export const net30VsNet60PaymentTerms: GuideArticle = {
  slug: "net-30-vs-net-60-payment-terms",
  title: "Net 30 vs Net 60 Payment Terms: Which Is Best for Independent Creators?",
  description:
    "Compare Net 30 and Net 60 payment terms for freelancers and independent creators - cash flow impact, client expectations, and when to negotiate shorter terms.",
  keywords: [
    "net 30 vs net 60",
    "net 30 payment terms freelancer",
    "net 60 freelancer",
    "payment terms independent creator",
    "freelance net 30 net 60",
  ],
  category: "Invoicing & Billing",
  pillar: "invoicing-billing",
  hubClusterId: "freelance-invoicing-getting-paid",
  publishedAt: "2026-06-11",
  readingTimeMinutes: 7,
  coreBlock: {
    id: "payment-terms-comparison",
    heading: "Net 30 vs Net 60: comparison at a glance",
    table: {
      caption: "Net 30 vs Net 60 payment terms for freelancers",
      headers: ["Criterion", "Net 30", "Net 60"],
      rows: [
        ["Days until due", "30 days from invoice date", "60 days from invoice date"],
        ["Cash flow impact", "Moderate - one month wait", "High - two month wait"],
        ["Typical client type", "Mid-size companies, agencies", "Large enterprises, government"],
        ["Freelancer risk", "Manageable with deposit", "High without milestone billing"],
        ["Recommended for creators", "Maximum without deposit", "Avoid unless deposit + milestones"],
        ["Rate adjustment", "Standard rate", "Charge 5–10% more if accepted"],
      ],
    },
  },
  sections: [
    {
      id: "definitions",
      heading: "What Net 30 and Net 60 actually mean",
      paragraphs: [
        "\"Net\" followed by a number is the number of days after the invoice date that payment is due. Net 30 = pay within 30 days. Net 60 = pay within 60 days.",
        "Large corporations often default to Net 30 or Net 60 because their accounts payable cycles run monthly. Independent creators and freelancers feel the cash flow impact immediately.",
      ],
    },
    {
      id: "net-30",
      heading: "Net 30: the corporate standard",
      list: [
        "Most common term at mid-size and large companies",
        "Clients expect it - rarely negotiable at enterprise level",
        "30 days from invoice date, not from project completion",
        "Works if you invoice promptly and have 1–2 months runway",
        "Combine with a deposit to reduce risk on long projects",
      ],
      paragraphs: [
        "If you finish work on March 1 but invoice on March 15, Net 30 means payment is due April 14 - not April 1.",
      ],
    },
    {
      id: "net-60",
      heading: "Net 60: when clients ask for more time",
      list: [
        "Common at large enterprises and government contracts",
        "Doubles your wait compared to Net 30",
        "Can strain solo freelancer cash flow significantly",
        "Sometimes non-negotiable in vendor onboarding portals",
        "Should command higher rates or upfront deposits",
      ],
      paragraphs: [
        "Net 60 means you may wait two full months after invoicing. On a 6-week project, you could wait nearly 4 months from kickoff to payment.",
      ],
    },
    {
      id: "comparison",
      heading: "Net 30 vs Net 60: side-by-side",
      list: [
        "Cash flow speed: Net 30 wins - you get paid a month sooner",
        "Client acceptance: Net 60 is easier at large companies",
        "Risk exposure: Net 60 doubles unpaid-work window",
        "Rate justification: Charge 5–10% more for Net 60 if you accept it",
        "Alternative: Propose Net 30 with 2% early-payment discount",
      ],
    },
    {
      id: "creators",
      heading: "What independent creators should choose",
      paragraphs: [
        "For most independent creators - designers, developers, writers, photographers - Net 30 is the maximum you should accept without a deposit. Net 14 or Due on Receipt is better when you control the relationship.",
        "If a client insists on Net 60, require a 40–50% deposit before work starts and milestone payments at the midpoint. Never carry 60 days of unpaid labor on faith alone.",
      ],
      list: [
        "New clients: deposit + Net 14 or Net 30",
        "Repeat trusted clients: Net 30 is reasonable",
        "Enterprise clients: negotiate Net 30; accept Net 60 only with deposit",
        "Small business / startup clients: Due on receipt or Net 7",
        "Retainer work: bill in advance monthly",
      ],
    },
    {
      id: "on-invoice",
      heading: "How to state terms on your invoice",
      paragraphs: [
        "Write the term explicitly: \"Payment terms: Net 30\" and show the calculated due date. Do not leave it implicit.",
        "Example: Invoice date March 1 → Due date March 31. Bold the due date near the total.",
      ],
    },
  ],
};
