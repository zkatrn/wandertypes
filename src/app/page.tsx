"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { saveSurveyAnswers, clearSurveyAnswers } from "@/lib/surveyStorage";
import { Step0 } from "./survey/steps/Step0";
import { SurveyHeader } from "@/components/SurveyHeader";
import type { SurveyAnswers } from "@/types/survey";

export default function HomePage() {
  const router = useRouter();
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
    <div className="min-h-screen py-8">
      {/* Full-width header with logo and auth at screen edges */}
      <div className="px-6 mb-4">
        <SurveyHeader />
      </div>
      
      {/* Centered content */}
      <div className="px-4 max-w-3xl mx-auto">
        <Step0
          destinationList={answers.destinations || answers.destinationList}
          onUpdate={handleUpdate}
          onNext={handleNext}
        />
      </div>
    </div>
  );
}
