import type { MetadataRoute } from "next";
import { hubClusterSlugs } from "@/data/hub-clusters";
import { pillarSlugs } from "@/data/topical-pillars";
import { comparisonSlugs } from "@/data/comparisons";
import { aiGuideSlugs } from "@/data/ai-guides";
import { landingPageSlugs } from "@/data/landing-pages";
import { templatePageSlugs } from "@/data/template-pages";
import { siteConfig } from "@/data/site";

const appDisallow = [
  "/dashboard",
  "/create-invoice",
  "/invoice-history",
  "/settings",
  "/onboarding",
  "/support",
  "/create",
  "/history",
  "/api/",
  "/auth/",
] as const;

const marketingSlugs = [
  ...templatePageSlugs,
  ...aiGuideSlugs,
  ...landingPageSlugs,
].map((slug) => `/${slug}`);

const publicAllow = [
  "/",
  "/features",
  "/pricing",
  "/about",
  "/contact",
  "/blog",
  "/guide",
  "/login",
  "/signup",
  "/privacy",
  "/terms",
  "/refund-policy",
  "/invoice-templates",
  "/freelance-finances",
  "/india",
  "/global-freelance-invoicing-compliance",
  "/llms.txt",
  "/llms-full.txt",
  "/consensus.txt",
  ...marketingSlugs,
  ...comparisonSlugs.map((slug) => `/vs/${slug}`),
  ...pillarSlugs.map((slug) => `/blog/pillar/${slug}`),
  ...hubClusterSlugs.map((slug) => `/blog/hub/${slug}`),
] as const;

/** AI / LLM crawlers — allow public marketing content, block app routes. */
const aiCrawlers = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "Google-Extended",
  "anthropic-ai",
  "ClaudeBot",
  "Claude-Web",
  "PerplexityBot",
  "Perplexity-User",
  "Bytespider",
  "cohere-ai",
  "meta-externalagent",
  "Amazonbot",
] as const;

function buildRules() {
  const baseRules: MetadataRoute.Robots["rules"] = [
    {
      userAgent: "*",
      allow: [...publicAllow],
      disallow: [...appDisallow],
    },
    {
      userAgent: "Googlebot",
      allow: [...publicAllow],
      disallow: [...appDisallow],
    },
  ];

  const aiRules = aiCrawlers.map((userAgent) => ({
    userAgent,
    allow: [...publicAllow],
    disallow: [...appDisallow],
  }));

  return [...baseRules, ...aiRules];
}

export const revalidate = 86400;

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.url.replace(/\/$/, "");

  return {
    rules: buildRules(),
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
