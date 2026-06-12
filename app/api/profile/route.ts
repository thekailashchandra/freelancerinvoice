import { NextResponse } from "next/server";
import { fetchProfile, updateProfile } from "@/lib/profile-repository";
import type { CompanySettings } from "@/types/invoice";

export async function GET() {
  try {
    const profile = await fetchProfile();
    if (!profile) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    return NextResponse.json(profile);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load profile" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = (await request.json()) as Partial<CompanySettings> & {
      companyName?: string;
      currencyCode?: string;
      taxLabel?: string;
    };

    await updateProfile(body);
    const profile = await fetchProfile();

    if (!profile) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    return NextResponse.json(profile);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to save profile" },
      { status: 500 }
    );
  }
}
