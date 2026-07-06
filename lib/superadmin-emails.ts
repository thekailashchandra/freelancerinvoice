/** Comma-separated in SUPERADMIN_EMAILS (server only). */
export function getSuperadminEmails(): string[] {
  const raw = process.env.SUPERADMIN_EMAILS?.trim();
  if (!raw) return [];
  return [
    ...new Set(
      raw
        .split(",")
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean)
    ),
  ];
}

export function isSuperadminEmail(
  email: string | null | undefined
): boolean {
  if (!email?.trim()) return false;
  return getSuperadminEmails().includes(email.trim().toLowerCase());
}
