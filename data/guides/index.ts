import type { GuideArticle } from "./types";
import { freelanceTaxRequirements } from "./freelance-tax-requirements";
import { freelancerInvoiceChecklist } from "./freelancer-invoice-checklist";
import { gstInvoicingIndiaFreelancers } from "./gst-invoicing-india-freelancers";
import { howToBillInternationalClients } from "./how-to-bill-international-clients";
import { paymentTermsForFreelancers } from "./payment-terms-for-freelancers";

export const guideArticles: GuideArticle[] = [
  howToBillInternationalClients,
  freelanceTaxRequirements,
  freelancerInvoiceChecklist,
  paymentTermsForFreelancers,
  gstInvoicingIndiaFreelancers,
].sort(
  (a, b) =>
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
);

export function getGuideBySlug(slug: string): GuideArticle | undefined {
  return guideArticles.find((article) => article.slug === slug);
}

export function getAllGuideSlugs(): string[] {
  return guideArticles.map((article) => article.slug);
}

export type { GuideArticle, GuideSection } from "./types";
