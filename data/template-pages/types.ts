import type { GuideSection } from "@/data/guides/types";

export type TemplateFaqItem = {
  question: string;
  answer: string;
};

export type TemplatePage = {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  category: string;
  publishedAt: string;
  readingTimeMinutes: number;
  sections: GuideSection[];
  faqItems: TemplateFaqItem[];
  relatedSlugs: string[];
};
