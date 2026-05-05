"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { loadSurveyAnswers } from "@/lib/surveyStorage";
import { saveTripSession, generateSessionId } from "@/lib/firestore";
import { getTheme } from "@/lib/themes";
import { LoadingScreen } from "@/components/loading/LoadingScreen";
import { AuthPromptModal } from "@/components/auth/AuthPromptModal";
import { WandertypeBanner } from "@/components/results/WandertypeBanner";
import { DestinationCard } from "@/components/results/DestinationCard";
import { ResultsInsightsAccordions } from "@/components/results/ResultsInsightsAccordions";
import { TwinklingStars } from "@/components/results/TwinklingStars";
import { ResultsSaveShareToolbar } from "@/components/results/ResultsSaveShareToolbar";
import { comparisonGridClassName } from "@/lib/resultsLayout";
import type { TripInterpretation } from "@/types/interpretation";
import {
  fetchTripInterpretation,
  isAbortError,
} from "@/lib/fetchTripInterpretation";
import type { TripInterpretationSource } from "@/lib/fetchTripInterpretation";
import { Button } from "@/components/ui/Button";
import { trackEvent } from "@/lib/analytics";
import { SeamlessParallaxBackground } from "@/components/layout/SeamlessParallaxBackground";
import { getResultsDestinationTitle } from "@/lib/tripListTitle";
import { BG_HERO_SRC } from "@/lib/siteAssets";

