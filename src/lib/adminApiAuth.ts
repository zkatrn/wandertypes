import type { NextRequest } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { getFirebaseAdminApp, isFirebaseAdminConfigured } from "@/lib/firebaseAdmin";
import { isAdminUid } from "@/lib/adminUids";

export type AdminAuthResult =
  | { ok: true; uid: string; isAdmin: true }
  | { ok: false; reason: "missing_token" | "invalid_token" | "not_admin" | "admin_unconfigured" };

function bearerToken(request: NextRequest): string | null {
  const h = request.headers.get("authorization");
  if (!h?.startsWith("Bearer ")) return null;
  const t = h.slice(7).trim();
  return t || null;
}

/**
 * Verifies the Firebase ID token and checks ADMIN_UIDS.
 * All admin APIs must use this; never trust client-only checks.
 */
export async function requireAdmin(request: NextRequest): Promise<AdminAuthResult> {
  if (!isFirebaseAdminConfigured()) {
    return { ok: false, reason: "admin_unconfigured" };
  }

  const token = bearerToken(request);
  if (!token) {
    return { ok: false, reason: "missing_token" };
  }

  try {
    const auth = getAuth(getFirebaseAdminApp());
    const decoded = await auth.verifyIdToken(token);
    const uid = decoded.uid;
    if (!isAdminUid(uid)) {
      return { ok: false, reason: "not_admin" };
    }
    return { ok: true, uid, isAdmin: true };
  } catch {
    return { ok: false, reason: "invalid_token" };
  }
}

export type MeAuthResult =
  | { authenticated: false; admin: false }
  | { authenticated: true; uid: string; admin: boolean };

/**
 * For /api/admin/me: returns whether the user is signed in (valid token) and whether they are admin.
 */
export async function getAuthStatus(request: NextRequest): Promise<MeAuthResult> {
  if (!isFirebaseAdminConfigured()) {
    return { authenticated: false, admin: false };
  }

  const token = bearerToken(request);
  if (!token) {
    return { authenticated: false, admin: false };
  }

  try {
    const auth = getAuth(getFirebaseAdminApp());
    const decoded = await auth.verifyIdToken(token);
    const uid = decoded.uid;
    return { authenticated: true, uid, admin: isAdminUid(uid) };
  } catch {
    return { authenticated: false, admin: false };
  }
}
