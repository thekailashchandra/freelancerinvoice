"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "iff:auth-rate-limit-until";

function readStoredBlockedUntil(): number | null {
  if (typeof sessionStorage === "undefined") return null;
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  const until = Number(raw);
  if (!Number.isFinite(until) || until <= Date.now()) {
    sessionStorage.removeItem(STORAGE_KEY);
    return null;
  }
  return until;
}

function storeBlockedUntil(until: number) {
  sessionStorage.setItem(STORAGE_KEY, String(until));
}

export function formatRateLimitMessage(retryAfterSec: number): string {
  if (retryAfterSec >= 60) {
    const minutes = Math.ceil(retryAfterSec / 60);
    return `Too many sign-in attempts. Try again in about ${minutes} minute${minutes === 1 ? "" : "s"}.`;
  }
  return `Too many sign-in attempts. Try again in ${retryAfterSec} second${retryAfterSec === 1 ? "" : "s"}.`;
}

export function useAuthRateLimit() {
  const [blockedUntil, setBlockedUntil] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    setBlockedUntil(readStoredBlockedUntil());
  }, []);

  useEffect(() => {
    if (!blockedUntil || now >= blockedUntil) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [blockedUntil, now]);

  useEffect(() => {
    if (blockedUntil && now >= blockedUntil) {
      setBlockedUntil(null);
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, [blockedUntil, now]);

  const isBlocked = blockedUntil !== null && now < blockedUntil;
  const retryAfterSec = isBlocked
    ? Math.max(1, Math.ceil((blockedUntil - now) / 1000))
    : 0;

  const applyCooldown = useCallback((retryAfterSec: number) => {
    const until = Date.now() + Math.max(1, retryAfterSec) * 1000;
    storeBlockedUntil(until);
    setBlockedUntil(until);
    setNow(Date.now());
  }, []);

  return {
    isBlocked,
    retryAfterSec,
    applyCooldown,
    message: isBlocked ? formatRateLimitMessage(retryAfterSec) : null,
  };
}
