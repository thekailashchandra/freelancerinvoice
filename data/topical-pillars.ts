import type { TemplateFaqItem } from "@/data/template-pages/types";
import { guideArticles } from "@/data/guides";
import { getCanonicalUrl } from "@/data/urls";

export type PillarTopic = {
  slug: string;
  title: string;
  description: string;
  articleSlug: string;
};

export type TopicalPillar = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  keywords: string[];
  topics: PillarTopic[];
  faqItems: TemplateFaqItem[];
  relatedProductLinks: { href: string; label: string }[];
};

export const topicalAuthorityHub = {
  title: "Freelance Finances",
  slug: "freelance-finances",
  description:
    "Expert guides on freelance finances - invoicing and billing operations, client management, tax compliance, and cross-border currency logistics for independent contractors worldwide.",
  keywords: [
    "freelance finances",
    "freelancer financial management",
    "freelance billing operations",
    "freelancer tax compliance",
    "independent contractor finances",
  ],
} as const;

export const topicalPillars: TopicalPillar[] = [
  {
    slug: "invoicing-billing",
    title: "Invoicing & Billing Operations",
    shortTitle: "Invoicing & Billing",
    description:
      "Core monetization and utility - payment terms, milestone vs hourly billing, late payment recovery, and professional invoice workflows that protect cash flow.",
    keywords: [
      "freelance invoicing",
      "freelancer billing operations",
      "late payment recovery",
      "milestone billing freelancer",
      "hourly billing freelancer",
    ],
    topics: [
      {
        slug: "late-payment-recovery",
        title: "Late Payment Recovery",
        description:
          "How to chase overdue invoices, enforce late fees, and recover payment without burning client relationships.",
        articleSlug: "late-payment-recovery-freelancers",
      },
      {
        slug: "milestone-vs-hourly-billing",
        title: "Milestone vs Hourly Billing",
        description:
          "When to bill by milestone, when to bill hourly, and how to structure invoices for each model.",
        articleSlug: "milestone-vs-hourly-billing-freelancers",
      },
    ],
    faqItems: [
      {
        question: "What is the best billing model for freelancers?",
        answer:
          "Milestone billing suits fixed-scope projects; hourly billing suits ongoing or undefined scope. Many freelancers combine both - deposit upfront, milestones for deliverables, hourly for change requests.",
      },
      {
        question: "How do freelancers recover late payments?",
        answer:
          "Send structured reminders before and after the due date, reference contract late-fee clauses, pause work if terms allow, and escalate to a final notice before collections or legal action.",
      },
    ],
    relatedProductLinks: [
      { href: "/invoice-generator-for-freelancers", label: "Invoice generator" },
      { href: "/invoice-templates", label: "Invoice templates" },
      { href: "/features", label: "Product features" },
    ],
  },
  {
    slug: "client-management",
    title: "Client Management & Legal Operations",
    shortTitle: "Client Management",
    description:
      "Friction points that precede invoicing - freelance contracts, scope definitions, and scope creep mitigation that keep projects billable and disputes rare.",
    keywords: [
      "freelance contracts",
      "scope creep freelancer",
      "client management freelancer",
      "freelance legal operations",
      "freelancer scope management",
    ],
    topics: [
      {
        slug: "freelance-contracts",
        title: "Freelance Contracts",
        description:
          "Essential contract clauses every freelancer needs before work begins - payment, IP, revisions, and termination.",
        articleSlug: "freelance-contracts-essentials",
      },
      {
        slug: "scope-creep-mitigation",
        title: "Scope Creep Mitigation",
        description:
          "How to define scope, document change requests, and bill for out-of-scope work without conflict.",
        articleSlug: "scope-creep-mitigation-freelancers",
      },
    ],
    faqItems: [
      {
        question: "Do freelancers need a written contract?",
        answer:
          "Yes. A written contract defines scope, payment terms, IP ownership, revision limits, and termination - reducing disputes and making invoices enforceable.",
      },
      {
        question: "How do freelancers handle scope creep?",
        answer:
          "Document the original scope in the contract, require written change requests for additions, quote extra work before starting it, and issue a separate invoice or change order.",
      },
    ],
    relatedProductLinks: [
      { href: "/invoice-template-for-agencies", label: "Agency templates" },
      { href: "/contact", label: "Contact support" },
    ],
  },
  {
    slug: "tax-compliance-currency",
    title: "Tax, Compliance & Cross-Border Currency",
    shortTitle: "Tax & Compliance",
    description:
      "High-intent, high-trust topics - GST and Form 16A in India, 1099 compliance in the US, cross-border wire fees, and international payment logistics.",
    keywords: [
      "freelance tax compliance",
      "1099 freelancer",
      "Form 16A freelancer India",
      "cross-border wire fees",
      "freelance GST India",
      "international freelancer payments",
    ],
    topics: [
      {
        slug: "cross-border-wire-fees",
        title: "Cross-Border Wire Fees",
        description:
          "SWIFT, Wise, and PayPal fee structures - how to price international work and invoice clients to protect your net income.",
        articleSlug: "cross-border-wire-fees-freelancers",
      },
      {
        slug: "1099-form-16-compliance",
        title: "1099 / Form 16 Compliance",
        description:
          "US 1099-NEC requirements and Indian TDS Form 16A - what freelancers must track, report, and request from clients.",
        articleSlug: "form-1099-form-16-freelancer-compliance",
      },
    ],
    faqItems: [
      {
        question: "Do US clients need to send freelancers a 1099?",
        answer:
          "US clients generally issue Form 1099-NEC when they pay a non-employee $600 or more in a tax year. Freelancers report this income on their tax return regardless of whether a 1099 was received.",
      },
      {
        question: "What is Form 16A for Indian freelancers?",
        answer:
          "Form 16A is a TDS certificate issued when a client deducts tax at source under Section 194J. Freelancers use it to claim credit against their income tax liability.",
      },
      {
        question: "How do cross-border wire fees affect freelancer pricing?",
        answer:
          "SWIFT wires often cost $15–$50 per transfer; Wise and PayPal charge percentage fees. Build fees into your rate or specify that the client pays transfer costs net of fees.",
      },
    ],
    relatedProductLinks: [
      { href: "/gst-invoice-generator-india", label: "GST invoice generator" },
      { href: "/how-to-create-freelance-invoice-in-india", label: "India invoicing guide" },
      { href: "/usd-invoice-template", label: "USD invoice template" },
    ],
  },
];

