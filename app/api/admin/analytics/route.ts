import { NextResponse } from "next/server";
import { requireSuperadmin } from "@/lib/superadmin-access";
import { fetchExternalAnalytics } from "@/lib/umami-analytics";

export async function GET() {
  try {
    await requireSuperadmin();
    const analytics = await fetchExternalAnalytics();
    return NextResponse.json(analytics);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to load analytics";
    const status = message === "Forbidden" ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
