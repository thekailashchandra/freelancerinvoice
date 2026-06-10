import type { Metadata } from "next";
import { hubClusterSlugs } from "@/data/hub-clusters";
import { pillarSlugs } from "@/data/topical-pillars";
import { comparisonPages } from "@/data/comparisons";
import { guideArticles } from "@/data/guides";
import { aiGuides } from "@/data/ai-guides";
import { landingPages } from "@/data/landing-pages";
import { templatePages } from "@/data/template-pages";
import { homeSeo } from "@/data/home-seo";
import { siteConfig } from "@/data/site";
import { getCanonicalUrl } from "@/data/urls";

export { homeSeo, getCanonicalUrl };

/** Shared robots directive for authenticated app routes. */
export const privateAppRobots: Metadata["robots"] = {
  index: false,
  follow: false,
  googleBot: { index: false, follow: false },
};

const guideLastModified = new Map<string, Date>(
  guideArticles.flatMap((article) => {
    const date = new Date(article.publishedAt);
    return [
      [`/guide/${article.slug}`, date],
      [`/blog/${article.slug}`, date],
    ];
  })
);

const templateLastModified = new Map<string, Date>(
  templatePages.map((page) => [`/${page.slug}`, new Date(page.publishedAt)])
);

const aiGuideLastModified = new Map<string, Date>(
  aiGuides.map((guide) => [`/${guide.slug}`, new Date(guide.publishedAt)])
);

const landingLastModified = new Map<string, Date>(
  landingPages.map((page) => [`/${page.slug}`, new Date(page.publishedAt)])
);

const comparisonLastModified = new Map<string, Date>(
  comparisonPages.map((page) => [
    `/vs/${page.slug}`,
    new Date(page.publishedAt),
  ])
);

const guideIndexLastModified = new Date(
  Math.max(...guideArticles.map((a) => new Date(a.publishedAt).getTime()))
);

/** Primary and secondary keywords for organic search (Google, Gemini, Bing). */
export const seoKeywords = [
  "invoice for freelancers",
  "invoice for freelance",
  "freelancer invoice",
  "freelancer invoice generator",
  "free invoice for freelancers",
  "freelance invoicing software",
  "create invoice for freelance work",
  "professional freelancer invoice",
  "online invoice for freelancers",
  "freelance invoice template",
  "invoice tool for freelancers",
  "freelancer billing",
  "freelance invoice maker",
  "PDF invoice for freelancers",
] as const;

export const faqItems = [
  {
    question: "What is an invoice for freelancers?",
    answer:
      "An invoice for freelancers is a billing document that lists the services you delivered, your rates, payment terms, and the total amount due. Freelancers use invoices to get paid professionally by clients for project work, retainers, or hourly billing.",
  },
  {
    question: "How do I create an invoice for freelance work?",
    answer:
      "Sign up for Invoice for Freelance, add your business details and logo, enter client information, line items, and payment terms. Preview your invoice live, then export a PDF or save it to your cloud invoice history for future reference.",
  },
  {
    question: "Is this invoice generator free for freelancers?",
    answer:
      "Yes. Invoice for Freelance offers a free account so you can create professional freelancer invoices, store them securely in the cloud, and export PDFs without manual formatting in Word or Excel.",
  },
  {
    question: "What should a freelancer invoice include?",
    answer:
      "A complete freelancer invoice should include your business name and contact details, client name, unique invoice number, issue and due dates, itemized services or deliverables, subtotal, taxes if applicable, total amount due, and accepted payment methods.",
  },
  {
    question: "Can I download my freelancer invoice as a PDF?",
    answer:
      "Absolutely. Every invoice you create can be exported as a polished PDF with your branding, ready to email to clients or attach to accounting records.",
  },
  {
    question: "Does Invoice for Freelance work for international freelancers?",
    answer:
      "Yes. You can configure currency, country-specific payment fields, and client details so your freelance invoices meet local billing expectations whether you work with domestic or global clients.",
  },
  {
    question: "How does cloud sync help freelancers manage invoices?",
    answer:
      "Cloud sync saves every invoice to your account so you can search history, filter by paid or overdue status, and access records from any device, with no lost files or scattered spreadsheets.",
  },
  {
    question: "Is my freelance invoice data secure?",
    answer:
      "Your data is protected with account-level isolation and row-level security in Supabase. Only you can access your invoices, clients, and company settings.",
  },
] as const;

