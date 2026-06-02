import { siteConfig } from "@/data/site";

/**
 * Canonical app URL for auth redirects.
 * In development, always use localhost so Supabase redirect allow-list matches.
 */
export function getSiteUrl(): string {
  if (process.env.NODE_ENV === "development") {
    const port = process.env.PORT ?? "3000";
    return `http://localhost:${port}`;
  }

  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return siteConfig.url;
}

export function getAuthCallbackUrl(next = "/onboarding"): string {
  return `${getSiteUrl()}/auth/callback?next=${encodeURIComponent(next)}`;
}
