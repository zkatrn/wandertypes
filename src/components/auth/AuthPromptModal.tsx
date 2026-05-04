"use client";

import { useEffect, useRef } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { GoogleSignInCard } from "@/components/auth/GoogleSignInCard";

type AuthPromptModalProps = {
  open: boolean;
  onClose: () => void;
  /** Fires once when the user becomes signed in while the modal is open. */
  onSignedIn: () => void;
  title?: string;
  description?: string;
};

export function AuthPromptModal({
  open,
  onClose,
  onSignedIn,
  title,
  description,
}: AuthPromptModalProps) {
  const onSignedInRef = useRef(onSignedIn);
  onSignedInRef.current = onSignedIn;

  useEffect(() => {
    if (!open) return;
    let notified = false;
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user && !notified) {
        notified = true;
        onSignedInRef.current();
      }
    });
    return () => unsub();
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-prompt-title"
    >
      <div className="relative w-full max-w-md">
        <button
          type="button"
          onClick={onClose}
          className="absolute -right-1 -top-10 rounded-lg px-2 py-1 text-sm font-medium text-white hover:bg-white/15 md:-right-2 md:-top-12"
        >
          Close
        </button>
        <div id="auth-prompt-title" className="sr-only">
          {title ?? "Sign in required"}
        </div>
        <GoogleSignInCard title={title} description={description} />
      </div>
    </div>
  );
}
