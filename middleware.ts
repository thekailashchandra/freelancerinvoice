import { type NextRequest, NextResponse } from "next/server";
import { applyGeoCookies } from "@/lib/geo-routing";
import { updateSession } from "@/lib/supabase/middleware";

/** App pages migrated to API routes — block stale Server Action POSTs in dev. */
const DEV_API_ONLY_PREFIXES = [
  "/dashboard",
  "/create-invoice",
  "/invoice-history",
  "/customers",
  "/settings",
  "/onboarding",
  "/support",
  "/signup",
  "/login",
];

function isServerActionRequest(request: NextRequest): boolean {
  return (
    request.method === "POST" &&
    (request.headers.has("next-action") ||
      request.headers.has("Next-Action") ||
      request.headers.has("x-action"))
  );
}

function blockStaleDevServerAction(request: NextRequest): NextResponse | null {
  if (process.env.NODE_ENV !== "development") return null;
  if (!isServerActionRequest(request)) return null;

  const pathname = request.nextUrl.pathname;
  const isApiOnlyRoute = DEV_API_ONLY_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (!isApiOnlyRoute) return null;

  return NextResponse.json(
    {
      error:
        "Stale client bundle — this page no longer uses Server Actions. Reloading…",
    },
    {
      status: 410,
      headers: {
        "Cache-Control": "no-store",
        "X-IFF-Stale-Action": "1",
      },
    }
  );
}

function applyDevNoStore(response: Response) {
  if (process.env.NODE_ENV === "development") {
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, max-age=0"
    );
  }
  return response;
}

export async function middleware(request: NextRequest) {
  const blocked = blockStaleDevServerAction(request);
  if (blocked) return applyDevNoStore(blocked);

  const response = await updateSession(request);
  return applyDevNoStore(applyGeoCookies(request, response));
}

export const config = {
  matcher: [
    "/((?!api/|_next/static|_next/image|favicon.ico|icon|apple-icon|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
