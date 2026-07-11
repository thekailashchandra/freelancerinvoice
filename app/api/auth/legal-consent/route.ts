import { NextRequest, NextResponse } from "next/server";
import { PRIVACY_POLICY_VERSION } from "@/data/privacy-policy";
import { TERMS_VERSION } from "@/data/terms-of-service";
import {
  getOutstandingLegalUpdates,
  isLegalConsentValid,
  needsLegalConsent,
  type LegalConsentProfile,
} from "@/lib/legal-consent";
import { recordLegalConsentForUser } from "@/lib/legal-consent-server";
import { privacyConsentRequiredMessage } from "@/lib/privacy-consent";
import { readConsentCountryFromRequest } from "@/lib/consent-country";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { ok: false, error: "You must be signed in." },
        { status: 401 }
      );
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select(
        "privacy_policy_accepted_at, privacy_policy_version, terms_accepted_at, terms_version"
      )
      .eq("id", user.id)
      .maybeSingle();

    const updates = getOutstandingLegalUpdates(profile as LegalConsentProfile);

    return NextResponse.json({
      ok: true,
      required: needsLegalConsent(profile as LegalConsentProfile),
      updates,
      versions: {
        privacy: PRIVACY_POLICY_VERSION,
        terms: TERMS_VERSION,
      },
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Could not load consent status." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      privacyPolicyAccepted?: boolean;
      termsAccepted?: boolean;
      privacyPolicyVersion?: string;
      termsVersion?: string;
    };

    if (
      !isLegalConsentValid({
        privacyPolicyAccepted: body.privacyPolicyAccepted === true,
        termsAccepted: body.termsAccepted === true,
        privacyPolicyVersion: body.privacyPolicyVersion,
        termsVersion: body.termsVersion,
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

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { ok: false, error: "You must be signed in." },
        { status: 401 }
      );
    }

    const result = await recordLegalConsentForUser(supabase, user.id, {
      privacyPolicyVersion: body.privacyPolicyVersion?.trim() || PRIVACY_POLICY_VERSION,
      termsVersion: body.termsVersion?.trim() || TERMS_VERSION,
    });

    if (!result.ok) {
      return NextResponse.json(
        { ok: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Could not save legal consent." },
      { status: 500 }
    );
  }
}
