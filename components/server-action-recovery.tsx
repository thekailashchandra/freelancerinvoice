"use client";

import { useEffect } from "react";
import { handleStaleServerActionError } from "@/lib/server-action-error";

/** Backup recovery if inline dev guards miss a stale Server Action error. */
export function ServerActionRecovery() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    const onError = (event: ErrorEvent) => {
      const message = event.message ?? "";
      const fromError =
        event.error instanceof Error ? event.error.message : "";
      handleStaleServerActionError(new Error(message || fromError));
    };

    const onRejection = (event: PromiseRejectionEvent) => {
      handleStaleServerActionError(event.reason);
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);

    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  return null;
}
