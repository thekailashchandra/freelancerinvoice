import { siteConfig } from "@/data/site";

export function invoiceReceiptUrl(
  invoiceId: string,
  options?: { origin?: string; token?: string }
): string {
  const base =
    options?.origin?.replace(/\/$/, "") ??
    (typeof window !== "undefined" ? window.location.origin : siteConfig.url);
  const path = `${base}/receipt/${encodeURIComponent(invoiceId)}`;
  if (!options?.token) return path;
  const url = new URL(path);
  url.searchParams.set("token", options.token);
  return url.toString();
}
