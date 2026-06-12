import { siteConfig } from "@/data/site";

export function invoiceReceiptUrl(invoiceId: string, origin?: string): string {
  const base =
    origin ??
    (typeof window !== "undefined" ? window.location.origin : siteConfig.url);
  return `${base}/receipt/${encodeURIComponent(invoiceId)}`;
}
