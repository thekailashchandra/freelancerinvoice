import type { SeoLandingPage } from "./types";
import { gstInvoiceGeneratorIndia } from "./gst-india";
import { invoiceGeneratorForFreelancers } from "./freelancers";
import { invoiceSoftwareForDesigners } from "./designers";
import { invoiceTemplateForAgencies } from "./agencies";

export const landingPages: SeoLandingPage[] = [
  invoiceGeneratorForFreelancers,
  gstInvoiceGeneratorIndia,
  invoiceSoftwareForDesigners,
  invoiceTemplateForAgencies,
];

const landingPageMap = new Map(landingPages.map((page) => [page.slug, page]));

export const landingPageSlugs = landingPages.map((page) => page.slug);

export function isLandingPageSlug(slug: string): boolean {
  return landingPageMap.has(slug);
}

export function getLandingPageBySlug(slug: string): SeoLandingPage | undefined {
  return landingPageMap.get(slug);
}

export function getRelatedLandingPages(page: SeoLandingPage): SeoLandingPage[] {
  return page.relatedSlugs
    .map((slug) => landingPageMap.get(slug))
    .filter((item): item is SeoLandingPage => Boolean(item));
}

export type { SeoLandingPage, LandingFeature } from "./types";
