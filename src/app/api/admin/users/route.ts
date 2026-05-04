import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { getFirebaseAdminApp } from "@/lib/firebaseAdmin";
import { requireAdmin } from "@/lib/adminApiAuth";

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
  const max = Math.min(
    1000,
    Math.max(1, Number(searchParams.get("maxResults") || 100) || 100)
  );
  const pageToken = searchParams.get("pageToken") || undefined;

  try {
    const adminAuth = getAuth(getFirebaseAdminApp());
    const list = await adminAuth.listUsers(max, pageToken);
    const users = list.users.map((u) => ({
      uid: u.uid,
      email: u.email ?? null,
      displayName: u.displayName ?? null,
      photoURL: u.photoURL ?? null,
      disabled: u.disabled,
      createdAt: u.metadata.creationTime,
      lastSignIn: u.metadata.lastSignInTime,
    }));
    return NextResponse.json({
      users,
      nextPageToken: list.pageToken,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
