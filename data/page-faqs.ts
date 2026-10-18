import { founder } from "@/data/founder";
import { siteConfig } from "@/data/site";
import { customerFaqs } from "@/data/customer-faqs";
import type { TemplateFaqItem } from "@/data/template-pages/types";

export const pageFaqs: Record<string, TemplateFaqItem[]> = {
  "/features": [
    {
      question: "What features does Invoice for Freelance include?",
      answer:
        "Professional invoices, live preview, PDF export, cloud history, payment status tracking, multi-currency, UPI/bank fields, GST-ready details, and custom branding.",
    },
    {
      question: "Is Invoice for Freelance free?",
      answer:
        "The source is open source and free to self-host. On our hosted Cloud service, creating and previewing invoices is free; PDF download and printing require the Cloud plan.",
    },
    {
      question: "Does it work for Indian freelancers?",
      answer:
        "Yes - INR, UPI, GST fields, and India-specific templates and guides are supported.",
    },
  ],
  "/pricing": [
    {
      question: "How much does Invoice for Freelance cost?",
      answer:
        "Self-hosting is free forever under the open-source license. The hosted Cloud plan is ₹299/month or ₹999/year for Indian clients, and $5/month or $19/year elsewhere. Creating, editing, and previewing invoices is free on both.",
    },
    {
      question: "What does the Cloud plan include?",
      answer:
        "PDF download, printing, payment receipts, all eight invoice templates, brand colors, cloud invoice history, and payment status tracking. One payment covers 30 days or 365 days depending on the plan.",
    },
    {
      question: "Can I use the app without paying?",
      answer:
        "Yes. You can create an account, build invoices, pick templates, and preview the finished document. PDF download, print, and receipt exports unlock with Cloud. Self-hosted installs have every feature unlocked for free.",
    },
    {
      question: "Is Cloud an auto-renewing subscription?",
      answer:
        "Cloud is a 30-day pass per payment rather than an automatic mandate. Add another month whenever you need it - the new period extends from your existing expiry.",
    },
    {
      question: "Are there hidden fees?",
      answer:
        "No. The price shown is the price charged. Self-hosting costs only what your own hosting and database provider charges.",
    },
  ],
  "/about": [
    {
      question: "What is Invoice for Freelance?",
      answer: `${siteConfig.description}`,
    },
    {
      question: "Who built Invoice for Freelance?",
      answer: `${founder.name}, ${founder.role.toLowerCase()} of ${siteConfig.name}, built the product for freelancers who need simple, professional billing without expensive accounting software. ${founder.bio}`,
    },
  ],
  "/contact": [
    {
      question: "How do I contact Invoice for Freelance?",
      answer:
        "Use the contact form on this page or email invoiceforfreelance@gmail.com for support, features, or partnerships.",
    },
    {
      question: "What is the response time?",
      answer: "We aim to respond within a few business days.",
    },
  ],
  "/login": [
    {
      question: "How do I sign in to Invoice for Freelance?",
      answer: "Use your email and password or Google sign-in on this page.",
    },
    {
      question: "Forgot your password?",
      answer: "Use the password reset link on the sign-in form if available, or contact support.",
    },
  ],
  "/signup": [
    {
      question: "Is signup free?",
      answer:
        "Yes. Creating an account and building invoices is free. Exporting PDFs, printing, and receipts are part of the Cloud plan, or free forever if you self-host.",
    },
    {
      question: "What do I need to sign up?",
      answer:
        "An email address and explicit acceptance of our Privacy Policy, including the data-protection notices for your country shown at signup. Add your business name and logo after signup.",
    },
  ],
  "/privacy": [
    {
      question: "Does Invoice for Freelance sell my data?",
      answer:
        "No. We do not sell personal data. See the full privacy policy on this page.",
    },
    {
      question: "How do regional data-protection laws apply?",
      answer:
        "We tailor signup and login consent to laws in your country - for example GDPR in the EU, UK GDPR in Britain, DPDP in India, LGPD in Brazil, and CCPA-style rights in the United States. See the full country-by-country table on our privacy policy page.",
    },
    {
      question: "Do I have to accept the privacy policy to sign up?",
      answer:
        "Yes. Every new account and every existing user after a policy update must explicitly accept our Privacy Policy and the regional notices shown in the consent checkbox before using the service.",
    },
  ],
  "/terms": [
    {
      question: "What are the terms for using Invoice for Freelance?",
      answer:
        "The free invoicing service is provided as-is. You are responsible for invoice accuracy and tax compliance. Full terms are on this page.",
    },
  ],
  "/refund-policy": [
    {
      question: "Can I get a refund on a Cloud payment?",
      answer:
        "Contact us within 7 days if you were charged in error, charged twice for the same period, or could not access the paid features. Approved refunds are returned to the original payment method.",
    },
    {
      question: "Is Cloud a recurring subscription?",
      answer:
        "No. Each monthly payment covers 30 days and each yearly payment covers 365 days. There is no automatic renewal, so there is nothing to cancel mid-period. Access simply ends when the paid period expires.",
    },
  ],
  "/support": customerFaqs,
};

export function getPageFaqs(path: string): TemplateFaqItem[] {
  return pageFaqs[path] ?? [];
}
