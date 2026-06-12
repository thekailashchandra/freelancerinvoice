import type { CompanySettings } from "@/types/invoice";

async function parseProfileResponse(
  res: Response
): Promise<CompanySettings | null> {
  if (res.status === 401) return null;
  const data = await res.json();
  if (!res.ok) {
    throw new Error(
      typeof data?.error === "string" ? data.error : "Profile request failed"
    );
  }
  return data as CompanySettings;
}

/** Stable alternative to fetchProfileAction — avoids dev Server Action ID drift. */
export async function fetchProfileClient(): Promise<CompanySettings | null> {
  const res = await fetch("/api/profile", { cache: "no-store" });
  return parseProfileResponse(res);
}

/** Stable alternative to updateProfileAction — avoids dev Server Action ID drift. */
export async function updateProfileClient(
  settings: Partial<CompanySettings> & {
    companyName?: string;
    currencyCode?: string;
    taxLabel?: string;
  }
): Promise<CompanySettings | null> {
  const res = await fetch("/api/profile", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(settings),
  });
  return parseProfileResponse(res);
}
