import type { SupabaseClient } from "@supabase/supabase-js";
import type { User } from "@supabase/supabase-js";

/** Ensures a profiles row exists for the user (e.g. if trigger did not run). */
export async function ensureProfile(
  supabase: SupabaseClient,
  user: User
): Promise<{ company_name: string | null } | null> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("company_name")
    .eq("id", user.id)
    .maybeSingle();

  if (profile) return profile;

  const { data: created, error } = await supabase
    .from("profiles")
    .insert({
      id: user.id,
      email: user.email ?? null,
    })
    .select("company_name")
    .single();

  if (error) {
    console.error("ensureProfile insert failed:", error.message);
    return null;
  }

  return created;
}
