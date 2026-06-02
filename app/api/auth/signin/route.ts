import { createServerClient } from "@supabase/ssr";
import { getSupabasePublishableEnv } from "@/lib/supabase/env";
import { supabaseCookieOptions } from "@/lib/supabase/cookie-options";
import { formatAuthError } from "@/lib/supabase/auth-errors";
import { ensureProfile } from "@/lib/supabase/ensure-profile";
import { NextRequest, NextResponse } from "next/server";

type CookieToSet = {
  name: string;
  value: string;
  options?: Parameters<NextResponse["cookies"]["set"]>[2];
};

export async function POST(request: NextRequest) {
  try {
    const { email, password } = (await request.json()) as {
      email?: string;
      password?: string;
    };

    if (!email?.trim() || !password) {
      return NextResponse.json(
        { ok: false, error: "Email and password are required." },
        { status: 400 }
      );
    }

    const { url, publishableKey } = getSupabasePublishableEnv();
    const cookieJar: CookieToSet[] = [];

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

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      return NextResponse.json(
        { ok: false, error: formatAuthError(error) },
        { status: 400 }
      );
    }

    let redirect = "/dashboard";
    if (data.user) {
      const profile = await ensureProfile(supabase, data.user);
      if (!profile?.company_name) redirect = "/onboarding";
    }

    const response = NextResponse.json({ ok: true, redirect });
    cookieJar.forEach(({ name, value, options }) =>
      response.cookies.set(name, value, options)
    );

    return response;
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: formatAuthError(err) },
      { status: 500 }
    );
  }
}
