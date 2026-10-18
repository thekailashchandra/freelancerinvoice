import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseServerConfigured } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Daily Vercel Cron request.
 *
 * Supabase free projects pause after a week without activity. A small
 * service-role query keeps the project active without exposing any rows.
 *
 * If CRON_SECRET is set, Vercel automatically sends it as a Bearer token.
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET?.trim();
  if (secret) {
    const authorization = request.headers.get("authorization");
    if (authorization !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  if (!isSupabaseServerConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Supabase is not configured." },
      { status: 503 }
    );
  }

  try {
    const admin = createAdminClient();
    const { error } = await admin
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .limit(1);

    if (error) throw new Error(error.message);

    return NextResponse.json({
      ok: true,
      checkedAt: new Date().toISOString(),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Supabase keepalive failed.";
    console.error("Supabase keepalive failed", message);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
