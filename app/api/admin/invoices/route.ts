import { NextRequest, NextResponse } from "next/server";
import { requireSuperadmin } from "@/lib/superadmin-access";
import { fetchAdminInvoices } from "@/lib/superadmin-repository";

export async function GET(request: NextRequest) {
  try {
    await requireSuperadmin();
    const { searchParams } = request.nextUrl;
    const page = Number(searchParams.get("page") ?? "1");
    const status = searchParams.get("status") ?? undefined;

    const result = await fetchAdminInvoices({ page, status });
    return NextResponse.json(result);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to load invoices";
    const status = message === "Forbidden" ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
