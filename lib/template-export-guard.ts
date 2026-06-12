import {
  getInvoiceTemplate,
  type InvoiceTemplateId,
} from "@/lib/invoice-templates";
import { isTemplateUnlocked } from "@/lib/template-unlocks";

/** True when a premium template is selected but not paid/unlocked. */
export function requiresTemplatePayment(
  templateId?: InvoiceTemplateId | null
): boolean {
  const template = getInvoiceTemplate(templateId);
  if (!template.isPremium) return false;
  return !isTemplateUnlocked(template.id);
}
