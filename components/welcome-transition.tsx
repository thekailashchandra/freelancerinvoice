"use client";

import { useEffect, useState } from "react";
import { CalmLoader } from "@/components/calm-loader";
import { cn } from "@/lib/utils";

const COOKIE_NAME = "iff_entering";

function clearEnteringCookie() {
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`;
}

function hasEnteringCookie() {
  return document.cookie.split(";").some((c) => c.trim().startsWith(`${COOKIE_NAME}=`));
}

export function WelcomeTransition() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!hasEnteringCookie()) return;

    clearEnteringCookie();
    setShow(true);

    const timer = window.setTimeout(() => setShow(false), 1800);
    return () => window.clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[90] flex items-center justify-center bg-background/80 backdrop-blur-[2px]",
        "calm-overlay-enter"
      )}
      aria-live="polite"
      aria-label="Welcome, setting up your workspace"
    >
      <CalmLoader message="Welcome back — setting things up…" />
    </div>
  );
}
