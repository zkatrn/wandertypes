import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminApiAuth";
import { adminListRecentTripSessions } from "@/lib/admin/userOperations";

export async function GET(request: NextRequest) {
  const authz = await requireAdmin(request);
  if (!authz.ok) {
    if (authz.reason === "admin_unconfigured") {
      return NextResponse.json(
        { error: "Server admin is not configured" },
        { status: 503 }
      );
    }
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const limit = Math.min(
    100,
    Math.max(1, Number(searchParams.get("limit") || 30) || 30)
  );

  try {
    const sessions = await adminListRecentTripSessions(limit);
    return NextResponse.json({ sessions });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
