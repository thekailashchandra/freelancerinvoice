/** Reject open redirects and non-app paths (//evil.com, \\, javascript:, etc.). */
export function isSafeAppRedirect(path: string | null | undefined): path is string {
  if (!path?.trim()) return false;
  const value = path.trim();
  if (!value.startsWith("/")) return false;
  if (value.startsWith("//")) return false;
  if (value.startsWith("/\\")) return false;
  if (value.includes("\\")) return false;
  if (/^\/[a-z]+:/i.test(value)) return false;
  return true;
}

export function safeAppRedirect(
  path: string | null | undefined,
  fallback = "/dashboard"
): string {
  return isSafeAppRedirect(path) ? path : fallback;
}