export default function ResultsPage() {
  const router = useRouter();
  const [interpretation, setInterpretation] = useState<TripInterpretation | null>(null);
  const [interpretationSource, setInterpretationSource] =
    useState<TripInterpretationSource | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string>(BG_HERO_SRC);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [savedSessionId, setSavedSessionId] = useState<string | null>(null);
  const [saveBusy, setSaveBusy] = useState(false);
  const [shareBusy, setShareBusy] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const pendingRef = useRef<"save" | "share" | null>(null);
  const savedIdRef = useRef<string | null>(null);
  const interpretationTrackedRef = useRef(false);

  const travelFactHints = useMemo(() => {
    const a = loadSurveyAnswers();
    return [
      ...(a?.destinations ?? []),
      ...(a?.destinationList ?? []),
    ].filter((s): s is string => Boolean(s?.trim()));
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  useEffect(() => {
    savedIdRef.current = savedSessionId;
  }, [savedSessionId]);

  useEffect(() => {
    let cancelled = false;
    const ac = new AbortController();

    async function load() {
      setLoadError(null);
      try {
        const answers = loadSurveyAnswers();
        if (!answers) {
          router.replace("/");
          return;
        }

        const { interpretation: next, source } =
          await fetchTripInterpretation(answers, { signal: ac.signal });
        if (cancelled) return;

        setInterpretation(next);
        setInterpretationSource(source);

        const theme = getTheme(next.selectedTheme);
        const img = new Image();
        img.onload = () => {
          if (!cancelled) setBackgroundImage(theme.backgroundImage);
        };
        img.onerror = () => {
          if (!cancelled) setBackgroundImage(BG_HERO_SRC);
        };
        img.src = theme.backgroundImage;
      } catch (e) {
        if (isAbortError(e)) return;
        console.error("Results load failed:", e);
        if (!cancelled) {
          setLoadError(
            e instanceof Error ? e.message : "Could not load your comparison."
          );
        }
      }
    }

    void load();
    return () => {
      cancelled = true;
      ac.abort();
    };
  }, [router, retryKey]);

  useEffect(() => {
    if (!interpretation || interpretationTrackedRef.current) return;
    interpretationTrackedRef.current = true;
    void trackEvent("interpretation_view", {
      source: interpretationSource ?? "unknown",
    });
  }, [interpretation, interpretationSource]);

  const persistCurrentResults = useCallback(async (): Promise<string> => {
    if (!interpretation) {
      throw new Error("No interpretation");
    }
    const existing = savedIdRef.current;
    if (existing) {
      return existing;
    }
    const u = auth.currentUser;
    if (!u) {
      throw new Error("Not signed in");
    }
    const answers = loadSurveyAnswers();
    if (!answers) {
      throw new Error("No survey answers");
    }
    const id = generateSessionId();
    await saveTripSession(id, answers, interpretation, u.uid);
    void trackEvent("trip_saved", { session_id: id });
    savedIdRef.current = id;
    setSavedSessionId(id);
    router.replace(`/results/${id}`);
    return id;
  }, [interpretation, router]);

  const executeSave = useCallback(async () => {
    if (!interpretation || saveBusy) return;
    if (savedIdRef.current) return;
    const u = auth.currentUser;
    if (!u) return;
    setSaveBusy(true);
    try {
      await persistCurrentResults();
    } catch (error) {
      console.error("Failed to save trip session:", error);
    } finally {
      setSaveBusy(false);
    }
  }, [interpretation, persistCurrentResults, saveBusy]);

  const executeShare = useCallback(async () => {
    if (!interpretation || shareBusy) return;
    const u = auth.currentUser;
    if (!u) return;
    setShareBusy(true);
    setShareCopied(false);
    try {
      const id = await persistCurrentResults();
      const url = `${window.location.origin}/results/${id}`;
      await navigator.clipboard.writeText(url);
      setShareCopied(true);
      window.setTimeout(() => setShareCopied(false), 2500);
    } catch (error) {
      console.error("Share failed:", error);
    } finally {
      setShareBusy(false);
    }
  }, [interpretation, persistCurrentResults, shareBusy]);

  const openAuthFor = useCallback((action: "save" | "share") => {
    pendingRef.current = action;
    setAuthModalOpen(true);
  }, []);

  const handleSaveClick = useCallback(() => {
    if (!interpretation || savedSessionId || savedIdRef.current) return;
    if (!auth.currentUser) {
      openAuthFor("save");
      return;
    }
    void executeSave();
  }, [interpretation, savedSessionId, executeSave, openAuthFor]);

  const handleShareClick = useCallback(() => {
    if (!interpretation) return;
    if (!auth.currentUser) {
      openAuthFor("share");
      return;
    }
    void executeShare();
  }, [interpretation, executeShare, openAuthFor]);

  const onAuthSignedIn = useCallback(() => {
    setAuthModalOpen(false);
    const p = pendingRef.current;
    pendingRef.current = null;
    if (p === "save") void executeSave();
    else if (p === "share") void executeShare();
  }, [executeSave, executeShare]);

  if (!interpretation) {
    return loadError ? (
      <LoadingScreen relatedPhrases={travelFactHints}>
        <div className="mx-auto mb-8 w-full max-w-md px-2 text-center">
          <p className="mb-4 text-sm leading-relaxed text-red-200">{loadError}</p>
          <Button
            type="button"
            size="sm"
            onClick={() => {
              setLoadError(null);
              setRetryKey((k) => k + 1);
            }}
          >
            Try again
          </Button>
          <p className="mt-4 text-xs text-stone-400">
            If this keeps happening, open the browser console and check the Network
            tab for <code className="text-stone-300">/api/interpret-trip</code>.
          </p>
        </div>
      </LoadingScreen>
    ) : (
      <LoadingScreen relatedPhrases={travelFactHints} />
    );
  }

  const theme = getTheme(interpretation.selectedTheme);
  const surveyAnswers = loadSurveyAnswers();
  const bannerAnswers = user ? surveyAnswers : null;
  const destinationTitle = getResultsDestinationTitle(surveyAnswers, interpretation);

  return (
    <>
      <AuthPromptModal
        open={authModalOpen}
        onClose={() => {
          pendingRef.current = null;
          setAuthModalOpen(false);
        }}
        onSignedIn={onAuthSignedIn}
        title="Sign in to continue"
        description="Sign in with Google to save this comparison to your account or copy a share link."
      />

      <SeamlessParallaxBackground
        imageUrl={backgroundImage}
        durationSec={150}
        imageFilter="opacity(0.5) saturate(0.5) brightness(1.15)"
        wrapperClassName="fixed inset-0 z-0"
      />

      <div className="relative z-10 min-h-screen text-stone-900">
        <TwinklingStars />
        <div className="relative z-10 mx-auto max-w-5xl px-6 py-12">
          <ResultsSaveShareToolbar
            showSave
            saveLabel={savedSessionId ? "Saved" : "Save"}
            saveDisabled={Boolean(savedSessionId) || saveBusy}
            onSave={handleSaveClick}
            shareDisabled={shareBusy}
            onShare={handleShareClick}
            shareCopied={shareCopied}
          />

          <WandertypeBanner
            theme={theme}
            surveyAnswers={bannerAnswers}
            destinationTitle={destinationTitle}
          />

          {interpretationSource === "fallback" && (
            <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50/95 px-3 py-2.5 text-xs leading-relaxed text-amber-900">
              <p className="font-medium text-amber-950">
                Preview mode — we couldn&apos;t finish the personalized interpretation
                right now, so this board uses built-in hints from your answers instead of
                a full AI run.
              </p>
              <p className="mt-2 text-[11px] text-amber-900/90">
                Site owners: failures usually mean missing AI credentials on the server,
                the AI service errored, or the response didn&apos;t validate — check
                Vercel env vars and logs for{" "}
                <code className="rounded bg-amber-100/80 px-1 text-[10px]">
                  POST /api/interpret-trip
                </code>
                .
              </p>
            </div>
          )}

          <div className="mb-5 border-b border-stone-200 pb-3 text-[10px] font-medium uppercase tracking-wide text-stone-400">
            Your Destinations — Matched to Your Profile
          </div>

          <div
            className={`${comparisonGridClassName(
              interpretation.comparisonCards.length
            )} mb-12`}
          >
            {interpretation.comparisonCards.map((card, index) => (
              <DestinationCard
                key={card.destinationName}
                card={card}
                index={index}
                theme={theme}
              />
            ))}
          </div>

          <ResultsInsightsAccordions interpretation={interpretation} />

          <p className="mt-12 text-center text-xs italic tracking-wide text-stone-500">
            Built with VoyageBlitz · Your trip, matched to you 🎈
          </p>
        </div>
      </div>
    </>
  );
}
