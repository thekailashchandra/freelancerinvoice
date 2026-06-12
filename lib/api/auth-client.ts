export type AuthApiResult =
  | { ok: true; redirect: string }
  | { ok: false; error: string };

export async function signUpClient(
  email: string,
  password: string
): Promise<AuthApiResult> {
  const res = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  return (await res.json()) as AuthApiResult;
}

export async function signInClient(
  email: string,
  password: string
): Promise<AuthApiResult> {
  const res = await fetch("/api/auth/signin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  return (await res.json()) as AuthApiResult;
}

export function markEnteringApp() {
  document.cookie = "iff_entering=1; path=/; max-age=20; samesite=lax";
}
