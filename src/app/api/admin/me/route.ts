import { NextRequest, NextResponse } from "next/server";
import { getAuthStatus } from "@/lib/adminApiAuth";
import { isFirebaseAdminConfigured } from "@/lib/firebaseAdmin";

export async function GET(request: NextRequest) {
  if (!isFirebaseAdminConfigured()) {
    return NextResponse.json(
      {
        authenticated: false,
        admin: false,
        error: "admin_unconfigured",
      },
      { status: 503 }
    );
  }

  const status = await getAuthStatus(request);
  if (!status.authenticated) {
    return NextResponse.json({ admin: false, authenticated: false });
  }
  return NextResponse.json({
    authenticated: true,
    admin: status.admin,
    uid: status.uid,
  });
}
