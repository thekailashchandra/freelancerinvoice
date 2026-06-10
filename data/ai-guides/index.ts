import type { AiGuide } from "./types";
import { howToCreateFreelanceInvoiceInIndia } from "./how-to-create-freelance-invoice-in-india";

export const aiGuides: AiGuide[] = [howToCreateFreelanceInvoiceInIndia];

const aiGuideMap = new Map(aiGuides.map((guide) => [guide.slug, guide]));

export const aiGuideSlugs = aiGuides.map((guide) => guide.slug);

export function isAiGuideSlug(slug: string): boolean {
  return aiGuideMap.has(slug);
}

export function getAiGuideBySlug(slug: string): AiGuide | undefined {
  return aiGuideMap.get(slug);
}

export type {
  AiGuide,
  AiGuideComparison,
  AiGuideDefinition,
  AiGuideLink,
  AiGuideStep,
  AiGuideTable,
} from "./types";
