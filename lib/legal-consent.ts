import { PRIVACY_POLICY_VERSION } from "@/data/privacy-policy";
import { TERMS_VERSION } from "@/data/terms-of-service";

export { PRIVACY_POLICY_VERSION, TERMS_VERSION };

export type LegalConsentProfile = {
  privacy_policy_accepted_at?: string | null;
  privacy_policy_version?: string | null;
  terms_accepted_at?: string | null;
  terms_version?: string | null;
};

export type OutstandingLegalUpdates = {
  privacy: boolean;
  terms: boolean;
};

export function needsPrivacyPolicyConsent(
  profile: LegalConsentProfile | null | undefined
): boolean {
  if (!profile?.privacy_policy_accepted_at) return true;
  return profile.privacy_policy_version !== PRIVACY_POLICY_VERSION;
}

export function needsTermsConsent(
  profile: LegalConsentProfile | null | undefined
): boolean {
  if (!profile?.terms_accepted_at) return true;
  return profile.terms_version !== TERMS_VERSION;
}

export function getOutstandingLegalUpdates(
  profile: LegalConsentProfile | null | undefined
): OutstandingLegalUpdates {
  return {
    privacy: needsPrivacyPolicyConsent(profile),
    terms: needsTermsConsent(profile),
  };
}

export function needsLegalConsent(
  profile: LegalConsentProfile | null | undefined
): boolean {
  const updates = getOutstandingLegalUpdates(profile);
  return updates.privacy || updates.terms;
}

export type LegalConsentPayload = {
  privacyPolicyAccepted: boolean;
  termsAccepted: boolean;
  privacyPolicyVersion?: string;
  termsVersion?: string;
};

export function isLegalConsentValid(
  payload: LegalConsentPayload | null | undefined
): boolean {
  return (
    payload?.privacyPolicyAccepted === true && payload?.termsAccepted === true
  );
}

export function describeOutstandingUpdates(
  updates: OutstandingLegalUpdates
): string {
  if (updates.privacy && updates.terms) {
    return "Privacy Policy and Terms of Service";
  }
  if (updates.privacy) return "Privacy Policy";
  return "Terms of Service";
}
