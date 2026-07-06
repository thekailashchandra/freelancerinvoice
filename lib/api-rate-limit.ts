import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, type RateLimitBucket } from "@/lib/rate-limit";

const RULES: ReadonlyArray<{
  method: string;
  path: string;
  bucket: RateLimitBucket;
}> = [
  { method: "POST", path: "/api/auth/signin", bucket: "auth" },
  { method: "POST", path: "/api/auth/signup", bucket: "auth" },
  { method: "POST", path: "/api/support", bucket: "support" },
  { method: "POST", path: "/api/locale", bucket: "locale" },
  { method: "POST", path: "/api/profile/assets", bucket: "upload" },
];

export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const ip = forwarded.split(",")[0]?.trim();
    if (ip) return ip;
  }

  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;

  return "127.0.0.1";
}

/** Returns a 429 response when limited, otherwise null. */
export async function applyApiRateLimit(
  request: NextRequest
): Promise<NextResponse | null> {
  const { pathname } = request.nextUrl;
  const rule = RULES.find(
    (entry) => entry.method === request.method && entry.path === pathname
  );
  if (!rule) return null;

  const result = await checkRateLimit(`${rule.bucket}:${getClientIp(request)}`, rule.bucket);

  if (result.success) return null;

  const retryAfterSec = Math.max(1, Math.ceil((result.reset - Date.now()) / 1000));

  return NextResponse.json(
    { error: "Too many requests. Please try again later." },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfterSec),
        "X-RateLimit-Limit": String(result.limit),
        "X-RateLimit-Remaining": "0",
        "X-RateLimit-Reset": String(result.reset),
      },
    }
  );
}
