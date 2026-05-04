"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { GoogleSignInCard } from "@/components/auth/GoogleSignInCard";
import { Button } from "@/components/ui/Button";

type ListedUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  createdAt?: string;
};

type ListedSession = {
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

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(() => auth.currentUser);
  const [adminOk, setAdminOk] = useState<boolean | null>(null);
  const [misconfigured, setMisconfigured] = useState(false);
  const [stats, setStats] = useState<{
    tripSessionCount: number;
    authUserCount: number;
  } | null>(null);
  const [users, setUsers] = useState<ListedUser[]>([]);
  const [sessions, setSessions] = useState<ListedSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, setUser);
  }, []);

  const loadDashboard = useCallback(async (u: User) => {
    setError(null);
    setLoading(true);
    const token = await u.getIdToken();
    const meRes = await adminFetch("/api/admin/me", token);
    if (meRes.status === 503) {
      setMisconfigured(true);
      setAdminOk(false);
      setLoading(false);
      return;
    }
    const me = (await meRes.json()) as { admin?: boolean };
    if (!meRes.ok || !me.admin) {
      setMisconfigured(false);
      setAdminOk(false);
      setLoading(false);
      return;
    }
    setMisconfigured(false);
    setAdminOk(true);

    const [statsRes, usersRes, sessRes] = await Promise.all([
      adminFetch("/api/admin/stats", token),
      adminFetch("/api/admin/users?maxResults=100", token),
      adminFetch("/api/admin/trip-sessions?limit=40", token),
    ]);

    if (statsRes.status === 503) {
      setMisconfigured(true);
    } else if (statsRes.ok) {
      setMisconfigured(false);
      const s = (await statsRes.json()) as {
        tripSessionCount: number;
        authUserCount: number;
      };
      setStats(s);
    }

    if (usersRes.ok) {
      const data = (await usersRes.json()) as { users: ListedUser[] };
      setUsers(data.users);
    }
    if (sessRes.ok) {
      const data = (await sessRes.json()) as { sessions: ListedSession[] };
      setSessions(data.sessions);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    if (!user) {
      setAdminOk(null);
      setLoading(false);
      return;
    }
    void loadDashboard(user);
  }, [user, loadDashboard]);

  const refresh = () => {
    const u = auth.currentUser;
    if (u) void loadDashboard(u);
  };

  const deleteUser = async (uid: string) => {
    const u = auth.currentUser;
    if (!u || !confirm(`Delete user ${uid} and all their saved trips?`)) return;
    setBusyId(`user:${uid}`);
    setError(null);
    try {
      const token = await u.getIdToken();
      const res = await adminFetch(`/api/admin/users/${encodeURIComponent(uid)}`, token, {
        method: "DELETE",
      });
      if (!res.ok) {
        const j = (await res.json()) as { error?: string };
        throw new Error(j.error || res.statusText);
      }
      refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setBusyId(null);
    }
  };

  const deleteSession = async (sessionId: string) => {
    const u = auth.currentUser;
    if (!u || !confirm(`Delete trip session ${sessionId}?`)) return;
    setBusyId(`sess:${sessionId}`);
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
        throw new Error(j.error || res.statusText);
      }
      refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setBusyId(null);
    }
  };

  if (!user) {
    return (
      <div className="relative z-10 mx-auto max-w-md px-4 py-16">
        <p className="mb-6 text-center text-sm text-stone-600">
          Sign in with the Google account that is listed in{" "}
          <code className="rounded bg-stone-100 px-1 text-xs">ADMIN_UIDS</code>.
        </p>
        <GoogleSignInCard
          title="Admin sign-in"
          description="Administrator access is verified on the server."
        />
      </div>
    );
  }

  if (loading || adminOk === null) {
    return (
      <div className="relative z-10 mx-auto max-w-4xl px-4 py-16 text-center text-stone-600">
        Checking access…
      </div>
    );
  }

  if (!adminOk) {
    return (
      <div className="relative z-10 mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-xl font-semibold text-stone-900">
          {misconfigured ? "Admin not configured on server" : "Access denied"}
        </h1>
        <p className="mt-3 text-sm text-stone-600">
          {misconfigured ? (
            <>
              Add{" "}
              <code className="rounded bg-stone-100 px-1 text-xs">
                FIREBASE_SERVICE_ACCOUNT_JSON
              </code>{" "}
              (service account JSON from Firebase) to your deployment environment so
              the server can verify ID tokens. Also set{" "}
              <code className="rounded bg-stone-100 px-1 text-xs">ADMIN_UIDS</code>{" "}
              to your Firebase user UID.
            </>
          ) : (
            <>
              Your account is not listed in{" "}
              <code className="rounded bg-stone-100 px-1 text-xs">ADMIN_UIDS</code>{" "}
              on the server.
            </>
          )}
        </p>
        <Link
          href="/"
          className="mt-8 inline-block text-sm font-medium text-primary underline"
        >
          Back home
        </Link>
      </div>
    );
  }

  return (
    <div className="relative z-10 mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-stone-900">Admin</h1>
          <p className="mt-1 text-sm text-stone-600">
            Delete Auth users and trip sessions. Actions use Firebase Admin on the server.
          </p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={() => refresh()}>
          Refresh
        </Button>
      </div>

      {misconfigured ? (
        <p className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          Set{" "}
          <code className="rounded bg-amber-100 px-1 text-xs">
            FIREBASE_SERVICE_ACCOUNT_JSON
          </code>{" "}
          (or{" "}
          <code className="rounded bg-amber-100 px-1 text-xs">
            GOOGLE_APPLICATION_CREDENTIALS
          </code>
          ) so the server can verify tokens and run privileged operations.
        </p>
      ) : null}

      {error ? (
        <p className="mb-4 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      {stats ? (
        <div className="mb-10 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
              Auth users
            </p>
            <p className="mt-1 text-2xl font-semibold text-stone-900">
              {stats.authUserCount}
            </p>
          </div>
          <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
              Trip sessions (Firestore)
            </p>
            <p className="mt-1 text-2xl font-semibold text-stone-900">
              {stats.tripSessionCount}
            </p>
          </div>
        </div>
      ) : null}

      <section className="mb-12">
        <h2 className="mb-3 text-lg font-semibold text-stone-900">Users</h2>
        <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white shadow-sm">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50 text-xs uppercase tracking-wide text-stone-500">
                <th className="px-3 py-2 font-medium">Email</th>
                <th className="px-3 py-2 font-medium">UID</th>
                <th className="px-3 py-2 font-medium">Created</th>
                <th className="px-3 py-2 font-medium">Sessions</th>
                <th className="px-3 py-2 font-medium w-28">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((row) => (
                <tr key={row.uid} className="border-b border-stone-100">
                  <td className="px-3 py-2 text-stone-800">
                    {row.email ?? "—"}
                  </td>
                  <td className="px-3 py-2 font-mono text-xs text-stone-600">
                    {row.uid.slice(0, 8)}…
                  </td>
                  <td className="px-3 py-2 text-stone-600">
                    {row.createdAt ?? "—"}
                  </td>
                  <td className="px-3 py-2">
                    <Link
                      href={`/admin/users/${encodeURIComponent(row.uid)}/sessions${
                        row.email
                          ? `?email=${encodeURIComponent(row.email)}`
                          : ""
                      }`}
                      className="text-sm font-medium text-primary hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View sessions
                    </Link>
                  </td>
                  <td className="px-3 py-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="border-red-200 text-red-800 hover:bg-red-50"
                      disabled={busyId !== null || row.uid === user.uid}
                      onClick={() => void deleteUser(row.uid)}
                    >
                      {busyId === `user:${row.uid}` ? "…" : "Delete"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-stone-500">
          Deletes all{" "}
          <code className="rounded bg-stone-100 px-1">tripSessions</code> for that
          user, then removes the Auth account. You cannot delete your own account here.
        </p>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-stone-900">
          Recent trip sessions
        </h2>
        <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white shadow-sm">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50 text-xs uppercase tracking-wide text-stone-500">
                <th className="px-3 py-2 font-medium">Session ID</th>
                <th className="px-3 py-2 font-medium">User</th>
                <th className="px-3 py-2 font-medium">Created</th>
                <th className="px-3 py-2 font-medium w-28">Action</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((row) => (
                <tr key={row.id} className="border-b border-stone-100">
                  <td className="px-3 py-2 font-mono text-xs text-stone-800">
                    {row.id}
                  </td>
                  <td className="px-3 py-2 font-mono text-xs text-stone-600">
                    {row.userId ? (
                      <Link
                        href={`/admin/users/${encodeURIComponent(row.userId)}/sessions`}
                        className="text-primary hover:underline"
                      >
                        {row.userId.slice(0, 8)}…
                      </Link>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-3 py-2 text-stone-600">
                    {row.createdAt ? new Date(row.createdAt).toLocaleString() : "—"}
                  </td>
                  <td className="px-3 py-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="border-red-200 text-red-800 hover:bg-red-50"
                      disabled={busyId !== null}
                      onClick={() => void deleteSession(row.id)}
                    >
                      {busyId === `sess:${row.id}` ? "…" : "Delete"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
