import { getAiGuideBySlug } from "@/data/ai-guides";
import type { TemplatePage } from "./types";
import { gstInvoiceTemplate } from "./gst";
import { invoiceTemplateForDesigners } from "./designers";
import { invoiceTemplateForDevelopers } from "./developers";
import { invoiceTemplateForMarketers } from "./marketers";
import { invoiceTemplateForPhotographers } from "./photographers";
import { invoiceTemplateForVideoEditors } from "./video-editors";
import { invoiceTemplateIndia } from "./india";
import { printableGraphicDesignerInvoiceLayout } from "./printable-designer-invoice";
import { usdInvoiceTemplate } from "./usd";

export const templatePages: TemplatePage[] = [
  printableGraphicDesignerInvoiceLayout,
  invoiceTemplateForDesigners,
  invoiceTemplateForPhotographers,
  invoiceTemplateForMarketers,
  invoiceTemplateForDevelopers,
  invoiceTemplateForVideoEditors,
  gstInvoiceTemplate,
  usdInvoiceTemplate,
  invoiceTemplateIndia,
];

const templatePageMap = new Map(
  templatePages.map((page) => [page.slug, page])
);

export const templatePageSlugs = templatePages.map((page) => page.slug);

export function isTemplatePageSlug(slug: string): boolean {
  return templatePageMap.has(slug);
}

export function getTemplatePageBySlug(slug: string): TemplatePage | undefined {
  return templatePageMap.get(slug);
}

export type RelatedPage = {
  slug: string;
  title: string;
};

export function getRelatedTemplatePages(page: TemplatePage): RelatedPage[] {
  return page.relatedSlugs
    .map((slug) => {
      const template = templatePageMap.get(slug);
      if (template) {
        return { slug: template.slug, title: template.title };
      }
      const guide = getAiGuideBySlug(slug);
      if (guide) {
        return { slug: guide.slug, title: guide.title };
      }
      return null;
    })
    .filter((item): item is RelatedPage => Boolean(item));
}

export type { TemplateFaqItem, TemplatePage } from "./types";
