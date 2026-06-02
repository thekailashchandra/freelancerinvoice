import { createServerClient } from "@supabase/ssr";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSupabasePublishableEnv } from "@/lib/supabase/env";
import { supabaseCookieOptions } from "@/lib/supabase/cookie-options";
import { formatAuthError } from "@/lib/supabase/auth-errors";
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

    const trimmedEmail = email.trim();
    const admin = createAdminClient();

    const { error: createError } = await admin.auth.admin.createUser({
      email: trimmedEmail,
      password,
      email_confirm: true,
    });

    if (createError) {
      return NextResponse.json(
        { ok: false, error: formatAuthError(createError) },
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

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: trimmedEmail,
      password,
    });

    if (signInError) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Account created but sign-in failed. Try logging in manually.",
        },
        { status: 400 }
      );
    }

    const response = NextResponse.json({
      ok: true,
      redirect: "/onboarding",
    });
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
