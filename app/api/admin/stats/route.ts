import { NextResponse } from "next/server";
import { logActivity } from "@/lib/activity-log";
import { requireSuperadmin } from "@/lib/superadmin-access";
import { fetchPlatformStats } from "@/lib/superadmin-repository";

export async function GET() {
  try {
    const user = await requireSuperadmin();
    await logActivity({
      actorId: user.id,
      action: "superadmin.view",
      resourceType: "stats",
    });
    const stats = await fetchPlatformStats();
    return NextResponse.json(stats);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load stats";
    const status = message === "Forbidden" ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
