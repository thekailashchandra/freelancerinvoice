import { siteConfig } from "@/data/site";

/** Primary and secondary keywords for organic search (Google, Gemini, Bing). */
export const seoKeywords = [
  "invoice for freelancers",
  "invoice for freelance",
  "freelancer invoice",
  "freelancer invoice generator",
  "free invoice for freelancers",
  "freelance invoicing software",
  "create invoice for freelance work",
  "professional freelancer invoice",
  "online invoice for freelancers",
  "freelance invoice template",
  "invoice tool for freelancers",
  "freelancer billing",
  "freelance invoice maker",
  "PDF invoice for freelancers",
] as const;

export const homeSeo = {
  title: "Invoice for Freelancers — Free Professional Invoice Generator",
  description:
    "Create professional invoices for freelancers in minutes. Free invoice generator with PDF export, cloud storage, payment tracking, and invoice history. Built for freelance designers, developers, writers, and consultants.",
  ogTitle: "Invoice for Freelancers | Free Invoice Generator & PDF Export",
  ogDescription:
    "The easiest way to invoice for freelance work. Create beautiful invoices, track payments, and download PDFs — no spreadsheets required.",
} as const;

export const faqItems = [
  {
    question: "What is an invoice for freelancers?",
    answer:
      "An invoice for freelancers is a billing document that lists the services you delivered, your rates, payment terms, and the total amount due. Freelancers use invoices to get paid professionally by clients for project work, retainers, or hourly billing.",
  },
  {
    question: "How do I create an invoice for freelance work?",
    answer:
      "Sign up for Invoice for Freelance, add your business details and logo, enter client information, line items, and payment terms. Preview your invoice live, then export a PDF or save it to your cloud invoice history for future reference.",
  },
  {
    question: "Is this invoice generator free for freelancers?",
    answer:
      "Yes. Invoice for Freelance offers a free account so you can create professional freelancer invoices, store them securely in the cloud, and export PDFs without manual formatting in Word or Excel.",
  },
  {
    question: "What should a freelancer invoice include?",
    answer:
      "A complete freelancer invoice should include your business name and contact details, client name, unique invoice number, issue and due dates, itemized services or deliverables, subtotal, taxes if applicable, total amount due, and accepted payment methods.",
  },
  {
    question: "Can I download my freelancer invoice as a PDF?",
    answer:
      "Absolutely. Every invoice you create can be exported as a polished PDF with your branding, ready to email to clients or attach to accounting records.",
  },
  {
    question: "Does Invoice for Freelance work for international freelancers?",
    answer:
      "Yes. You can configure currency, country-specific payment fields, and client details so your freelance invoices meet local billing expectations whether you work with domestic or global clients.",
  },
  {
    question: "How does cloud sync help freelancers manage invoices?",
    answer:
      "Cloud sync saves every invoice to your account so you can search history, filter by paid or overdue status, and access records from any device — no lost files or scattered spreadsheets.",
  },
  {
    question: "Is my freelance invoice data secure?",
    answer:
      "Your data is protected with account-level isolation and row-level security in Supabase. Only you can access your invoices, clients, and company settings.",
  },
] as const;

export const publicRoutes = [
  { path: "/", changeFrequency: "weekly" as const, priority: 1 },
  { path: "/login", changeFrequency: "monthly" as const, priority: 0.5 },
  { path: "/signup", changeFrequency: "monthly" as const, priority: 0.8 },
] as const;

export function getCanonicalUrl(path = ""): string {
  const base = siteConfig.url.replace(/\/$/, "");
  if (!path || path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function buildKeywordsString(): string {
  return seoKeywords.join(", ");
}
