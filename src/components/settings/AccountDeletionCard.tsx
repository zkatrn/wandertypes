"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteAccountWithReauth } from "@/lib/auth";
import { clearSurveyAnswers } from "@/lib/surveyStorage";
import { Button } from "@/components/ui/Button";

const CONFIRM_PHRASE = "DELETE";

export function AccountDeletionCard() {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [phrase, setPhrase] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit =
    phrase.trim() === CONFIRM_PHRASE && !busy;

  const handleDelete = async () => {
    if (!canSubmit) return;
    setError(null);
    setBusy(true);
    try {
      await deleteAccountWithReauth();
      clearSurveyAnswers();
      router.replace("/");
    } catch (e) {
      const code =
        typeof e === "object" && e !== null && "code" in e
          ? String((e as { code?: string }).code)
          : "";
      if (code === "auth/popup-closed-by-user") {
        setError("Sign-in was cancelled. Try again when you are ready.");
      } else if (code === "auth/popup-blocked") {
        setError("Allow pop-ups for this site so Google can verify it is you.");
      } else if (code === "auth/network-request-failed") {
        setError("Network error. Check your connection and try again.");
      } else if (code === "permission-denied") {
        setError(
          "Could not remove saved trips (permission denied). Check Firestore rules, then try again."
        );
      } else {
        setError(
          e instanceof Error ? e.message : "Something went wrong. Please try again."
        );
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-stone-900">Delete account</h2>
      <p className="mt-2 text-sm text-stone-600 leading-relaxed">
        Permanently remove your VoyageBlitz account and all saved trip comparisons
        linked to it. This cannot be undone.
      </p>

      {!expanded ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-4 border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400"
          onClick={() => setExpanded(true)}
        >
          Delete my account…
        </Button>
      ) : (
        <div className="mt-4 space-y-4 rounded-lg border border-red-200 bg-red-50/40 p-4">
          <p className="text-sm text-stone-700">
            You will be asked to sign in with Google again to confirm. Then all
            your saved trips are removed and your account is deleted.
          </p>
          <label className="block text-sm font-medium text-stone-800">
            Type <span className="font-mono text-red-800">{CONFIRM_PHRASE}</span>{" "}
            to enable the button
            <input
              type="text"
              autoComplete="off"
              value={phrase}
              onChange={(ev) => setPhrase(ev.target.value)}
              className="mt-1.5 w-full max-w-xs rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder={CONFIRM_PHRASE}
              disabled={busy}
            />
          </label>
          {error ? (
            <p className="text-sm text-red-700" role="alert">
              {error}
            </p>
          ) : null}
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              disabled={!canSubmit}
              className="border-2 border-red-700 bg-red-700 text-white hover:bg-red-800 disabled:border-stone-300 disabled:bg-stone-300"
              onClick={() => void handleDelete()}
            >
              {busy ? "Working…" : "Permanently delete account"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={busy}
              onClick={() => {
                setExpanded(false);
                setPhrase("");
                setError(null);
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
