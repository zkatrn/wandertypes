"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { loadSurveyAnswers } from "@/lib/surveyStorage";
import { saveTripSession, generateSessionId } from "@/lib/firestore";
import { getTheme } from "@/lib/themes";
import { AuthGate } from "@/components/AuthGate";
import { LoadingScreen } from "@/components/loading/LoadingScreen";
import { WandertypeBanner } from "@/components/results/WandertypeBanner";
import { DestinationCard } from "@/components/results/DestinationCard";
import { ResultsInsightsAccordions } from "@/components/results/ResultsInsightsAccordions";
import { TwinklingStars } from "@/components/results/TwinklingStars";
import { comparisonGridClassName } from "@/lib/resultsLayout";
import type { TripInterpretation } from "@/types/interpretation";
import { fetchTripInterpretation } from "@/lib/fetchTripInterpretation";
import type { TripInterpretationSource } from "@/lib/fetchTripInterpretation";
import { Button } from "@/components/ui/Button";

export default function ResultsPage() {
  const router = useRouter();
  const [interpretation, setInterpretation] = useState<TripInterpretation | null>(null);
  const [interpretationSource, setInterpretationSource] =
    useState<TripInterpretationSource | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string>("/bg.png");
  const [loadError, setLoadError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);
  const sessionSavedRef = useRef(false);

  const travelFactHints = useMemo(() => {
    const a = loadSurveyAnswers();
    return [
      ...(a?.destinations ?? []),
      ...(a?.destinationList ?? []),
    ].filter((s): s is string => Boolean(s?.trim()));
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoadError(null);
      try {
        const answers = loadSurveyAnswers();
        if (!answers) {
          router.replace("/");
          return;
        }

        const { interpretation: next, source } =
          await fetchTripInterpretation(answers);
        if (cancelled) return;

        setInterpretation(next);
        setInterpretationSource(source);

        const theme = getTheme(next.selectedTheme);
        const img = new Image();
        img.onload = () => {
          if (!cancelled) setBackgroundImage(theme.backgroundImage);
        };
        img.onerror = () => {
          if (!cancelled) setBackgroundImage("/bg.png");
        };
        img.src = theme.backgroundImage;
      } catch (e) {
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
    };
  }, [router, retryKey]);

  useEffect(() => {
    if (!interpretation) return;

    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user || sessionSavedRef.current) return;
      const answers = loadSurveyAnswers();
      if (!answers) return;
      sessionSavedRef.current = true;
      const newSessionId = generateSessionId();
      try {
        await saveTripSession(
          newSessionId,
          answers,
          interpretation,
          user.uid
        );
        router.replace(`/results/${newSessionId}`);
      } catch (error) {
        console.error("Failed to save trip session:", error);
        sessionSavedRef.current = false;
      }
    });

    return () => unsub();
  }, [interpretation, router]);

  if (!interpretation) {
    return (
      <AuthGate>
        {loadError ? (
          <LoadingScreen relatedPhrases={travelFactHints}>
            <div className="w-full max-w-md mx-auto mb-8 text-center px-2">
              <p className="text-red-200 text-sm mb-4 leading-relaxed">{loadError}</p>
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
              <p className="text-stone-400 text-xs mt-4">
                If this keeps happening, open the browser console and check the
                Network tab for{" "}
                <code className="text-stone-300">/api/interpret-trip</code>.
              </p>
            </div>
          </LoadingScreen>
        ) : (
          <LoadingScreen relatedPhrases={travelFactHints} />
        )}
      </AuthGate>
    );
  }

  const theme = getTheme(interpretation.selectedTheme);
  const surveyAnswers = loadSurveyAnswers();

  return (
    <AuthGate>
      <>
        {/* Background image with parallax */}
        <div
          className="fixed inset-0 z-0 bg-app-photo-backdrop bg-parallax pointer-events-none"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundAttachment: "scroll",
            filter: "opacity(0.5) saturate(0.5) brightness(1.15)",
          }}
          aria-hidden
        />

        <div className="min-h-screen text-stone-900 relative z-10">
          <TwinklingStars />
          <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">
          {/* Wandertype Banner */}
          <WandertypeBanner theme={theme} surveyAnswers={surveyAnswers} />

          {interpretationSource === "fallback" && (
            <p className="mb-5 text-xs text-amber-900 bg-amber-50/95 border border-amber-200 rounded-lg px-3 py-2.5 leading-relaxed">
              The AI interpreter did not return a result (often missing{" "}
              <code className="text-[10px] bg-amber-100/80 px-1 rounded">ANTHROPIC_API_KEY</code>{" "}
              on the server, a model error, or validation failure). You are
              seeing an offline preview: airports and activities use built-in
              city hints where we recognize the place, not live model output.
            </p>
          )}

          {/* Section Label */}
          <div className="text-[10px] uppercase tracking-wide text-stone-400 font-medium mb-5 pb-3 border-b border-stone-200">
            Your Destinations — Matched to Your Profile
          </div>

          {/* Destination Cards Grid */}
          <div
            className={`${comparisonGridClassName(
              interpretation.comparisonCards.length
            )} mb-12`}
          >
            {interpretation.comparisonCards.map((card, index) => (
              <DestinationCard key={card.destinationName} card={card} index={index} />
            ))}
          </div>

          <ResultsInsightsAccordions interpretation={interpretation} />

          {/* Footer */}
          <p className="text-center mt-12 text-xs text-stone-500 italic tracking-wide">
            Built with VoyageBlitz · Your trip, matched to you 🎈
          </p>
          </div>
        </div>
      </>
    </AuthGate>
  );
}