import { NextResponse } from "next/server";
import { deleteClient, fetchClientDetail } from "@/lib/clients-repository";

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

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const detail = await fetchClientDetail(id);
    if (!detail) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }
    await deleteClient(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to delete customer" },
      { status: 500 }
    );
  }
}
