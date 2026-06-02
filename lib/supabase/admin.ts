import { createClient } from "@supabase/supabase-js";
import { getSupabaseSecretEnv } from "@/lib/supabase/env";

/** Service-role client — bypasses RLS. Use only in trusted server code. */
export function createAdminClient() {
  const { url, secretKey } = getSupabaseSecretEnv();
  return createClient(url, secretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
