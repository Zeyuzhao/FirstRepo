import { NextResponse } from "next/server";
import { getDashboardSnapshot } from "@/lib/dashboard-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
  try {
    return NextResponse.json(getDashboardSnapshot(), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to read dashboard table";

    return NextResponse.json({ message }, { status: 500 });
  }
}