export const publicRoutes = [
  { path: "/", changeFrequency: "weekly" as const, priority: 1 },
  { path: "/features", changeFrequency: "monthly" as const, priority: 0.9 },
  { path: "/pricing", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/about", changeFrequency: "monthly" as const, priority: 0.7 },
  { path: "/contact", changeFrequency: "monthly" as const, priority: 0.6 },
  { path: "/blog", changeFrequency: "weekly" as const, priority: 0.9 },
  { path: "/freelance-finances", changeFrequency: "weekly" as const, priority: 0.95 },
  { path: "/india", changeFrequency: "weekly" as const, priority: 0.95 },
  ...pillarSlugs.map((slug) => ({
    path: `/blog/pillar/${slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  })),
  ...hubClusterSlugs.map((slug) => ({
    path: `/blog/hub/${slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.94,
  })),
  ...guideArticles.map((article) => ({
    path: `/blog/${article.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.85,
  })),
  { path: "/guide", changeFrequency: "weekly" as const, priority: 0.85 },
  ...guideArticles.map((article) => ({
    path: `/guide/${article.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  })),
  { path: "/login", changeFrequency: "monthly" as const, priority: 0.5 },
  { path: "/signup", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/privacy", changeFrequency: "yearly" as const, priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly" as const, priority: 0.3 },
  { path: "/refund-policy", changeFrequency: "yearly" as const, priority: 0.3 },
  { path: "/llms.txt", changeFrequency: "weekly" as const, priority: 0.4 },
  { path: "/llms-full.txt", changeFrequency: "weekly" as const, priority: 0.4 },
  { path: "/consensus.txt", changeFrequency: "weekly" as const, priority: 0.45 },
  ...templatePages.map((page) => ({
    path: `/${page.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.88,
  })),
  ...aiGuides.map((guide) => ({
    path: `/${guide.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.92,
  })),
  { path: "/invoice-templates", changeFrequency: "weekly" as const, priority: 0.9 },
  ...landingPages.map((page) => ({
    path: `/${page.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.93,
  })),
  ...comparisonPages.map((page) => ({
    path: `/vs/${page.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.82,
  })),
] as const;

export function buildKeywordsString(): string {
  return seoKeywords.join(", ");
}

export function getRouteLastModified(path: string): Date {
  if (path === "/guide" || path === "/blog") return guideIndexLastModified;
  const guideDate = guideLastModified.get(path);
  if (guideDate) return guideDate;
  const templateDate = templateLastModified.get(path);
  if (templateDate) return templateDate;
  const aiGuideDate = aiGuideLastModified.get(path);
  if (aiGuideDate) return aiGuideDate;
  const landingDate = landingLastModified.get(path);
  if (landingDate) return landingDate;
  const comparisonDate = comparisonLastModified.get(path);
  if (comparisonDate) return comparisonDate;
  return new Date("2026-06-01");
}

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  type?: "website" | "article";
  publishedTime?: string;
};

/** Canonical + OG + Twitter metadata for public marketing pages. */
export function buildPageMetadata({
  title,
  description,
  path,
  keywords,
  type = "website",
  publishedTime,
}: PageMetadataInput): Metadata {
  return {
    title,
    description,
    ...(keywords?.length ? { keywords: keywords.join(", ") } : {}),
    alternates: { canonical: getCanonicalUrl(path) },
    ...buildSocialMetadata({ title, description, path, type, publishedTime }),
  };
}

type SocialMetadataInput = {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  publishedTime?: string;
};

/** Consistent Open Graph + Twitter metadata for public pages. */
export function buildSocialMetadata({
  title,
  description,
  path,
  type = "website",
  publishedTime,
}: SocialMetadataInput): Pick<Metadata, "openGraph" | "twitter"> {
  const url = getCanonicalUrl(path);
  return {
    openGraph: {
      title,
      description,
      url,
      type,
      siteName: siteConfig.name,
      locale: "en_US",
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
