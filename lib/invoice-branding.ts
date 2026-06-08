import { siteConfig } from "@/data/site";
import { invoiceDesign } from "@/lib/invoice-design";

export const invoiceBrandingLabel = "InvoiceForFreelance.com";

export const invoiceBrandingText = `Powered by ${invoiceBrandingLabel}`;

export const invoiceBrandingUrl = siteConfig.url;

export function shouldShowInvoiceBranding(hideBranding?: boolean): boolean {
  return !hideBranding;
}

export function invoicePoweredByHtml(pinned = true): string {
  const d = invoiceDesign;
  const F = d.pdfFont;
  const marginTop = pinned ? "auto" : "28px";
  return `<div style="margin-top:${marginTop};padding-top:12px;border-top:1px solid ${d.colors.border};text-align:center;font-family:${F};flex-shrink:0">
    <p style="margin:0;font-size:10px;line-height:14px;letter-spacing:0.02em;color:${d.colors.textMuted}">
      Powered by <span style="color:${d.colors.textSecondary};font-weight:500">${invoiceBrandingLabel}</span>
    </p>
  </div>`;
}
