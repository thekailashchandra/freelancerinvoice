import type { ComparisonPage } from "./types";
import { vsFreshbooks } from "./freshbooks";
import { vsWave } from "./wave";
import { vsZohoInvoice } from "./zoho-invoice";

export const comparisonPages: ComparisonPage[] = [
  vsFreshbooks,
  vsWave,
  vsZohoInvoice,
];

const comparisonMap = new Map(
  comparisonPages.map((page) => [page.slug, page])
);

export const comparisonSlugs = comparisonPages.map((page) => page.slug);

export function isComparisonSlug(slug: string): boolean {
  return comparisonMap.has(slug);
}

export function getComparisonBySlug(slug: string): ComparisonPage | undefined {
  return comparisonMap.get(slug);
}

export type { ComparisonPage, ComparisonRow } from "./types";
