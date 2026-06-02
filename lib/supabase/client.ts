import { createBrowserClient } from "@supabase/ssr";
import { getSupabasePublishableEnv } from "@/lib/supabase/env";
import { supabaseCookieOptions } from "@/lib/supabase/cookie-options";

export function createClient() {
  const { url, publishableKey } = getSupabasePublishableEnv();
  return createBrowserClient(url, publishableKey, {
    cookieOptions: supabaseCookieOptions,
  });
}
