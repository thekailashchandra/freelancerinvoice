"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { handleStaleServerActionError } from "@/lib/server-action-error";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
    if (handleStaleServerActionError(error)) return;
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <h2 className="text-xl font-semibold">Something went wrong</h2>
      <p className="max-w-md text-sm text-muted-foreground">
        {error.message || "An unexpected error occurred."}
      </p>
      <div className="flex gap-2">
        <Button onClick={() => reset()}>Try again</Button>
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
        >
          Reload page
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        If this keeps happening, stop the dev server, delete the{" "}
        <code className="rounded bg-muted px-1">.next-dev</code> folder, and run{" "}
        <code className="rounded bg-muted px-1">npm run dev:clean</code> again.
      </p>
    </div>
  );
}
