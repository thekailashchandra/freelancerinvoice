import { createAdminClient } from "@/lib/supabase/admin";

export type ActivityAction =
  | "user.signup"
  | "invoice.created"
  | "invoice.updated"
  | "invoice.deleted"
  | "invoice.status_changed"
  | "invoice.pdf_downloaded"
  | "invoice.receipt_downloaded"
  | "payment.completed"
  | "payment.failed"
  | "superadmin.view";

type LogActivityInput = {
  actorId?: string | null;
  action: ActivityAction | string;
  resourceType?: string;
  resourceId?: string;
  metadata?: Record<string, unknown>;
};

/** Fire-and-forget platform activity log (service role). */
export async function logActivity(input: LogActivityInput): Promise<void> {
  try {
    const admin = createAdminClient();
    await admin.from("activity_logs").insert({
      actor_id: input.actorId ?? null,
      action: input.action,
      resource_type: input.resourceType ?? null,
      resource_id: input.resourceId ?? null,
      metadata: input.metadata ?? {},
    });
  } catch (err) {
    console.error("activity log failed:", err);
  }
}
