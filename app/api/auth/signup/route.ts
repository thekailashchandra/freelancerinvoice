import { createServerClient } from "@supabase/ssr";
import { createAdminClient } from "@/lib/supabase/admin";
import { logActivity } from "@/lib/activity-log";
import { getSupabasePublishableEnv } from "@/lib/supabase/env";
import { supabaseCookieOptions } from "@/lib/supabase/cookie-options";
import { formatAuthError } from "@/lib/supabase/auth-errors";
import { ensureProfile } from "@/lib/supabase/ensure-profile";
import { isLegalConsentValid } from "@/lib/legal-consent";
import { privacyConsentRequiredMessage } from "@/lib/privacy-consent";
import { recordLegalConsentForUser } from "@/lib/legal-consent-server";
import { readConsentCountryFromRequest } from "@/lib/consent-country";
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

    if (
      !isLegalConsentValid({
        privacyPolicyAccepted: privacyPolicyAccepted === true,
        termsAccepted: termsAccepted === true,
        privacyPolicyVersion,
        termsVersion,
      })
    ) {
      return NextResponse.json(
        {
          ok: false,
          error: privacyConsentRequiredMessage(
            readConsentCountryFromRequest(request)
          ),
        },
        { status: 400 }
      );
    }

    if (!email?.trim() || !password) {
      return NextResponse.json(
        { ok: false, error: "Email and password are required." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { ok: false, error: "Password must be at least 6 characters." },
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

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
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

    if (data.user) {
      await ensureProfile(supabase, data.user);
      const consentResult = await recordLegalConsentForUser(
        admin,
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
              "Account created but privacy consent could not be saved. Please contact support.",
          },
          { status: 500 }
        );
      }
      void logActivity({
        actorId: data.user.id,
        action: "user.signup",
        metadata: { email: trimmedEmail },
      });
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
