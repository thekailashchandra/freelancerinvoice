import type { TemplateFaqItem } from "@/data/template-pages/types";

export type LandingFeature = {
  title: string;
  description: string;
};

export type SeoLandingPage = {
  slug: string;
  title: string;
  metaDescription: string;
  h1: string;
  heroSummary: string;
  keywords: string[];
  category: string;
  /** Geographic market targeting for localization strategy. */
  market?: "IN" | "GLOBAL" | "BOTH";
  publishedAt: string;
  benefits: string[];
  features: LandingFeature[];
  useCases: string[];
  faqItems: TemplateFaqItem[];
  relatedSlugs: string[];
  relatedLinks: { href: string; label: string }[];
};
