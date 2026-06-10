export interface GuideSection {
  id: string;
  heading: string;
  paragraphs?: string[];
  list?: string[];
  note?: string;
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
  /** Hub-and-spoke cluster ID — links article to a cluster hub. */
  hubClusterId?: string;
  publishedAt: string;
  readingTimeMinutes: number;
  sections: GuideSection[];
  contentUpgrade?: GuideContentUpgrade;
}
