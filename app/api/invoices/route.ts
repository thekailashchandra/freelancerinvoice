import { NextResponse } from "next/server";
import { fetchInvoices, saveInvoice } from "@/lib/invoice-repository";
import type { Invoice } from "@/types/invoice";

export async function GET() {
  try {
    const invoices = await fetchInvoices();
    return NextResponse.json(invoices);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load invoices" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const invoice = (await request.json()) as Invoice;
    const result = await saveInvoice(invoice);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to save invoice" },
      { status: 500 }
    );
  }
}
