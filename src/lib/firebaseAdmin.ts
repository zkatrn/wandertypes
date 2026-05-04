import { applicationDefault, cert, getApps, initializeApp, type App } from "firebase-admin/app";

function parseServiceAccount(): Record<string, unknown> | null {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    console.error("FIREBASE_SERVICE_ACCOUNT_JSON is not valid JSON");
    return null;
  }
}

/**
 * Firebase Admin is required for verifying ID tokens on the server and for
 * privileged Auth/Firestore operations. Configure one of:
 * - FIREBASE_SERVICE_ACCOUNT_JSON (full JSON string, e.g. from Firebase console)
 * - GOOGLE_APPLICATION_CREDENTIALS (path to a service account key file)
 */
export function isFirebaseAdminConfigured(): boolean {
  return Boolean(
    parseServiceAccount() || process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim()
  );
}

export function getFirebaseAdminApp(): App {
  const existing = getApps();
  if (existing.length > 0) {
    return existing[0]!;
  }

  const json = parseServiceAccount();
  if (json) {
    return initializeApp({
      credential: cert(json as Parameters<typeof cert>[0]),
    });
  }

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim()) {
    return initializeApp({
      credential: applicationDefault(),
    });
  }

  throw new Error(
    "Firebase Admin is not configured. Set FIREBASE_SERVICE_ACCOUNT_JSON or GOOGLE_APPLICATION_CREDENTIALS."
  );
}
