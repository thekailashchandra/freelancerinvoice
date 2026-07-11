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
      answer: "Yes. Core invoicing features are free with no credit card required.",
    },
    {
      question: "Does it work for Indian freelancers?",
      answer:
        "Yes — INR, UPI, GST fields, and India-specific templates and guides are supported.",
    },
  ],
  "/pricing": [
    {
      question: "How much does Invoice for Freelance cost?",
      answer:
        "The core product is free ($0/month). You can create invoices, use the Classic template, export PDFs, and print at no charge. Premium templates (Modern, Minimal, and Simple) are an optional one-time unlock — $1 internationally or ₹99 in India — when checkout is available.",
    },
    {
      question: "Is there a paid plan or subscription?",
      answer:
        "No subscription is required. Invoicing, cloud history, and the Classic template stay free. Premium templates are a one-time purchase per layout, not a recurring plan.",
    },
    {
      question: "Do I have to pay to print an invoice?",
      answer:
        "Printing and PDF export are free with the Classic template. If you choose a premium template (Modern, Minimal, or Simple), the same one-time unlock required for PDF download also applies to print. You can always switch back to Classic to print or export for free.",
    },
    {
      question: "What is the difference between Ko-fi tips and template payments?",
      answer:
        "Ko-fi tips are voluntary contributions that help support the platform and can remove the small Powered by footer. Premium template unlocks are separate one-time Razorpay payments that let you download or print invoices using Modern, Minimal, or Simple layouts.",
    },
    {
      question: "Are there hidden fees?",
      answer:
        "No. Core invoicing is free. You only pay if you choose to unlock a premium template or leave a voluntary Ko-fi tip.",
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
      answer: "Yes. Create a free account to start invoicing immediately.",
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
        "We tailor signup and login consent to laws in your country — for example GDPR in the EU, UK GDPR in Britain, DPDP in India, LGPD in Brazil, and CCPA-style rights in the United States. See the full country-by-country table on our privacy policy page.",
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
      question: "Can I get a refund on Ko-fi tips?",
      answer:
        "Tips are voluntary. Refunds are considered for duplicate or erroneous charges — see this page for details.",
    },
  ],
  "/support": customerFaqs,
};

export function getPageFaqs(path: string): TemplateFaqItem[] {
  return pageFaqs[path] ?? [];
}
