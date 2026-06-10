import type { TemplateFaqItem } from "@/data/template-pages/types";

export type ComparisonRow = {
  feature: string;
  us: string;
  them: string;
};

export type ComparisonPage = {
  slug: string;
  competitorName: string;
  title: string;
  metaDescription: string;
  h1: string;
  summary: string;
  keywords: string[];
  publishedAt: string;
  rows: ComparisonRow[];
  whyChooseUs: string[];
  faqItems: TemplateFaqItem[];
  relatedComparisons: string[];
};
