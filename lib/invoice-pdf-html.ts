import type { Invoice } from "@/types/invoice";
import { resolveTemplateDesign } from "@/lib/invoice-templates";
import { buildClassicInvoicePdfHtml } from "@/lib/invoice-pdf-html-classic";
import { buildModernInvoicePdfHtml } from "@/lib/invoice-pdf-html-modern";
import { buildMinimalInvoicePdfHtml } from "@/lib/invoice-pdf-html-minimal";
import { buildBoldInvoicePdfHtml } from "@/lib/invoice-pdf-html-bold";

export function buildInvoicePdfHtml(invoice: Invoice): string {
  const d = resolveTemplateDesign(
    invoice.templateId ?? "classic",
    invoice.company.brandColor
  );
  if (
    d.layout === "corporate" ||
    d.layout === "studio" ||
    d.layout === "geometric" ||
    d.layout === "swiss"
  ) {
    // Signature layouts are captured from the live preview so the PDF matches
    // the on-screen brand colors and layout exactly.
    throw new Error("Use the live preview renderer for this template.");
  }
  if (d.layout === "modern") {
    return buildModernInvoicePdfHtml(invoice);
  }
  if (d.layout === "minimal") {
    return buildMinimalInvoicePdfHtml(invoice);
  }
  if (d.layout === "bold") {
    return buildBoldInvoicePdfHtml(invoice);
  }
  return buildClassicInvoicePdfHtml(invoice);
}
