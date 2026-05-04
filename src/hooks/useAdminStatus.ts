"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";

type AdminStatus = "unknown" | "no" | "yes";

/**
 * Fetches /api/admin/me with the current user ID token. True only if the uid
 * is listed in server env ADMIN_UIDS and Firebase Admin is configured.
 */
export function useAdminStatus(): {
  user: User | null;
  isAdmin: AdminStatus;
} {
  const [user, setUser] = useState<User | null>(() => auth.currentUser);
  const [isAdmin, setIsAdmin] = useState<AdminStatus>("unknown");

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
  }, []);

  useEffect(() => {
    if (!user) {
      setIsAdmin("no");
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const token = await user.getIdToken();
        const res = await fetch("/api/admin/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 503) {
          if (!cancelled) setIsAdmin("no");
          return;
        }
        const data = (await res.json()) as { admin?: boolean; authenticated?: boolean };
        if (cancelled) return;
        setIsAdmin(data.admin ? "yes" : "no");
      } catch {
        if (!cancelled) setIsAdmin("no");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  return { user, isAdmin };
}
