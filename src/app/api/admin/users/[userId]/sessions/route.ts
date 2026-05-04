import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminApiAuth";
import {
  adminDeleteAllTripSessionsForUser,
  adminListTripSessionsForUser,
} from "@/lib/admin/userOperations";

type RouteContext = { params: Promise<{ userId: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
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

  const { userId } = await context.params;
  if (!userId?.trim()) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  try {
    const sessions = await adminListTripSessionsForUser(userId);
    return NextResponse.json({ sessions });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

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

  const { userId } = await context.params;
  if (!userId?.trim()) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  try {
    const deleted = await adminDeleteAllTripSessionsForUser(userId);
    return NextResponse.json({ deleted });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
