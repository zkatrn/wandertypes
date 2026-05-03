"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getTripSession } from "@/lib/firestore";
import { getTheme } from "@/lib/themes";
import { WandertypeBanner } from "@/components/results/WandertypeBanner";
import { DestinationCard } from "@/components/results/DestinationCard";
import { AccordionSection } from "@/components/results/AccordionSection";
import { TwinklingStars } from "@/components/results/TwinklingStars";
import type { TripInterpretation } from "@/types/interpretation";
import { AlertCircle } from "lucide-react";

export default function SharedResultsPage() {
  const params = useParams();
  const sessionId = params.id as string;
  const [interpretation, setInterpretation] = useState<TripInterpretation | null>(null);
  const [loading, setLoading] = useState(true);
  const [backgroundImage, setBackgroundImage] = useState<string>("/bg.png");

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-900 via-indigo-800 to-blue-900">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-stone-200">Loading your travel comparison...</p>
        </div>
      </div>
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
        <WandertypeBanner theme={theme} surveyAnswers={null} />

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
  );
}