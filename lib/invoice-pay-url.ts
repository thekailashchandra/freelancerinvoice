import { siteConfig } from "@/data/site";

export function invoicePayUrl(invoiceId: string, origin?: string): string {
  const base =
    origin ??
    (typeof window !== "undefined" ? window.location.origin : siteConfig.url);
  return `${base}/pay/${encodeURIComponent(invoiceId)}`;
}
