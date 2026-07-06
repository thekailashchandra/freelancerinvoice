import type {
  ExternalAnalytics,
  UmamiPageviewPoint,
  UmamiStats,
} from "@/types/superadmin";
import { gaMeasurementId } from "@/data/analytics";

function umamiConfigured(): boolean {
  const base = Boolean(
    process.env.UMAMI_API_URL?.trim() && process.env.UMAMI_WEBSITE_ID?.trim()
  );
  if (!base) return false;
  return Boolean(
    process.env.UMAMI_API_TOKEN?.trim() ||
      (process.env.UMAMI_USERNAME?.trim() &&
        process.env.UMAMI_PASSWORD?.trim())
  );
}

let cachedLoginToken: string | null = null;
let cachedLoginTokenAt = 0;
const LOGIN_TOKEN_TTL_MS = 55 * 60 * 1000;

async function getUmamiBearerToken(apiUrl: string): Promise<string | null> {
  const staticToken = process.env.UMAMI_API_TOKEN?.trim();
  if (staticToken) return staticToken;

  const username = process.env.UMAMI_USERNAME?.trim();
  const password = process.env.UMAMI_PASSWORD?.trim();
  if (!username || !password) return null;

  const now = Date.now();
  if (cachedLoginToken && now - cachedLoginTokenAt < LOGIN_TOKEN_TTL_MS) {
    return cachedLoginToken;
  }

  try {
    const res = await fetch(`${apiUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { token?: string };
    if (!data.token) return null;
    cachedLoginToken = data.token;
    cachedLoginTokenAt = now;
    return cachedLoginToken;
  } catch {
    return null;
  }
}

async function umamiFetch<T>(path: string, retry = true): Promise<T | null> {
  const apiUrl = process.env.UMAMI_API_URL?.trim().replace(/\/$/, "");
  if (!apiUrl) return null;

  const token = await getUmamiBearerToken(apiUrl);
  if (!token) return null;

  try {
    const res = await fetch(`${apiUrl}${path}`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 300 },
    });
    if (res.status === 401 && retry && !process.env.UMAMI_API_TOKEN?.trim()) {
      cachedLoginToken = null;
      cachedLoginTokenAt = 0;
      return umamiFetch<T>(path, false);
    }
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function fetchExternalAnalytics(): Promise<ExternalAnalytics> {
  const websiteId = process.env.UMAMI_WEBSITE_ID?.trim();
  const umamiUrl = process.env.UMAMI_API_URL?.trim().replace(/\/$/, "");
  const configured = umamiConfigured();

  const endAt = Date.now();
  const startAt = endAt - 7 * 24 * 60 * 60 * 1000;

  let stats: UmamiStats | null = null;
  let pageviews: UmamiPageviewPoint[] = [];

  if (configured && websiteId) {
    const query = `startAt=${startAt}&endAt=${endAt}&unit=day`;
    stats = await umamiFetch<UmamiStats>(
      `/api/websites/${websiteId}/stats?${query}`
    );
    const series = await umamiFetch<{ pageviews: UmamiPageviewPoint[] }>(
      `/api/websites/${websiteId}/pageviews?${query}`
    );
    pageviews = series?.pageviews ?? [];
  }

  const measurementId = gaMeasurementId();
  const gaConfigured = Boolean(measurementId);

  return {
    umami: {
      configured,
      stats,
      pageviews,
      dashboardUrl:
        umamiUrl && websiteId ? `${umamiUrl}/websites/${websiteId}` : null,
    },
    ga4: {
      configured: gaConfigured,
      measurementId: measurementId || null,
      dashboardUrl: gaConfigured
        ? "https://analytics.google.com/analytics/web/"
        : null,
    },
  };
}
