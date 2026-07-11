import { PRIVACY_POLICY_VERSION } from "@/data/privacy-policy";
import { TERMS_VERSION } from "@/data/terms-of-service";
import {
  needsLegalConsent,
  type LegalConsentProfile,
} from "@/lib/legal-consent";
import {
  formatConsentLawNames,
  formatConsentLawNotice,
  getApplicableDataLaws,
  getPrimaryDataLaw,
  type DataProtectionLaw,
} from "@/data/data-protection-laws";

export { PRIVACY_POLICY_VERSION, TERMS_VERSION };
export type { DataProtectionLaw };
export {
  getApplicableDataLaws,
  getPrimaryDataLaw,
  formatConsentLawNames,
  formatConsentLawNotice,
  formatSimpleRegionalConsent,
} from "@/data/data-protection-laws";

export type PrivacyConsentPayload = {
  privacyPolicyAccepted: boolean;
  privacyPolicyVersion?: string;
  termsAccepted?: boolean;
  termsVersion?: string;
};

export type PrivacyConsentProfile = LegalConsentProfile;

/** @deprecated Use getApplicableDataLaws instead. */
export function requiresDpdpConsent(
  countryCode: string | null | undefined
): boolean {
  return getApplicableDataLaws(countryCode).some((law) => law.id === "dpdp");
}

export function hasRegionalLawNotice(
  countryCode: string | null | undefined
): boolean {
  return getPrimaryDataLaw(countryCode).id !== "general";
}

export function privacyConsentRequiredMessage(
  countryCode: string | null | undefined
): string {
  return `You must accept the Terms, Privacy Policy, and ${formatConsentLawNotice(countryCode)} before continuing.`;
}

/** True when privacy or terms need (re-)acceptance. */
export function needsPrivacyConsent(
  profile: PrivacyConsentProfile | null | undefined
): boolean {
  return needsLegalConsent(profile);
}

export function isPrivacyConsentValid(
  payload: PrivacyConsentPayload | null | undefined
): boolean {
  return (
    payload?.privacyPolicyAccepted === true && payload?.termsAccepted !== false
  );
}

const LOCAL_LEGAL_CONSENT_KEY = "iff-legal-consent-version";

export function hasLocalPrivacyConsentAck(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const stored = localStorage.getItem(LOCAL_LEGAL_CONSENT_KEY);
    return stored === `${PRIVACY_POLICY_VERSION}:${TERMS_VERSION}`;
  } catch {
    return false;
  }
}

export function markLocalPrivacyConsentAck(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      LOCAL_LEGAL_CONSENT_KEY,
      `${PRIVACY_POLICY_VERSION}:${TERMS_VERSION}`
    );
  } catch {
    // ignore quota / private mode
  }
}

export async function recordPrivacyConsentClient(): Promise<{
  ok: boolean;
  error?: string;
}> {
  const res = await fetch("/api/auth/legal-consent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      privacyPolicyAccepted: true,
      termsAccepted: true,
      privacyPolicyVersion: PRIVACY_POLICY_VERSION,
      termsVersion: TERMS_VERSION,
    }),
  });

  const result = (await res.json()) as { ok: boolean; error?: string };
  if (result.ok) {
    markLocalPrivacyConsentAck();
  }
  return result;
}
