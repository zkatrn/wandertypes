"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { GoogleSignInCard } from "@/components/auth/GoogleSignInCard";
import { Button } from "@/components/ui/Button";
import { ChevronLeft } from "lucide-react";

type SessionRow = {
  id: string;
  userId: string | null;
  createdAt: string | null;
};

async function adminFetch(
  path: string,
  token: string,
  init?: RequestInit
): Promise<Response> {
  return fetch(path, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(init?.headers ?? {}),
    },
  });
}

function AdminUserSessionsContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const userIdParam = params.userId as string;
  const emailHint = searchParams.get("email");

  const [account, setAccount] = useState<User | null>(() => auth.currentUser);
  const [adminOk, setAdminOk] = useState<boolean | null>(null);
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [deletingAll, setDeletingAll] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, setAccount);
  }, []);

  const loadSessions = useCallback(async (u: User) => {
    setError(null);
    setLoading(true);
    const token = await u.getIdToken();
    const meRes = await adminFetch("/api/admin/me", token);
    if (meRes.status === 503 || !meRes.ok) {
      setAdminOk(false);
      setLoading(false);
      return;
    }
    const me = (await meRes.json()) as { admin?: boolean };
    if (!me.admin) {
      setAdminOk(false);
      setLoading(false);
      return;
    }
    setAdminOk(true);

    const path = `/api/admin/users/${encodeURIComponent(userIdParam)}/sessions`;
    const res = await adminFetch(path, token);
    if (!res.ok) {
      const j = (await res.json()) as { error?: string };
      setError(j.error ?? res.statusText);
      setSessions([]);
      setLoading(false);
      return;
    }
    const data = (await res.json()) as { sessions: SessionRow[] };
    setSessions(data.sessions);
    setLoading(false);
  }, [userIdParam]);

  useEffect(() => {
    if (!account) {
      setAdminOk(null);
      setLoading(false);
      return;
    }
    void loadSessions(account);
  }, [account, loadSessions]);

  const refresh = () => {
    const u = auth.currentUser;
    if (u) void loadSessions(u);
  };

  const deleteOne = async (sessionId: string) => {
    const u = auth.currentUser;
    if (!u || !confirm(`Delete session ${sessionId}?`)) return;
    setBusyId(sessionId);
    setError(null);
    try {
      const token = await u.getIdToken();
      const res = await adminFetch(
        `/api/admin/trip-sessions/${encodeURIComponent(sessionId)}`,
        token,
        { method: "DELETE" }
      );
      if (!res.ok) {
        const j = (await res.json()) as { error?: string };
        throw new Error(j.error ?? res.statusText);
      }
      refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setBusyId(null);
    }
  };

  const deleteAllSessions = async () => {
    const u = auth.currentUser;
    if (
      !u ||
      !confirm(
        `Delete ALL ${sessions.length} trip session(s) for this user? This does not remove their Auth account.`
      )
    ) {
      return;
    }
    setDeletingAll(true);
    setError(null);
    try {
      const token = await u.getIdToken();
      const res = await adminFetch(
        `/api/admin/users/${encodeURIComponent(userIdParam)}/sessions`,
        token,
        { method: "DELETE" }
      );
      if (!res.ok) {
        const j = (await res.json()) as { error?: string };
        throw new Error(j.error ?? res.statusText);
      }
      refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setDeletingAll(false);
    }
  };

  if (!account) {
    return (
      <div className="relative z-10 mx-auto max-w-md px-4 py-16">
        <GoogleSignInCard
          title="Admin sign-in"
          description="Sign in to manage user trip sessions."
        />
      </div>
    );
  }

  if (loading || adminOk === null) {
    return (
      <div className="relative z-10 mx-auto max-w-4xl px-4 py-16 text-center text-stone-600">
        Loading…
      </div>
    );
  }

  if (!adminOk) {
    return (
      <div className="relative z-10 mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-xl font-semibold text-stone-900">Access denied</h1>
        <Link href="/admin" className="mt-6 inline-block text-sm text-primary underline">
          Back to admin
        </Link>
      </div>
    );
  }

  return (
    <div className="relative z-10 mx-auto max-w-5xl px-4 py-10">
      <Link
        href="/admin"
        className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
      >
        <ChevronLeft className="h-4 w-4" />
        Admin home
      </Link>

      <h1 className="text-2xl font-serif font-bold text-stone-900">
        Trip sessions
      </h1>
      <div className="mt-2 space-y-1 text-sm text-stone-600">
        {emailHint ? (
          <p>
            <span className="font-medium text-stone-800">{emailHint}</span>
          </p>
        ) : null}
        <p className="font-mono text-xs text-stone-700 break-all">{userIdParam}</p>
      </div>

      {error ? (
        <p className="mt-4 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      <div className="mt-8 overflow-x-auto rounded-xl border border-stone-200 bg-white shadow-sm">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-50 text-xs uppercase tracking-wide text-stone-500">
              <th className="px-3 py-2 font-medium">Session ID</th>
              <th className="px-3 py-2 font-medium">Created</th>
              <th className="px-3 py-2 font-medium w-28">Action</th>
            </tr>
          </thead>
          <tbody>
            {sessions.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="px-3 py-8 text-center text-stone-500"
                >
                  No saved trip sessions for this user.
                </td>
              </tr>
            ) : (
              sessions.map((row) => (
                <tr key={row.id} className="border-b border-stone-100">
                  <td className="px-3 py-2 font-mono text-xs text-stone-800">
                    {row.id}
                  </td>
                  <td className="px-3 py-2 text-stone-600">
                    {row.createdAt
                      ? new Date(row.createdAt).toLocaleString()
                      : "—"}
                  </td>
                  <td className="px-3 py-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="border-red-200 text-red-800 hover:bg-red-50"
                      disabled={busyId !== null || deletingAll}
                      onClick={() => void deleteOne(row.id)}
                    >
                      {busyId === row.id ? "…" : "Delete"}
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-10 border-t border-stone-200 pt-8">
        <h2 className="text-sm font-semibold text-stone-900">
          Delete all sessions
        </h2>
        <p className="mt-1 text-sm text-stone-600">
          Removes every <code className="rounded bg-stone-100 px-1 text-xs">tripSessions</code>{" "}
          document for this user. Their Google account is unchanged.
        </p>
        <Button
          type="button"
          size="sm"
          className="mt-4 border-2 border-red-700 bg-red-700 text-white hover:bg-red-800 disabled:border-stone-300 disabled:bg-stone-300"
          disabled={sessions.length === 0 || busyId !== null || deletingAll}
          onClick={() => void deleteAllSessions()}
        >
          {deletingAll ? "Working…" : `Delete all sessions (${sessions.length})`}
        </Button>
      </div>
    </div>
  );
}

export default function AdminUserSessionsPage() {
  return (
    <Suspense
      fallback={
        <div className="relative z-10 mx-auto max-w-4xl px-4 py-16 text-center text-stone-600">
          Loading…
        </div>
      }
    >
      <AdminUserSessionsContent />
    </Suspense>
  );
}
