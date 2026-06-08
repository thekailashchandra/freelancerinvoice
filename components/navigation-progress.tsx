"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface NavigationProgressProps {
  pending: boolean;
}

export function NavigationProgress({ pending }: NavigationProgressProps) {
  const [visible, setVisible] = useState(false);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    if (pending) {
      setCompleting(false);
      setVisible(true);
      return;
    }

    if (!visible) return;

    setCompleting(true);
    const timer = window.setTimeout(() => {
      setVisible(false);
      setCompleting(false);
    }, 400);

    return () => window.clearTimeout(timer);
  }, [pending, visible]);

  if (!visible) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-14 z-[60] md:top-16"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Loading page"
    >
      <div className="h-[3px] w-full overflow-hidden bg-primary/20 shadow-sm">
        <div
          className={cn(
            "h-full bg-primary calm-progress-bar",
            completing && "calm-progress-complete"
          )}
        />
      </div>
    </div>
  );
}
