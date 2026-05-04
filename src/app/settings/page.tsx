"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { AuthGate } from "@/components/AuthGate";
import { AccountDeletionCard } from "@/components/settings/AccountDeletionCard";

export default function SettingsPage() {
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
            backgroundImage: "url(/bg.png)",
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

            <AccountDeletionCard />
          </div>
        </div>
      </>
    </AuthGate>
  );
}
