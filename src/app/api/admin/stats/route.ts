import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
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

  try {
    const app = getFirebaseAdminApp();
    const db = getFirestore(app);
    const adminAuth = getAuth(app);

    let tripSessionCount = 0;
    try {
      const countSnap = await db.collection("tripSessions").count().get();
      tripSessionCount = countSnap.data().count;
    } catch (e) {
      console.error("tripSessions count failed:", e);
    }

    let authUserCount = 0;
    let pageToken: string | undefined;
    do {
      const page = await adminAuth.listUsers(1000, pageToken);
      authUserCount += page.users.length;
      pageToken = page.pageToken;
    } while (pageToken);

    return NextResponse.json({ tripSessionCount, authUserCount });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
