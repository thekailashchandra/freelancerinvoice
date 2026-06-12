import { siteConfig } from "@/data/site";
import { invoiceDesign } from "@/lib/invoice-design";
import type { MarketRegion } from "@/lib/geo-market";

export const invoiceBrandingLabel = "InvoiceForFreelance.com";

export const invoiceBrandingText = `Powered by ${invoiceBrandingLabel}`;

export const invoiceBrandingUrl = siteConfig.url;

export const invoiceKofiTipUrl = siteConfig.supportTipUrl;

export type BrandingRemovalPricing = {
  market: MarketRegion;
  displayAmount: string;
};

export function getBrandingRemovalPricing(
  market: MarketRegion
): BrandingRemovalPricing {
  if (market === "IN") {
    return { market: "IN", displayAmount: "₹99" };
  }
  return { market: "GLOBAL", displayAmount: "$1" };
}

/** Hide footer when the user has confirmed a Ko-fi contribution. */
export function shouldShowInvoiceBranding(hideBranding?: boolean): boolean {
  return !hideBranding;
}

export function invoicePoweredByHtml(pinned = true): string {
  const d = invoiceDesign;
  const F = d.pdfFont;
  const marginTop = pinned ? "auto" : "28px";
  const kofiHost = invoiceKofiTipUrl.replace(/^https?:\/\//, "");
  return `<div style="margin-top:${marginTop};padding-top:12px;border-top:1px solid ${d.colors.border};text-align:center;font-family:${F};flex-shrink:0">
    <p style="margin:0;font-size:10px;line-height:14px;letter-spacing:0.02em;color:${d.colors.textMuted}">
      Powered by <span style="color:${d.colors.textSecondary};font-weight:500">${invoiceBrandingLabel}</span>
    </p>
    <p style="margin:4px 0 0;font-size:9px;line-height:12px;color:${d.colors.textMuted}">
      Enjoying this tool? Tip on Ko-fi · ${kofiHost}
    </p>
  </div>`;
}
