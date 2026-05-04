/**
 * Comma-separated Firebase Auth UIDs with admin privileges (server env only).
 * Example: ADMIN_UIDS=abc123,def456
 */
export function getAdminUidSet(): Set<string> {
  const raw = process.env.ADMIN_UIDS?.trim() ?? "";
  return new Set(
    raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  );
}

export function isAdminUid(uid: string): boolean {
  return getAdminUidSet().has(uid);
}
