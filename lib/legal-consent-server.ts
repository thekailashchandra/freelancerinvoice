import type { SupabaseClient } from "@supabase/supabase-js";
import { PRIVACY_POLICY_VERSION } from "@/data/privacy-policy";
import { TERMS_VERSION } from "@/data/terms-of-service";
import { logActivity } from "@/lib/activity-log";
import {
  needsLegalConsent,
  type LegalConsentProfile,
} from "@/lib/legal-consent";

export async function recordLegalConsentForUser(
  supabase: SupabaseClient,
  userId: string,
  versions: {
    privacyPolicyVersion?: string;
    termsVersion?: string;
  } = {}
): Promise<{ ok: true } | { ok: false; error: string }> {
  const acceptedAt = new Date().toISOString();
  const privacyVersion =
    versions.privacyPolicyVersion?.trim() || PRIVACY_POLICY_VERSION;
  const termsVersion = versions.termsVersion?.trim() || TERMS_VERSION;

  const { error } = await supabase
    .from("profiles")
    .update({
      privacy_policy_accepted_at: acceptedAt,
      privacy_policy_version: privacyVersion,
      terms_accepted_at: acceptedAt,
      terms_version: termsVersion,
    })
    .eq("id", userId);

  if (error) {
    return { ok: false, error: error.message };
  }

  void logActivity({
    actorId: userId,
    action: "user.legal_consent",
    metadata: {
      privacyVersion,
      termsVersion,
      acceptedAt,
    },
  });

  return { ok: true };
}

/** @deprecated Use recordLegalConsentForUser */
export async function recordPrivacyConsentForUser(
  supabase: SupabaseClient,
  userId: string,
  version: string = PRIVACY_POLICY_VERSION
): Promise<{ ok: true } | { ok: false; error: string }> {
  return recordLegalConsentForUser(supabase, userId, {
    privacyPolicyVersion: version,
    termsVersion: TERMS_VERSION,
  });
}

export async function hasLegalConsent(
  supabase: SupabaseClient,
  userId: string
): Promise<boolean> {
  const { data } = await supabase
    .from("profiles")
    .select(
      "privacy_policy_accepted_at, privacy_policy_version, terms_accepted_at, terms_version"
    )
    .eq("id", userId)
    .maybeSingle();

  return !needsLegalConsent(data as LegalConsentProfile | null);
}
