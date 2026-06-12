import { NextResponse } from "next/server";
import { submitSupportRequest } from "@/lib/support-repository";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      type?: string;
      subject?: string;
      message?: string;
      contactName?: string;
      contactEmail?: string;
      source?: string;
    };

    const result = await submitSupportRequest({
      type: String(body.type ?? "Feature request"),
      subject: String(body.subject ?? ""),
      message: String(body.message ?? ""),
      contactName: String(body.contactName ?? ""),
      contactEmail: String(body.contactEmail ?? ""),
      source: String(body.source ?? "support-page"),
    });

    return NextResponse.json(result, { status: result.ok ? 200 : 400 });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        message:
          err instanceof Error ? err.message : "Could not send your request.",
      },
      { status: 500 }
    );
  }
}
