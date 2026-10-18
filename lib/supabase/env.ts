/**
 * Supabase env helpers.
 * Client + user-scoped server code use the publishable key (RLS).
 * Admin/service code uses the secret key via createAdminClient().
 *
 * Use dynamic `process.env[key]` for NEXT_PUBLIC_* on the server so Next.js
 * does not bake stale placeholder URLs into `.next-dev` after .env.local changes.
 */

const PUBLISHABLE_URL_KEY = "NEXT_PUBLIC_SUPABASE_URL";
const PUBLISHABLE_KEY_KEY = "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY";
const SECRET_KEY_KEY = "SUPABASE_SECRET_KEY";
const GOOGLE_CLIENT_ID_KEY = "NEXT_PUBLIC_GOOGLE_CLIENT_ID";

const PLACEHOLDER_HOSTS = new Set([
  "example.supabase.co",
  "your-project.supabase.co",
]);

function readEnv(key: string): string | undefined {
  return process.env[key]?.trim() || undefined;
}

function assertNotPlaceholderUrl(url: string): void {
  let host: string;
  try {
    host = new URL(url).hostname;
  } catch {
    return;
  }

  if (!PLACEHOLDER_HOSTS.has(host)) return;

  throw new Error(
    `${PUBLISHABLE_URL_KEY} is set to a placeholder (${host}). ` +
      "Windows or your terminal may be overriding .env.local. " +
      "Remove NEXT_PUBLIC_SUPABASE_* from System Environment Variables, " +
      "close all terminals, then run: npm run dev:clean"
  );
}

function missingVarsMessage(): string {
  return [
    "Supabase is not configured.",
    "Copy .env.example to .env.local and set:",
    `  ${PUBLISHABLE_URL_KEY}`,
    `  ${PUBLISHABLE_KEY_KEY}`,
    `  ${SECRET_KEY_KEY} (server only)`,
    "Then restart: npm run dev:clean",
  ].join("\n");
}

export function isSupabaseConfigured(): boolean {
  return Boolean(readEnv(PUBLISHABLE_URL_KEY) && readEnv(PUBLISHABLE_KEY_KEY));
}

export function isSupabaseServerConfigured(): boolean {
  return isSupabaseConfigured() && Boolean(readEnv(SECRET_KEY_KEY));
}

const PLACEHOLDER_GOOGLE_CLIENT_IDS = new Set([
  "your-client-id.apps.googleusercontent.com",
  "your-google-client-id.apps.googleusercontent.com",
]);

/** Same Client ID as Supabase → Authentication → Google (public, safe in browser). */
export function getGoogleClientId(): string | undefined {
  const clientId = readEnv(GOOGLE_CLIENT_ID_KEY);
  if (!clientId || PLACEHOLDER_GOOGLE_CLIENT_IDS.has(clientId)) {
    return undefined;
  }
  return clientId;
}

export function isGoogleAuthConfigured(): boolean {
  return Boolean(getGoogleClientId());
}

/** Publishable key - safe for browser and cookie-based SSR (RLS applies). */
export function getSupabasePublishableEnv(): {
  url: string;
  publishableKey: string;
} {
  const rawUrl = readEnv(PUBLISHABLE_URL_KEY);
  const publishableKey = readEnv(PUBLISHABLE_KEY_KEY);

  const url = rawUrl?.replace(/\/$/, "");

  if (!url || !publishableKey) {
    throw new Error(missingVarsMessage());
  }

  assertNotPlaceholderUrl(url);

  return { url, publishableKey };
}

/** Secret key - server-only; bypasses RLS. Use sparingly. */
export function getSupabaseSecretEnv(): { url: string; secretKey: string } {
  const url = readEnv(PUBLISHABLE_URL_KEY);
  const secretKey = readEnv(SECRET_KEY_KEY);

  if (!url || !secretKey) {
    throw new Error(
      `Missing ${PUBLISHABLE_URL_KEY} or ${SECRET_KEY_KEY} for admin client.`
    );
  }

  assertNotPlaceholderUrl(url);

  return { url, secretKey };
}

/** Dev-only: detect wrong project URL baked into an old build. */
export function getSupabaseUrlHost(): string | null {
  try {
    const { url } = getSupabasePublishableEnv();
    return new URL(url).hostname;
  } catch {
    return null;
  }
}
