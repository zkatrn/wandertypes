"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { saveSurveyAnswers, clearSurveyAnswers } from "@/lib/surveyStorage";
import { Step0 } from "./survey/steps/Step0";
import { SurveyHeader } from "@/components/SurveyHeader";
import { LandingMarketingAtmosphere } from "@/components/landing/LandingMarketingAtmosphere";
import { LandingMarketingFixedStarfield } from "@/components/landing/LandingMarketingFixedStarfield";
import { LandingMarketingSections } from "@/components/landing/LandingMarketingSections";
import type { SurveyAnswers } from "@/types/survey";

export default function HomePage() {
  const router = useRouter();
  const marketingColumnRef = useRef<HTMLDivElement>(null);
  const [answers, setAnswers] = useState<SurveyAnswers>({});

  useEffect(() => {
    // Clear localStorage when landing on homepage to start fresh
    clearSurveyAnswers();
    setAnswers({});
  }, []);

  const handleUpdate = (hasDestinations: boolean, destinations: string[]) => {
    setAnswers((prev) => {
      const updated: SurveyAnswers = {
        ...prev,
        chooseForMe: !hasDestinations,
        destinations,
        hasDestinations,
        destinationList: destinations,
      };
      saveSurveyAnswers(updated);
      return updated;
    });
  };

  const handleNext = () => {
    router.push("/survey");
  };

  return (
    <>
      <div className="relative z-20 flex min-h-screen flex-col py-8">
        <div className="shrink-0 px-6 pb-2">
          <SurveyHeader />
        </div>
        <div className="flex flex-1 flex-col justify-center px-4 pb-12">
          <div className="mx-auto w-full max-w-3xl">
            <Step0
              destinationList={answers.destinations || answers.destinationList}
              onUpdate={handleUpdate}
              onNext={handleNext}
              darkHeroCard
            />
          </div>
        </div>
      </div>

      <div ref={marketingColumnRef} className="relative">
        <LandingMarketingAtmosphere />
        <LandingMarketingFixedStarfield anchorRef={marketingColumnRef} />
        <div className="relative z-10">
          <LandingMarketingSections surface="night" />
        </div>
      </div>
    </>
  );
}
