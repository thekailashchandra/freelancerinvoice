"use client";

import { cn } from "@/lib/utils";

interface CalmLoaderProps {
  message?: string;
  size?: "sm" | "md";
  className?: string;
}

export function CalmLoader({
  message = "Loading…",
  size = "md",
  className,
}: CalmLoaderProps) {
  const dot = size === "sm" ? "h-1.5 w-1.5" : "h-2 w-2";

  return (
    <div
      className={cn("flex flex-col items-center gap-3 text-center", className)}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <div className="flex items-center gap-1.5" aria-hidden>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={cn("rounded-full bg-primary/70 calm-breathe", dot)}
            style={{ animationDelay: `${i * 0.18}s` }}
          />
        ))}
      </div>
      {message && (
        <p
          className={cn(
            "text-muted-foreground calm-fade",
            size === "sm" ? "text-xs" : "text-sm"
          )}
        >
          {message}
        </p>
      )}
    </div>
  );
}