const pillarMap = new Map(topicalPillars.map((p) => [p.slug, p]));

export const pillarSlugs = topicalPillars.map((p) => p.slug);

export function getTopicalPillar(slug: string): TopicalPillar | undefined {
  return pillarMap.get(slug);
}

export function getPillarForArticle(articleSlug: string): TopicalPillar | undefined {
  return topicalPillars.find((pillar) =>
    pillar.topics.some((t) => t.articleSlug === articleSlug) ||
    getPillarArticleSlugs(pillar).includes(articleSlug)
  );
}

/** All article slugs assigned to a pillar (topics + legacy cluster articles). */
export function getPillarArticleSlugs(pillar: TopicalPillar): string[] {
  const topicSlugs = pillar.topics.map((t) => t.articleSlug);
  const legacy = pillarLegacyArticles[pillar.slug] ?? [];
  return [...new Set([...topicSlugs, ...legacy])];
}

/** Additional articles mapped to pillars beyond the two flagship subtopics. */
const pillarLegacyArticles: Record<string, string[]> = {
  "invoicing-billing": [
    "ultimate-guide-freelance-invoicing-getting-paid",
    "overdue-invoice-email-templates",
    "net-30-vs-net-60-payment-terms",
    "legally-required-freelance-invoice-information",
    "client-disputes-billable-hours",
    "freelancer-invoice-checklist",
    "payment-terms-for-freelancers",
  ],
  "client-management": [
    "how-to-bill-client-revision-rounds-outside-scope",
    "scope-creep-mitigation-freelancers",
    "freelance-contracts-essentials",
  ],
  "tax-compliance-currency": [
    "freelance-tax-requirements",
    "gst-invoicing-india-freelancers",
    "how-to-bill-international-clients",
  ],
};

export function getPillarArticles(pillar: TopicalPillar) {
  return getPillarArticleSlugs(pillar)
    .map((slug) => guideArticles.find((a) => a.slug === slug))
    .filter((a): a is (typeof guideArticles)[number] => Boolean(a));
}

export function getRelatedPillarArticles(articleSlug: string, limit = 3) {
  const pillar = getPillarForArticle(articleSlug);
  if (!pillar) {
    return guideArticles.filter((a) => a.slug !== articleSlug).slice(0, limit);
  }
  return getPillarArticles(pillar)
    .filter((a) => a.slug !== articleSlug)
    .slice(0, limit);
}

export const freelanceFinancesFaqs: TemplateFaqItem[] = [
  {
    question: "What are the three pillars of freelance financial management?",
    answer:
      "Invoicing & billing operations (getting paid), client management & legal operations (contracts and scope), and tax, compliance & cross-border currency (reporting and international payments).",
  },
  {
    question: "Where should a new freelancer start with freelance finances?",
    answer:
      "Start with a written contract and clear payment terms, then set up a professional invoice workflow. Tax and compliance steps follow once income is flowing.",
  },
  {
    question: "Does Invoice for Freelance help with freelance finances beyond invoicing?",
    answer: `Yes. Our blog and guides at ${getCanonicalUrl("/freelance-finances")} cover billing operations, client management, tax compliance, and cross-border payments - with a free invoice tool to put it into practice.`,
  },
];
