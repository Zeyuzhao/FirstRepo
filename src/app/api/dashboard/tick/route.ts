import { NextResponse } from "next/server";
import {
  appendDashboardEvent,
  getDashboardSnapshot,
} from "@/lib/dashboard-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function POST() {
  try {
    appendDashboardEvent();

    return NextResponse.json(getDashboardSnapshot(), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to update dashboard table";

    return NextResponse.json({ message }, { status: 500 });
  }
}
