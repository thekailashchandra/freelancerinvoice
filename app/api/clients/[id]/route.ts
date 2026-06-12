import { NextResponse } from "next/server";
import { fetchClientDetail } from "@/lib/clients-repository";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const detail = await fetchClientDetail(id);
    if (!detail) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }
    return NextResponse.json(detail);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load customer" },
      { status: 500 }
    );
  }
}
