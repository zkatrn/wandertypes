"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getTripSession, type TripSession } from "@/lib/firestore";
import { getTheme } from "@/lib/themes";
import { WandertypeBanner } from "@/components/results/WandertypeBanner";
import { DestinationCard } from "@/components/results/DestinationCard";
import { ResultsInsightsAccordions } from "@/components/results/ResultsInsightsAccordions";
import { TwinklingStars } from "@/components/results/TwinklingStars";
import { ResultsSaveShareToolbar } from "@/components/results/ResultsSaveShareToolbar";
import { AuthPromptModal } from "@/components/auth/AuthPromptModal";
import { comparisonGridClassName } from "@/lib/resultsLayout";
import type { TripInterpretation } from "@/types/interpretation";
import { AlertCircle } from "lucide-react";
import { SimplePageLoader } from "@/components/loading/SimplePageLoader";
import { getResultsDestinationTitle } from "@/lib/tripListTitle";

export default function SharedResultsPage() {
  const params = useParams();
  const sessionId = params.id as string;
  const [session, setSession] = useState<TripSession | null>(null);
  const [interpretation, setInterpretation] = useState<TripInterpretation | null>(null);
  const [loading, setLoading] = useState(true);
  const [backgroundImage, setBackgroundImage] = useState<string>("/bg.png");
  const [user, setUser] = useState<User | null>(null);
  const [shareCopied, setShareCopied] = useState(false);
  const [shareBusy, setShareBusy] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const pendingShareRef = useRef(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  useEffect(() => {
    async function loadSession() {
      try {
        const s = await getTripSession(sessionId);
        if (s) {
          setSession(s);
          setInterpretation(s.interpretation);

          const theme = getTheme(s.interpretation.selectedTheme);
          const img = new Image();
          img.onload = () => {
            setBackgroundImage(theme.backgroundImage);
          };
          img.onerror = () => {
            setBackgroundImage("/bg.png");
          };
          img.src = theme.backgroundImage;
        }
      } catch (error) {
        console.error("Failed to load session:", error);
      } finally {
        setLoading(false);
      }
    }

    void loadSession();
  }, [sessionId]);

  const copyShareUrl = useCallback(async () => {
    setShareBusy(true);
    setShareCopied(false);
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareCopied(true);
      window.setTimeout(() => setShareCopied(false), 2500);
    } catch (error) {
      console.error("Copy failed:", error);
    } finally {
      setShareBusy(false);
    }
  }, []);

  const handleShareClick = useCallback(() => {
    if (!auth.currentUser) {
      pendingShareRef.current = true;
      setAuthModalOpen(true);
      return;
    }
    void copyShareUrl();
  }, [copyShareUrl]);

  const onAuthSignedIn = useCallback(() => {
    setAuthModalOpen(false);
    if (pendingShareRef.current) {
      pendingShareRef.current = false;
      void copyShareUrl();
    }
  }, [copyShareUrl]);

  if (loading) {
    return (
      <SimplePageLoader message="Loading your saved comparison…" />
    );
  }

  if (!interpretation || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-sky-900 via-indigo-800 to-blue-900 p-4">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 h-16 w-16 text-red-400" />
          <h2 className="mb-2 text-2xl font-bold text-white">Results Not Found</h2>
          <p className="text-stone-200">
            This travel comparison doesn&apos;t exist or has been deleted.
          </p>
        </div>
      </div>
    );
  }

  const theme = getTheme(interpretation.selectedTheme);
  const isOwner = Boolean(
    user?.uid && session.userId && user.uid === session.userId
  );
  const bannerAnswers = isOwner ? session.surveyAnswers : null;
  const destinationTitle = getResultsDestinationTitle(
    session.surveyAnswers,
    interpretation
  );

  return (
    <>
      <AuthPromptModal
        open={authModalOpen}
        onClose={() => {
          pendingShareRef.current = false;
          setAuthModalOpen(false);
        }}
        onSignedIn={onAuthSignedIn}
        title="Sign in to share"
        description="Sign in with Google to copy a link to this comparison."
      />

      <div
        className="pointer-events-none fixed inset-0 z-0 bg-app-photo-backdrop bg-parallax"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundAttachment: "scroll",
          filter: "opacity(0.5) saturate(0.5) brightness(1.15)",
        }}
        aria-hidden
      />

      <div className="relative z-10 min-h-screen text-stone-900">
        <TwinklingStars />
        <div className="relative z-10 mx-auto max-w-5xl px-6 py-12">
          <ResultsSaveShareToolbar
            shareDisabled={shareBusy}
            onShare={handleShareClick}
            shareCopied={shareCopied}
          />

          <WandertypeBanner
            theme={theme}
            surveyAnswers={bannerAnswers}
            destinationTitle={destinationTitle}
          />

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
