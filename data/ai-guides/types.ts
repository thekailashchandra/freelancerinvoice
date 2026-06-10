import type { TemplateFaqItem } from "@/data/template-pages/types";

export type AiGuideTable = {
  id: string;
  caption: string;
  headers: string[];
  rows: string[][];
};

export type AiGuideStep = {
  step: number;
  title: string;
  description: string;
  items?: string[];
};

export type AiGuideComparison = {
  id: string;
  caption: string;
  leftLabel: string;
  rightLabel: string;
  rows: { aspect: string; left: string; right: string }[];
};

export type AiGuideDefinition = {
  term: string;
  definition: string;
};

export type AiGuideLink = {
  href: string;
  label: string;
  description?: string;
};

export type AiGuide = {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  category: string;
  publishedAt: string;
  readingTimeMinutes: number;
  summary: string;
  steps: AiGuideStep[];
  definitions: AiGuideDefinition[];
  tables: AiGuideTable[];
  comparisons: AiGuideComparison[];
  faqItems: TemplateFaqItem[];
  relatedLinks: AiGuideLink[];
};
