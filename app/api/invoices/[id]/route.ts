import { NextResponse } from "next/server";
import {
  deleteInvoice,
  fetchInvoiceById,
  updateInvoiceStatus,
} from "@/lib/invoice-repository";
import type { Invoice } from "@/types/invoice";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const invoice = await fetchInvoiceById(id);
    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }
    return NextResponse.json(invoice);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load invoice" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = (await request.json()) as { status?: Invoice["status"] };
    if (!body.status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 });
    }
    await updateInvoiceStatus(id, body.status);
    const invoice = await fetchInvoiceById(id);
    return NextResponse.json(invoice);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to update invoice" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    await deleteInvoice(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to delete invoice" },
      { status: 500 }
    );
  }
}
