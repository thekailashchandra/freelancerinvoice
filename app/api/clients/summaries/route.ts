import { NextResponse } from "next/server";
import { fetchClientSummaries } from "@/lib/clients-repository";

export async function GET() {
  try {
    const summaries = await fetchClientSummaries();
    return NextResponse.json(summaries);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load customers" },
      { status: 500 }
    );
  }
}
