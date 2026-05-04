import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getFirebaseAdminApp } from "@/lib/firebaseAdmin";

const BATCH = 500;

export async function adminDeleteAllTripSessionsForUser(userId: string): Promise<number> {
  const db = getFirestore(getFirebaseAdminApp());
  const snap = await db.collection("tripSessions").where("userId", "==", userId).get();
  const docs = snap.docs;
  for (let i = 0; i < docs.length; i += BATCH) {
    const batch = db.batch();
    for (const d of docs.slice(i, i + BATCH)) {
      batch.delete(d.ref);
    }
    await batch.commit();
  }
  return docs.length;
}

export async function adminDeleteTripSession(sessionId: string): Promise<boolean> {
  const db = getFirestore(getFirebaseAdminApp());
  const ref = db.collection("tripSessions").doc(sessionId);
  const doc = await ref.get();
  if (!doc.exists) {
    return false;
  }
  await ref.delete();
  return true;
}

/**
 * Deletes Firestore trip sessions for the user, then deletes the Auth user.
 */
export async function adminDeleteUserAccount(userId: string): Promise<{
  sessionsDeleted: number;
  authDeleted: boolean;
}> {
  const sessionsDeleted = await adminDeleteAllTripSessionsForUser(userId);
  const auth = getAuth(getFirebaseAdminApp());
  try {
    await auth.deleteUser(userId);
    return { sessionsDeleted, authDeleted: true };
  } catch (e: unknown) {
    const code =
      typeof e === "object" && e !== null && "code" in e
        ? String((e as { code?: string }).code)
        : "";
    if (code === "auth/user-not-found") {
      return { sessionsDeleted, authDeleted: false };
    }
    throw e;
  }
}

export type ListedTripSession = {
  id: string;
  userId: string | null;
  createdAt: string | null;
};

/**
 * Lists recent trip sessions (newest first). Uses createdAt when present; otherwise lists by doc id order is not guaranteed for missing fields — we orderBy createdAt descending and only return docs that have the field when possible.
 */
/**
 * All trip sessions for a given Auth user (newest first by createdAt when present).
 * Sorted in memory to avoid a composite index on (userId, createdAt).
 */
export async function adminListTripSessionsForUser(
  userId: string
): Promise<ListedTripSession[]> {
  const db = getFirestore(getFirebaseAdminApp());
  const snap = await db
    .collection("tripSessions")
    .where("userId", "==", userId)
    .get();

  const rows: ListedTripSession[] = snap.docs.map((d) => {
    const data = d.data();
    const ts = data.createdAt;
    let createdAt: string | null = null;
    if (ts && typeof ts.toDate === "function") {
      createdAt = ts.toDate().toISOString();
    }
    return {
      id: d.id,
      userId: typeof data.userId === "string" ? data.userId : null,
      createdAt,
    };
  });

  rows.sort((a, b) => {
    const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return tb - ta;
  });
  return rows;
}

export async function adminListRecentTripSessions(
  limit: number
): Promise<ListedTripSession[]> {
  const db = getFirestore(getFirebaseAdminApp());
  const snap = await db
    .collection("tripSessions")
    .orderBy("createdAt", "desc")
    .limit(Math.min(Math.max(limit, 1), 100))
    .get();

  return snap.docs.map((d) => {
    const data = d.data();
    const ts = data.createdAt;
    let createdAt: string | null = null;
    if (ts && typeof ts.toDate === "function") {
      createdAt = ts.toDate().toISOString();
    }
    return {
      id: d.id,
      userId: typeof data.userId === "string" ? data.userId : null,
      createdAt,
    };
  });
}
