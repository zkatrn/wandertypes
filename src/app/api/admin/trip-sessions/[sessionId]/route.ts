import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminApiAuth";
import { adminDeleteTripSession } from "@/lib/admin/userOperations";

type RouteContext = { params: Promise<{ sessionId: string }> };

export async function DELETE(request: NextRequest, context: RouteContext) {
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

  const { sessionId } = await context.params;
  if (!sessionId?.trim()) {
    return NextResponse.json({ error: "sessionId is required" }, { status: 400 });
  }

  try {
    const deleted = await adminDeleteTripSession(sessionId);
    if (!deleted) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
