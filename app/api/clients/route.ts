import { NextResponse } from "next/server";
import { createSavedClient, fetchClients } from "@/lib/clients-repository";
import type { ClientDetails } from "@/types/invoice";

export async function GET() {
  try {
    const clients = await fetchClients();
    return NextResponse.json(clients);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load clients" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ClientDetails;
    const client = await createSavedClient(body);
    return NextResponse.json(client);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to create client" },
      { status: 500 }
    );
  }
}
