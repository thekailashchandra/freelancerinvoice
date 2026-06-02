import { AuthError } from "@supabase/supabase-js";

export function formatAuthError(error: unknown): string {
  if (error instanceof AuthError) {
    if (error.status === 429 || error.message.includes("rate limit")) {
      return (
        "Too many signup attempts. Wait a few minutes and try again, or sign in " +
        "if you already created an account."
      );
    }
    if (
      error.message.toLowerCase().includes("already registered") ||
      error.message.toLowerCase().includes("already been registered") ||
      error.message.toLowerCase().includes("user already")
    ) {
      return "An account with this email already exists. Please sign in.";
    }
    return error.message;
  }

  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    if (
      msg === "failed to fetch" ||
      msg === "fetch failed" ||
      msg.includes("network") ||
      msg.includes("fetch") ||
      msg.includes("enotfound")
    ) {
      return (
        "Could not reach Supabase. Confirm .env.local has your real project URL " +
        "(not a placeholder), then run npm run dev:clean and try again."
      );
    }
    if (msg.includes("rate limit")) {
      return "Too many attempts. Please wait a few minutes and try again.";
    }
    return error.message;
  }

  return "Authentication failed. Please try again.";
}
