import type { NextRequest } from "next/server";

const isProd = process.env.NODE_ENV === "production";

function umamiCspOrigin(): string | null {
  const raw =
    process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL?.trim() ||
    process.env.UMAMI_API_URL?.trim();
  if (!raw) return null;
  try {
    return new URL(raw).origin;
  } catch {
    return null;
  }
}

/** Security headers applied to all HTML/API responses. */
export function securityHeaders(): Record<string, string> {
  const umamiOrigin = umamiCspOrigin();
  const scriptSrc = [
    "'self'",
    "'unsafe-inline'",
    "'unsafe-eval'",
    "https://www.googletagmanager.com",
    "https://www.google-analytics.com",
    "https://pagead2.googlesyndication.com",
    "https://accounts.google.com",
    "https://checkout.razorpay.com",
    "https://apis.google.com",
    ...(umamiOrigin ? [umamiOrigin] : []),
  ].join(" ");
  const connectSrc = [
    "'self'",
    "https://*.supabase.co",
    "wss://*.supabase.co",
    "https://www.google-analytics.com",
    "https://region1.google-analytics.com",
    "https://pagead2.googlesyndication.com",
    "https://googleads.g.doubleclick.net",
    "https://api.razorpay.com",
    ...(umamiOrigin ? [umamiOrigin] : []),
  ].join(" ");

  const csp = [
    "default-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    `script-src ${scriptSrc}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https: *.supabase.co",
    "font-src 'self' data:",
    `connect-src ${connectSrc}`,
    "frame-src https://accounts.google.com https://checkout.razorpay.com https://googleads.g.doubleclick.net",
  ].join("; ");

  const headers: Record<string, string> = {
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    "Content-Security-Policy": csp,
  };

  if (isProd) {
    headers["Strict-Transport-Security"] =
      "max-age=63072000; includeSubDomains; preload";
  }

  return headers;
}

export function applySecurityHeaders(
  request: NextRequest,
  response: Response
): Response {
  const headers = securityHeaders();
  for (const [key, value] of Object.entries(headers)) {
    response.headers.set(key, value);
  }
  return response;
}
