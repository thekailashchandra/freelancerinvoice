import type { TemplateFaqItem } from "@/data/template-pages/types";
import { getGuideBySlug } from "@/data/guides";
import { getCanonicalUrl } from "@/data/urls";

export type HubSpoke = {
  slug: string;
  title: string;
  description: string;
  articleSlug: string;
};

export type HubCluster = {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  hubArticleSlug: string;
  spokes: HubSpoke[];
  faqItems: TemplateFaqItem[];
};

export const freelanceInvoicingCluster: HubCluster = {
  slug: "freelance-invoicing-getting-paid",
  title: "The Ultimate Guide to Freelance Invoicing & Getting Paid On Time",
  description:
    "Everything freelancers need to invoice professionally, set payment terms, chase overdue payments, meet legal requirements, and resolve billing disputes - with templates and actionable steps.",
  keywords: [
    "freelance invoicing guide",
    "get paid on time freelancer",
    "freelancer invoice guide",
    "how to invoice as a freelancer",
    "freelance payment terms",
    "overdue invoice freelancer",
  ],
  hubArticleSlug: "ultimate-guide-freelance-invoicing-getting-paid",
  spokes: [
    {
      slug: "overdue-invoice-email",
      title: "How to Write a Polite but Firm Overdue Invoice Email",
      description:
        "Copy-paste email templates for chasing late payments - from friendly reminders to final notices.",
      articleSlug: "overdue-invoice-email-templates",
    },
    {
      slug: "net-30-vs-net-60",
      title: "Net 30 vs Net 60 Payment Terms for Independent Creators",
      description:
        "Which payment terms protect your cash flow without scaring off clients.",
      articleSlug: "net-30-vs-net-60-payment-terms",
    },
    {
      slug: "legal-invoice-requirements",
      title: "What Information Is Legally Required on a Freelance Invoice?",
      description:
        "Mandatory fields by region - and what to include so clients pay faster.",
      articleSlug: "legally-required-freelance-invoice-information",
    },
    {
      slug: "billable-hours-disputes",
      title: "How to Handle Client Disputes Over Billable Tracked Hours",
      description:
        "De-escalate hour disputes, document time, and get invoices approved.",
      articleSlug: "client-disputes-billable-hours",
    },
  ],
  faqItems: [
    {
      question: "How do freelancers get paid on time?",
      answer:
        "Use clear contracts, professional invoices with visible due dates, Net 14–30 terms, deposit requirements for new clients, and a consistent overdue follow-up sequence starting before the due date.",
    },
    {
      question: "What should every freelance invoice include?",
      answer:
        "Your business name and contact, client details, unique invoice number, issue and due dates, itemized services, total amount, payment instructions, and tax IDs where required by law.",
    },
    {
      question: "What is the best way to chase an overdue freelance invoice?",
      answer: `Start with a polite reminder email, escalate tone over 2–3 weeks, reference contract late-fee terms, and pause work if needed. See our overdue email templates at ${getCanonicalUrl("/blog/overdue-invoice-email-templates")}.`,
    },
  ],
};

export const hubClusters: HubCluster[] = [freelanceInvoicingCluster];

const clusterMap = new Map(hubClusters.map((c) => [c.slug, c]));

export const hubClusterSlugs = hubClusters.map((c) => c.slug);

export function getHubCluster(slug: string): HubCluster | undefined {
  return clusterMap.get(slug);
}

export function getHubClusterForArticle(
  articleSlug: string
): HubCluster | undefined {
  return hubClusters.find(
    (cluster) =>
      cluster.hubArticleSlug === articleSlug ||
      cluster.spokes.some((spoke) => spoke.articleSlug === articleSlug)
  );
}

export function getHubClusterSpokeArticles(cluster: HubCluster) {
  return cluster.spokes
    .map((spoke) => getGuideBySlug(spoke.articleSlug))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));
}

export function getHubClusterPath(cluster: HubCluster): string {
  return `/blog/hub/${cluster.slug}`;
}
