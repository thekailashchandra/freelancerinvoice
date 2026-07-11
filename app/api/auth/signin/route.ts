import { createServerClient } from "@supabase/ssr";
import { getSupabasePublishableEnv } from "@/lib/supabase/env";
import { supabaseCookieOptions } from "@/lib/supabase/cookie-options";
import { formatAuthError } from "@/lib/supabase/auth-errors";
import { ensureProfile } from "@/lib/supabase/ensure-profile";
import { needsLegalConsent, isLegalConsentValid } from "@/lib/legal-consent";
import { recordLegalConsentForUser } from "@/lib/legal-consent-server";
import { PRIVACY_POLICY_VERSION } from "@/data/privacy-policy";
import { TERMS_VERSION } from "@/data/terms-of-service";
import { NextRequest, NextResponse } from "next/server";

type CookieToSet = {
  name: string;
  value: string;
  options?: Parameters<NextResponse["cookies"]["set"]>[2];
};

export async function POST(request: NextRequest) {
  try {
    const { email, password, privacyPolicyAccepted, privacyPolicyVersion, termsAccepted, termsVersion } =
      (await request.json()) as {
      email?: string;
      password?: string;
      privacyPolicyAccepted?: boolean;
      privacyPolicyVersion?: string;
      termsAccepted?: boolean;
      termsVersion?: string;
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

      if (
        needsLegalConsent(profile) &&
        isLegalConsentValid({
          privacyPolicyAccepted: privacyPolicyAccepted === true,
          termsAccepted: termsAccepted === true,
          privacyPolicyVersion,
          termsVersion,
        })
      ) {
        const consentResult = await recordLegalConsentForUser(
          supabase,
          data.user.id,
          {
            privacyPolicyVersion:
              privacyPolicyVersion?.trim() || PRIVACY_POLICY_VERSION,
            termsVersion: termsVersion?.trim() || TERMS_VERSION,
          }
        );
        if (!consentResult.ok) {
          return NextResponse.json(
            {
              ok: false,
              error:
                "Signed in but legal consent could not be saved. Please try again.",
            },
            { status: 500 }
          );
        }
      }

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
