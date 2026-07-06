import { NextResponse } from "next/server";
import { requireSuperadmin } from "@/lib/superadmin-access";

export async function GET() {
  try {
    const user = await requireSuperadmin();
    return NextResponse.json({
      isSuperadmin: true,
      email: user.email,
    });
  } catch {
    return NextResponse.json({ isSuperadmin: false });
  }
}
