"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { AuthGate } from "@/components/AuthGate";
import { AccountDeletionCard } from "@/components/settings/AccountDeletionCard";
import { useAdminStatus } from "@/hooks/useAdminStatus";
import { BG_HERO_SRC } from "@/lib/siteAssets";
import Link from "next/link";
import { Shield } from "lucide-react";

export default function SettingsPage() {
  const { isAdmin } = useAdminStatus();
  const [account, setAccount] = useState<User | null>(() => auth.currentUser);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setAccount);
    return () => unsub();
  }, []);

  return (
    <AuthGate>
      <>
        <div
          className="pointer-events-none fixed inset-0 z-0 bg-app-photo-backdrop"
          style={{
            backgroundImage: `url(${BG_HERO_SRC})`,
            backgroundAttachment: "fixed",
            filter: "saturate(0.5) brightness(1.05)",
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none fixed inset-0 z-0 bg-white/25"
          aria-hidden
        />

        <div className="relative z-10 min-h-screen py-12 px-4">
          <div className="mx-auto max-w-lg">
            <h1 className="text-3xl font-bold font-serif text-mountain-brown mb-2">
              Settings
            </h1>
            <p className="text-sm text-stone-600 mb-8">
              Signed in as{" "}
              <span className="font-medium text-stone-800">
                {account?.email ??
                  account?.displayName ??
                  "your Google account"}
              </span>
            </p>

            {isAdmin === "yes" ? (
              <section className="mb-8 rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-stone-900">Admin</h2>
                <p className="mt-2 text-sm text-stone-600 leading-relaxed">
                  Open the admin dashboard to view analytics counts, manage users, and
                  remove trip sessions.
                </p>
                <Link
                  href="/admin"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  <Shield className="h-4 w-4" />
                  Admin dashboard
                </Link>
              </section>
            ) : null}

            <AccountDeletionCard />
          </div>
        </div>
      </>
    </AuthGate>
  );
}
