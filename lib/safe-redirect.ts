/** Reject open redirects and non-app paths (//evil.com, \\, javascript:, etc.). */
export function isSafeAppRedirect(path: string | null | undefined): path is string {
  const normalized = normalizeRedirectPath(path);
  return normalized !== null;
}

export function safeAppRedirect(
  path: string | null | undefined,
  fallback = "/dashboard"
): string {
  return normalizeRedirectPath(path) ?? fallback;
}

function normalizeRedirectPath(path: string | null | undefined): string | null {
  if (!path?.trim()) return null;

  let value = path.trim();

  for (let i = 0; i < 2; i++) {
    try {
      const decoded = decodeURIComponent(value);
      if (decoded === value) break;
      value = decoded;
    } catch {
      return null;
    }
  }

  if (!value.startsWith("/")) return null;
  if (value.startsWith("//")) return null;
  if (value.startsWith("/\\")) return null;
  if (value.includes("\\")) return null;
  if (/[\u0000-\u001F\u007F]/.test(value)) return null;
  if (/^\/[a-z][a-z0-9+.-]*:/i.test(value)) return null;
  if (value.startsWith("/@")) return null;

  return value;
}
