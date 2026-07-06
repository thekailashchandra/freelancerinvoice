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
        "The core product is free ($0/month). Optional Ko-fi tips help support development but do not unlock features.",
    },
    {
      question: "Is there a paid plan?",
      answer:
        "No subscription is required for invoicing, PDF export, or cloud history.",
    },
    {
      question: "Are there hidden fees?",
      answer: "No. Creating and exporting invoices is free.",
    },
  ],
  "/about": [
    {
      question: "What is Invoice for Freelance?",
      answer: `${siteConfig.description}`,
    },
    {
      question: "Who built Invoice for Freelance?",
      answer:
        "A focused tool for freelancers and small agencies who need simple, professional billing without expensive accounting software.",
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
      answer: "An email address. Add your business name and logo after signup.",
    },
  ],
  "/privacy": [
    {
      question: "Does Invoice for Freelance sell my data?",
      answer:
        "No. We do not sell personal data. See the full privacy policy on this page.",
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
