"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { loadSurveyAnswers } from "@/lib/surveyStorage";
import { saveTripSession, generateSessionId } from "@/lib/firestore";
import { getTheme } from "@/lib/themes";
import { AuthGate } from "@/components/AuthGate";
import { WandertypeBanner } from "@/components/results/WandertypeBanner";
import { DestinationCard } from "@/components/results/DestinationCard";
import { AccordionSection } from "@/components/results/AccordionSection";
import { TwinklingStars } from "@/components/results/TwinklingStars";
import type { TripInterpretation } from "@/types/interpretation";
import { fetchTripInterpretation } from "@/lib/fetchTripInterpretation";
import type { TripInterpretationSource } from "@/lib/fetchTripInterpretation";

export default function ResultsPage() {
  const router = useRouter();
  const [interpretation, setInterpretation] = useState<TripInterpretation | null>(null);
  const [interpretationSource, setInterpretationSource] =
    useState<TripInterpretationSource | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string>("/bg.png");
  const sessionSavedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
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
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [router]);

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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-900 via-indigo-800 to-blue-900">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-stone-200">Generating your personalized comparison...</p>
          </div>
        </div>
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
          className="fixed inset-0 z-0 bg-parallax"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundPosition: 'center',
            backgroundAttachment: 'scroll',
            filter: 'opacity(0.5) saturate(0.5) brightness(1.15)',
          }}
        />
        
        <div className="min-h-screen text-stone-900 relative">
          <TwinklingStars />
          <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">
          {/* Wandertype Banner */}
          <WandertypeBanner theme={theme} surveyAnswers={surveyAnswers} />

          {interpretationSource === "fallback" && (
            <p className="mb-5 text-xs text-amber-900 bg-amber-50/95 border border-amber-200 rounded-lg px-3 py-2.5 leading-relaxed">
              We could not run the full AI interpreter (missing API key or a
              temporary error). Showing a quick preview built from your answers
              instead.
            </p>
          )}

          {/* Section Label */}
          <div className="text-[10px] uppercase tracking-wide text-stone-400 font-medium mb-5 pb-3 border-b border-stone-200">
            Your Destinations — Matched to Your Profile
          </div>

          {/* Destination Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-12">
            {interpretation.comparisonCards.map((card, index) => (
              <DestinationCard key={card.destinationName} card={card} index={index} />
            ))}
          </div>

          {/* Accordions */}
          <div className="space-y-4">
            <AccordionSection
              title="🗺️ Adventure Options by Base"
              defaultOpen={false}
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-stone-900 mb-3 font-serif">🌋 La Fortuna / Arenal</h4>
                  <ul className="space-y-2 text-xs">
                    <li className="pb-2 border-b border-white/5">
                      <a href="#"                     className="text-primary hover:text-primary-dark transition-colors">
                      <span className="text-primary font-medium">Arenal Volcano ★</span>
                    </a>
                    <span className="text-stone-600"> — 10–25 min</span>
                    </li>
                    <li className="pb-2 border-b border-white/5">
                      <a href="#" className="text-blue-300 hover:text-amber-400 transition-colors">
                        <span className="text-amber-400 font-medium">La Fortuna Waterfall ★</span>
                      </a>
                      <span className="text-blue-200"> — 10–20 min</span>
                    </li>
                    <li className="pb-2 border-b border-white/5">
                      <a href="#" className="text-blue-300 hover:text-amber-400 transition-colors">
                        <span className="text-amber-400 font-medium">Hot Springs ★</span>
                      </a>
                      <span className="text-blue-200"> — 10–25 min</span>
                    </li>
                    <li className="pb-2 border-b border-white/5">
                      <a href="#" className="text-blue-300 hover:text-amber-400 transition-colors">
                        Ziplining
                      </a>
                      <span className="text-blue-200"> — 10–30 min</span>
                    </li>
                    <li>
                      <a href="#" className="text-blue-300 hover:text-amber-400 transition-colors">
                        Whitewater Rafting
                      </a>
                      <span className="text-blue-200"> — 30–90 min</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-amber-400 mb-3">🌊 Playa Hermosa / Guanacaste</h4>
                  <ul className="space-y-2 text-xs">
                    <li className="pb-2 border-b border-white/5">
                      <a href="#" className="text-blue-300 hover:text-amber-400 transition-colors">
                        Playa Hermosa beach
                      </a>
                      <span className="text-blue-200"> — 0–10 min</span>
                    </li>
                    <li className="pb-2 border-b border-white/5">
                      <a href="#" className="text-blue-300 hover:text-amber-400 transition-colors">
                        Boat / snorkeling tours
                      </a>
                      <span className="text-blue-200"> — 15–45 min</span>
                    </li>
                    <li className="pb-2 border-b border-white/5">
                      <a href="#" className="text-blue-300 hover:text-amber-400 transition-colors">
                        <span className="text-amber-400 font-medium">Rincón de la Vieja ★</span>
                      </a>
                      <span className="text-blue-200"> — 1h 30m–2h</span>
                    </li>
                    <li className="pb-2 border-b border-white/5">
                      <a href="#" className="text-blue-300 hover:text-amber-400 transition-colors">
                        Catamaran sunset cruise
                      </a>
                      <span className="text-blue-200"> — 15–45 min</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-amber-400 mb-3">🌿 Savegre / Dominical / Uvita</h4>
                  <ul className="space-y-2 text-xs">
                    <li className="pb-2 border-b border-white/5">
                      <a href="#" className="text-blue-300 hover:text-amber-400 transition-colors">
                        <span className="text-amber-400 font-medium">Nauyaca Waterfalls ★</span>
                      </a>
                      <span className="text-blue-200"> — 30–60 min</span>
                    </li>
                    <li className="pb-2 border-b border-white/5">
                      <a href="#" className="text-blue-300 hover:text-amber-400 transition-colors">
                        <span className="text-amber-400 font-medium">Manuel Antonio Park ★</span>
                      </a>
                      <span className="text-blue-200"> — 60–90 min</span>
                    </li>
                    <li className="pb-2 border-b border-white/5">
                      <a href="#" className="text-blue-300 hover:text-amber-400 transition-colors">
                        Whale / boat tours
                      </a>
                      <span className="text-blue-200"> — 45–75 min</span>
                    </li>
                    <li>
                      <a href="#" className="text-blue-300 hover:text-amber-400 transition-colors">
                        Beach hopping
                      </a>
                      <span className="text-blue-200"> — 20–90 min</span>
                    </li>
                  </ul>
                </div>
              </div>
            </AccordionSection>

            <AccordionSection
              title="💡 Things You Might Not Be Thinking About"
              defaultOpen={false}
            >
              <div className="space-y-3">
                {interpretation.tradeoffWarnings.map((warning, index) => (
                  <div
                    key={index}
                    className="p-3 bg-stone-50/95 border border-stone-200 rounded-lg text-xs text-stone-700 leading-relaxed"
                  >
                    {warning}
                  </div>
                ))}
              </div>
            </AccordionSection>

            <AccordionSection
              title="⭐ Bottom Line"
              defaultOpen={false}
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-5">
                {interpretation.comparisonCards.map((card, index) => (
                  <div
                    key={card.destinationName}
                  className={`p-5 bg-stone-50/95 border rounded-lg border-l-4 ${
                    index === 0 ? 'border-l-orange-500' :
                    index === 1 ? 'border-l-cyan-500' :
                    'border-l-green-500'
                  } border-stone-200`}
                  >
                  <h4 className="text-sm font-medium text-stone-900 mb-2 font-serif">
                    {card.destinationName.split('/')[0].trim()}
                  </h4>
                  <p className="text-xs text-stone-700 italic">{card.verdictGood}</p>
                  </div>
                ))}
              </div>
            </AccordionSection>
          </div>

          {/* Footer */}
          <p className="text-center mt-12 text-xs text-stone-500 italic tracking-wide">
            Built with Wandermoodz · Your trip, matched to you 🎈
          </p>
          </div>
        </div>
      </>
    </AuthGate>
  );
}