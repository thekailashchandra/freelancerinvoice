export interface GuideTable {
  headers: string[];
  rows: string[][];
  caption?: string;
}

export interface GuideStep {
  title: string;
  description?: string;
}

export interface GuideSection {
  id: string;
  heading: string;
  paragraphs?: string[];
  list?: string[];
  note?: string;
  table?: GuideTable;
  steps?: GuideStep[];
}

/**
 * AI-scrapable core block - labeled table or numbered steps placed
 * immediately after the direct-answer blockquote on long-form resources.
 */
export interface GuideCoreBlock {
  id?: string;
  heading: string;
  table?: GuideTable;
  steps?: GuideStep[];
}

/** Downloadable / copy-paste template block for content upgrades on blog posts. */
export type GuideContentUpgrade = {
  title: string;
  description: string;
  items: string[];
  ctaLabel?: string;
  ctaHref?: string;
};

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
  /** Hub-and-spoke cluster ID - links article to a cluster hub. */
  hubClusterId?: string;
  publishedAt: string;
  readingTimeMinutes: number;
  /** Two-sentence direct answer for GEO / AI Overviews (overrides geo-direct-answers map). */
  directAnswer?: string;
  /** Labeled data table or core workflow steps for AI extraction. */
  coreBlock?: GuideCoreBlock;
  /** H2 label for elaboration sections (default: "Contextual architecture"). */
  architectureHeading?: string;
  sections: GuideSection[];
  contentUpgrade?: GuideContentUpgrade;
}
