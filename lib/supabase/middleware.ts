import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabasePublishableEnv, isSupabaseConfigured } from "@/lib/supabase/env";
import { supabaseCookieOptions } from "@/lib/supabase/cookie-options";
import { ensureProfile } from "@/lib/supabase/ensure-profile";

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/create-invoice",
  "/invoice-history",
  "/settings",
  "/onboarding",
  "/create",
  "/history",
];

const AUTH_ROUTES = ["/login", "/signup"];

function isServerActionRequest(request: NextRequest): boolean {
  return (
    request.headers.has("next-action") ||
    request.headers.has("Next-Action") ||
    request.headers.has("x-action")
  );
}

export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Auth pages + server-action POSTs must not run Supabase in Edge middleware
  // (can break signup/login RPC with "fetch failed" on Windows/Edge).
  if (
    isServerActionRequest(request) ||
    AUTH_ROUTES.some((p) => pathname === p || pathname.startsWith(`${p}/`))
  ) {
    return NextResponse.next({ request });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.next({ request });
  }

  try {
    const { url, publishableKey } = getSupabasePublishableEnv();
    let supabaseResponse = NextResponse.next({ request });

    const supabase = createServerClient(url, publishableKey, {
      cookieOptions: supabaseCookieOptions,
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const isProtected = PROTECTED_PREFIXES.some(
      (p) => pathname === p || pathname.startsWith(`${p}/`)
    );

    if (!user && isProtected) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/login";
      redirectUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(redirectUrl);
    }

    if (user && isProtected && pathname !== "/onboarding") {
      const profile = await ensureProfile(supabase, user);

      if (!profile?.company_name) {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = "/onboarding";
        return NextResponse.redirect(redirectUrl);
      }
    }

    if (user && pathname === "/onboarding") {
      const profile = await ensureProfile(supabase, user);

      if (profile?.company_name) {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = "/dashboard";
        return NextResponse.redirect(redirectUrl);
      }
    }

    return supabaseResponse;
  } catch (err) {
    console.error("middleware session update failed:", err);
    return NextResponse.next({ request });
  }
}
