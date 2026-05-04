"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { getTripSession } from "@/lib/firestore";
import { getTheme } from "@/lib/themes";
import { WandertypeBanner } from "@/components/results/WandertypeBanner";
import { DestinationCard } from "@/components/results/DestinationCard";
import { ResultsInsightsAccordions } from "@/components/results/ResultsInsightsAccordions";
import { TwinklingStars } from "@/components/results/TwinklingStars";
import { comparisonGridClassName } from "@/lib/resultsLayout";
import type { TripInterpretation } from "@/types/interpretation";
import { AlertCircle } from "lucide-react";
import { LoadingScreen } from "@/components/loading/LoadingScreen";
import { loadSurveyAnswers } from "@/lib/surveyStorage";

export default function SharedResultsPage() {
  const params = useParams();
  const sessionId = params.id as string;
  const [interpretation, setInterpretation] = useState<TripInterpretation | null>(null);
  const [loading, setLoading] = useState(true);
  const [backgroundImage, setBackgroundImage] = useState<string>("/bg.png");

  const travelFactHints = useMemo(() => {
    const a = loadSurveyAnswers();
    return [
      ...(a?.destinations ?? []),
      ...(a?.destinationList ?? []),
    ].filter((s): s is string => Boolean(s?.trim()));
  }, []);

  useEffect(() => {
    async function loadSession() {
      try {
        const session = await getTripSession(sessionId);
        if (session) {
          setInterpretation(session.interpretation);
          
          // Set theme-specific background with parallax
          const theme = getTheme(session.interpretation.selectedTheme);
          const img = new Image();
          img.onload = () => {
            setBackgroundImage(theme.backgroundImage);
          };
          img.onerror = () => {
            // Fallback to default background if theme image doesn't exist
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

    loadSession();
  }, [sessionId]);

  if (loading) {
    return (
      <LoadingScreen
        relatedPhrases={travelFactHints}
        statusSteps={["Loading your travel comparison..."]}
      />
    );
  }

  if (!interpretation) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-sky-900 via-indigo-800 to-blue-900">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Results Not Found</h2>
          <p className="text-stone-200">This travel comparison doesn't exist or has been deleted.</p>
        </div>
      </div>
    );
  }

  const theme = getTheme(interpretation.selectedTheme);

  return (
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
        <WandertypeBanner theme={theme} surveyAnswers={null} />

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
            <DestinationCard
              key={card.destinationName}
              card={card}
              index={index}
              theme={theme}
            />
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
  );
}