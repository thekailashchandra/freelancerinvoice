const STALE_ACTION_RELOAD_KEY = "iff-stale-server-action-reload";

/** Client bundle action ID no longer matches the running dev server. */
export function isStaleServerActionError(err: unknown): boolean {
  const message = err instanceof Error ? err.message : String(err);
  return /server action.*not found|failed to find server action|unrecognizedactionerror|cannot read properties of undefined \(reading 'call'\)|chunkloaderror|loading chunk \d+ failed/i.test(
    message
  );
}

export function clearStaleServerActionReloadFlag(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(STALE_ACTION_RELOAD_KEY);
}

/**
 * After a dev rebuild/restart the browser may POST an old action id.
 * Reload once so the client picks up the current server manifest.
 */
export function handleStaleServerActionError(err: unknown): boolean {
  if (!isStaleServerActionError(err)) return false;
  if (typeof window === "undefined") return true;

  const lastReload = Number(
    sessionStorage.getItem("iff-stale-reload-ts") || 0
  );
  if (Date.now() - lastReload < 2500) return true;

  sessionStorage.setItem("iff-stale-reload-ts", String(Date.now()));
  sessionStorage.removeItem(STALE_ACTION_RELOAD_KEY);

  const url = new URL(window.location.href);
  url.searchParams.set("_iff", String(Date.now()));
  window.location.replace(url.toString());
  return true;
}
