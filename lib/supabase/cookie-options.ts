/** Shared auth cookie settings — `secure: false` required for http://localhost */
export const supabaseCookieOptions = {
  path: "/",
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
};
