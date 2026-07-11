import type { SupabaseClient } from "@supabase/supabase-js";
import type { User } from "@supabase/supabase-js";

export type EnsuredProfile = {
  company_name: string | null;
  privacy_policy_accepted_at?: string | null;
  privacy_policy_version?: string | null;
  terms_accepted_at?: string | null;
  terms_version?: string | null;
};

/** Ensures a profiles row exists for the user (e.g. if trigger did not run). */
export async function ensureProfile(
  supabase: SupabaseClient,
  user: User
): Promise<EnsuredProfile | null> {
  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "company_name, privacy_policy_accepted_at, privacy_policy_version, terms_accepted_at, terms_version"
    )
    .eq("id", user.id)
    .maybeSingle();

  if (profile) return profile;

  const { data: created, error } = await supabase
    .from("profiles")
    .insert({
      id: user.id,
      email: user.email ?? null,
    })
    .select(
      "company_name, privacy_policy_accepted_at, privacy_policy_version, terms_accepted_at, terms_version"
    )
    .single();

  if (error) {
    console.error("ensureProfile insert failed:", error.message);
    return null;
  }

  return created;
}
