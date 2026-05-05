"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { LoadingScreen } from "@/components/loading/LoadingScreen";
import { GoogleSignInCard } from "@/components/auth/GoogleSignInCard";
import { BG_HERO_SRC } from "@/lib/siteAssets";

type AuthGateProps = {
  children: React.ReactNode;
};

export function AuthGate({ children }: AuthGateProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <LoadingScreen
        statusSteps={["Checking your session..."]}
        brandLabel="VoyageBlitz"
      />
    );
  }

  if (!user) {
    return (
      <>
        <div
          className="fixed inset-0 z-0 bg-app-photo-backdrop"
          style={{
            backgroundImage: `url(${BG_HERO_SRC})`,
            backgroundAttachment: "fixed",
            filter: "saturate(0.5) brightness(1.05)",
          }}
        />
        <div className="fixed inset-0 z-0 bg-white/25" />

        <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
          <div className="w-full max-w-md text-center">
            <GoogleSignInCard
              title="Almost there!"
              description="Sign in with Google to see your personalized travel comparison and save your results."
            />
            <p className="mt-4 text-sm text-stone-600">
              Your survey answers are saved on this device until you clear them.
            </p>
          </div>
        </div>
      </>
    );
  }

  return <>{children}</>;
}
