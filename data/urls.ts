import { siteConfig } from "@/data/site";

/** Absolute canonical URL for a path — no heavy seo module imports. */
export function getCanonicalUrl(path = ""): string {
  const base = siteConfig.url.replace(/\/$/, "");
  if (!path || path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
