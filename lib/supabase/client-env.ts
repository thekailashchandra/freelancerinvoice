/** Browser-safe Supabase/Google env helpers (no secret keys). */

const GOOGLE_CLIENT_ID_KEY = "NEXT_PUBLIC_GOOGLE_CLIENT_ID";

const PLACEHOLDER_GOOGLE_CLIENT_IDS = new Set([
  "your-client-id.apps.googleusercontent.com",
  "your-google-client-id.apps.googleusercontent.com",
]);

export function getGoogleClientId(): string | undefined {
  const clientId = process.env[GOOGLE_CLIENT_ID_KEY]?.trim();
  if (!clientId || PLACEHOLDER_GOOGLE_CLIENT_IDS.has(clientId)) {
    return undefined;
  }
  return clientId;
}
