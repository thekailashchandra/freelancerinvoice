import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { needsLegalConsent } from "@/lib/legal-consent";

export async function POST(request: NextRequest) {
  try {
    const { email } = (await request.json()) as { email?: string };
    const trimmed = email?.trim().toLowerCase();

    if (!trimmed) {
      return NextResponse.json(
        { ok: false, error: "Email is required." },
        { status: 400 }
      );
    }

    const admin = createAdminClient();

    const { data: profile } = await admin
      .from("profiles")
      .select(
        "privacy_policy_accepted_at, privacy_policy_version, terms_accepted_at, terms_version"
      )
      .ilike("email", trimmed)
      .maybeSingle();

    if (!profile) {
      return NextResponse.json({ ok: true, required: true });
    }

    return NextResponse.json({
      ok: true,
      required: needsLegalConsent(profile),
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Could not check consent status." },
      { status: 500 }
    );
  }
}
