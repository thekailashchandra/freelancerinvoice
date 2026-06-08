export interface GuideSection {
  id: string;
  heading: string;
  paragraphs?: string[];
  list?: string[];
  note?: string;
}

export interface GuideArticle {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  category: string;
  publishedAt: string;
  readingTimeMinutes: number;
  sections: GuideSection[];
}
