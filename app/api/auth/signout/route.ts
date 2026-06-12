import { createServerClient } from "@supabase/ssr";
import { getSupabasePublishableEnv } from "@/lib/supabase/env";
import { supabaseCookieOptions } from "@/lib/supabase/cookie-options";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { url, publishableKey } = getSupabasePublishableEnv();
  const cookieJar: {
    name: string;
    value: string;
    options?: Parameters<NextResponse["cookies"]["set"]>[2];
  }[] = [];

  const supabase = createServerClient(url, publishableKey, {
    cookieOptions: supabaseCookieOptions,
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach((c) => cookieJar.push(c));
      },
    },
  });

  await supabase.auth.signOut();

  const response = NextResponse.json({ ok: true });
  cookieJar.forEach(({ name, value, options }) =>
    response.cookies.set(name, value, options)
  );
  return response;
}
