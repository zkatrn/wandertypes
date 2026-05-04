"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { signInWithGoogle } from "@/lib/auth";
import { Button } from "./ui/Button";
import { LoadingTravelFact } from "./LoadingTravelFact";
import { Sparkles, Lock } from "lucide-react";

type AuthGateProps = {
  children: React.ReactNode;
};

export function AuthGate({ children }: AuthGateProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Sign in failed:", error);
    }
  };

  if (loading) {
    return (
      <>
        {/* Background image */}
        <div
          className="fixed inset-0 z-0 bg-app-photo-backdrop"
          style={{
            backgroundImage: "url(/bg.png)",
            backgroundAttachment: "fixed",
            filter: "saturate(0.5) brightness(1.05)",
          }}
        />
        <div className="fixed inset-0 z-0 bg-white/25" />

        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-stone-900 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-stone-600">Loading...</p>
            <LoadingTravelFact className="mt-8 text-stone-600/95" />
          </div>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        {/* Background image */}
        <div
          className="fixed inset-0 z-0 bg-app-photo-backdrop"
          style={{
            backgroundImage: "url(/bg.png)",
            backgroundAttachment: "fixed",
            filter: "saturate(0.5) brightness(1.05)",
          }}
        />
        <div className="fixed inset-0 z-0 bg-white/25" />

        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex justify-center mb-6">
                <div className="bg-stone-900 p-4 rounded-full">
                  <Lock className="w-8 h-8 text-white" />
                </div>
              </div>

              <h2 className="text-3xl font-bold text-stone-900 mb-3">
                Almost there!
              </h2>
              <p className="text-stone-600 mb-6">
                Sign in with Google to see your personalized travel comparison and save your results.
              </p>

              <Button onClick={handleSignIn} className="w-full mb-4">
                Sign In with Google
              </Button>

              <div className="flex items-center gap-2 justify-center text-sm text-stone-500">
                <Sparkles className="w-4 h-4" />
                <span>Your survey answers are saved</span>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return <>{children}</>;
}
