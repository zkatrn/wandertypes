import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminApiAuth";
import { adminDeleteUserAccount } from "@/lib/admin/userOperations";

type RouteContext = { params: Promise<{ userId: string }> };

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

  if (userId === authz.uid) {
    return NextResponse.json(
      { error: "Use account settings to delete your own account" },
      { status: 400 }
    );
  }

  try {
    const result = await adminDeleteUserAccount(userId);
    return NextResponse.json(result);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
