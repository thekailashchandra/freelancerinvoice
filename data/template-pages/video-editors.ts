import type { TemplatePage } from "./types";

export const invoiceTemplateForVideoEditors: TemplatePage = {
  slug: "invoice-template-for-video-editors",
  title: "Invoice Template for Video Editors - Projects, Revisions & Licensing",
  description:
    "Free invoice template for freelance video editors. Bill per minute, per project, revisions, color grade, and delivery formats with professional PDF invoices.",
  keywords: [
    "invoice template for video editors",
    "video editing invoice template",
    "freelance video editor billing",
    "post-production invoice",
    "youtube editor invoice",
  ],
  category: "By profession",
  publishedAt: "2026-06-10",
  readingTimeMinutes: 7,
  relatedSlugs: [
    "invoice-template-for-photographers",
    "invoice-template-for-designers",
    "invoice-template-for-marketers",
    "usd-invoice-template",
  ],
  sections: [
    {
      id: "video-editor-billing",
      heading: "How video editors bill clients",
      paragraphs: [
        "Video editing quotes are often based on runtime, complexity, turnaround, and deliverable formats. Your invoice should mirror the quote: project name, version, included revision rounds, and any rush fees.",
      ],
    },
    {
      id: "line-items",
      heading: "Common line items for post-production",
      list: [
        "Rough cut - X minutes of source to Y minute deliverable",
        "Fine cut + sound sync",
        "Color grade (basic or advanced)",
        "Motion graphics package - lower thirds, titles",
        "Revision round beyond included count",
        "Export pack - 16:9, 9:16, captions file",
      ],
    },
    {
      id: "revisions",
      heading: "Revision rounds on the invoice",
      paragraphs: [
        "State how many revision rounds are included in the base edit fee. Bill additional rounds as separate lines so clients understand incremental cost and you avoid unlimited changes.",
      ],
    },
    {
      id: "raw-files",
      heading: "Project files and archive fees",
      paragraphs: [
        "If you charge for raw project archive or asset storage beyond 30 days, add it as an optional line item. Some editors include 90-day storage; say so in the invoice notes.",
      ],
    },
  ],
  faqItems: [
    {
      question: "Do video editors charge per minute or per project?",
      answer:
        "Both are common. Per-minute suits straightforward edits; per-project suits bundled deliverables. Your invoice line should match how you quoted the job.",
    },
    {
      question: "How many revisions should I include on a video invoice?",
      answer:
        "Two rounds is typical for corporate work; social content may be one. Put the included count in the base line and bill extras separately.",
    },
    {
      question: "Should I list export formats on the invoice?",
      answer:
        "Yes - note resolutions and aspect ratios delivered (1080p, 4K, vertical cut) so clients cannot expect unlimited re-exports without a new line item.",
    },
    {
      question: "Can I invoice YouTube or creator clients professionally?",
      answer:
        "Absolutely. Use clear project titles (e.g. “March vlog batch - 4 videos”) and PDF invoices even for smaller creators - it builds trust and tax records.",
    },
    {
      question: "What is the fastest way to make a video editor invoice?",
      answer:
        "Use Invoice for Freelance: add line items, preview live, download PDF, and save to cloud history - free for freelancers.",
    },
  ],
};
