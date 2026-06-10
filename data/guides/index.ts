import type { GuideArticle } from "./types";
import { crossBorderWireFeesFreelancers } from "./cross-border-wire-fees-freelancers";
import { freelanceContractsEssentials } from "./freelance-contracts-essentials";
import { freelanceTaxRequirements } from "./freelance-tax-requirements";
import { form1099Form16FreelancerCompliance } from "./form-1099-form-16-freelancer-compliance";
import { freelancerInvoiceChecklist } from "./freelancer-invoice-checklist";
import { gstInvoicingIndiaFreelancers } from "./gst-invoicing-india-freelancers";
import { howToBillInternationalClients } from "./how-to-bill-international-clients";
import { latePaymentRecoveryFreelancers } from "./late-payment-recovery-freelancers";
import { milestoneVsHourlyBillingFreelancers } from "./milestone-vs-hourly-billing-freelancers";
import { paymentTermsForFreelancers } from "./payment-terms-for-freelancers";
import { scopeCreepMitigationFreelancers } from "./scope-creep-mitigation-freelancers";

export const guideArticles: GuideArticle[] = [
  latePaymentRecoveryFreelancers,
  milestoneVsHourlyBillingFreelancers,
  freelanceContractsEssentials,
  scopeCreepMitigationFreelancers,
  crossBorderWireFeesFreelancers,
  form1099Form16FreelancerCompliance,
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
