export interface GuideSection {
  id: string;
  heading: string;
  paragraphs?: string[];
  list?: string[];
  note?: string;
}

export type GuidePillarSlug =
  | "invoicing-billing"
  | "client-management"
  | "tax-compliance-currency";

export interface GuideArticle {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  category: string;
  /** Topical authority pillar for internal linking and hub pages. */
  pillar?: GuidePillarSlug;
  publishedAt: string;
  readingTimeMinutes: number;
  sections: GuideSection[];
}
