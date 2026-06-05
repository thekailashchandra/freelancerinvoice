import { createBrowserClient } from "@supabase/ssr";
import { getSupabasePublishableEnv } from "@/lib/supabase/env";
import { supabaseCookieOptions } from "@/lib/supabase/cookie-options";

export type SupabaseBrowserConfig = {
  url: string;
  publishableKey: string;
};

export function createClient(config?: SupabaseBrowserConfig) {
  const { url, publishableKey } = config ?? getSupabasePublishableEnv();
  return createBrowserClient(url, publishableKey, {
    cookieOptions: supabaseCookieOptions,
  });
}
