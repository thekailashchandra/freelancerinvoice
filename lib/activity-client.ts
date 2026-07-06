import type { ActivityAction } from "@/lib/activity-log";

type TrackActivityInput = {
  action: ActivityAction | string;
  resourceType?: string;
  resourceId?: string;
  metadata?: Record<string, unknown>;
};

/** Client-side fire-and-forget activity tracking. */
export function trackActivity(input: TrackActivityInput): void {
  void fetch("/api/activity", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
    keepalive: true,
  }).catch(() => {
    /* non-blocking */
  });
}
