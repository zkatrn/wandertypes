"use client";

import { signInWithGoogle } from "@/lib/auth";
import { Button } from "@/components/ui/Button";
import { Lock } from "lucide-react";
import { cn } from "@/lib/cn";

type GoogleSignInCardProps = {
  title?: string;
  description?: string;
  className?: string;
};

export function GoogleSignInCard({
  title = "Almost there!",
  description = "Sign in with Google to save or share your comparison.",
  className,
}: GoogleSignInCardProps) {
  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Sign in failed:", error);
    }
  };

  return (
    <div className={cn("rounded-2xl bg-white p-8 text-center shadow-xl", className)}>
      <div className="mb-6 flex justify-center">
        <div className="rounded-full bg-stone-900 p-4">
          <Lock className="h-8 w-8 text-white" />
        </div>
      </div>

      <h2 className="mb-3 text-3xl font-bold text-stone-900">{title}</h2>
      <p className="mb-6 text-stone-600">{description}</p>

      <Button type="button" onClick={() => void handleSignIn()} className="w-full">
        Sign In with Google
      </Button>
    </div>
  );
}
