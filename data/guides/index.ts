import type { GuideArticle } from "./types";
import { billClientRevisionRoundsOutsideScope } from "./bill-client-revision-rounds-outside-scope";
import { clientDisputesBillableHours } from "./client-disputes-billable-hours";
import { crossBorderWireFeesFreelancers } from "./cross-border-wire-fees-freelancers";
import { freelanceContractsEssentials } from "./freelance-contracts-essentials";
import { freelanceTaxRequirements } from "./freelance-tax-requirements";
import { form1099Form16FreelancerCompliance } from "./form-1099-form-16-freelancer-compliance";
import { freelancerInvoiceChecklist } from "./freelancer-invoice-checklist";
import { gstInvoicingIndiaFreelancers } from "./gst-invoicing-india-freelancers";
import { howToDeleteCustomersInvoiceForFreelance } from "./how-to-delete-customers-invoice-for-freelance";
import { howToBillInternationalClients } from "./how-to-bill-international-clients";
import { latePaymentRecoveryFreelancers } from "./late-payment-recovery-freelancers";
import { legallyRequiredFreelanceInvoiceInformation } from "./legally-required-freelance-invoice-information";
import { milestoneVsHourlyBillingFreelancers } from "./milestone-vs-hourly-billing-freelancers";
import { net30VsNet60PaymentTerms } from "./net-30-vs-net-60-payment-terms";
import { overdueInvoiceEmailTemplates } from "./overdue-invoice-email-templates";
import { paymentTermsForFreelancers } from "./payment-terms-for-freelancers";
import { scopeCreepMitigationFreelancers } from "./scope-creep-mitigation-freelancers";
import { ultimateGuideFreelanceInvoicingGettingPaid } from "./ultimate-guide-freelance-invoicing-getting-paid";

export const guideArticles: GuideArticle[] = [
  howToDeleteCustomersInvoiceForFreelance,
  billClientRevisionRoundsOutsideScope,
  ultimateGuideFreelanceInvoicingGettingPaid,
  overdueInvoiceEmailTemplates,
  net30VsNet60PaymentTerms,
  legallyRequiredFreelanceInvoiceInformation,
  clientDisputesBillableHours,
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

export type {
  GuideArticle,
  GuideContentUpgrade,
  GuideSection,
} from "./types";
