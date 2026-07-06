import { NextResponse } from "next/server";
import { logActivity } from "@/lib/activity-log";
import { createClient } from "@/lib/supabase/server";

const ALLOWED_ACTIONS = new Set([
  "invoice.pdf_downloaded",
  "invoice.receipt_downloaded",
]);

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as {
      action?: string;
      resourceType?: string;
      resourceId?: string;
      metadata?: Record<string, unknown>;
    };

    if (!body.action || !ALLOWED_ACTIONS.has(body.action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    await logActivity({
      actorId: user.id,
      action: body.action,
      resourceType: body.resourceType,
      resourceId: body.resourceId,
      metadata: body.metadata,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to log activity" },
      { status: 500 }
    );
  }
}
