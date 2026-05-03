"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { saveSurveyAnswers, loadSurveyAnswers, clearSurveyAnswers } from "@/lib/surveyStorage";
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
    console.log('handleUpdate called with:', { hasDestinations, destinations });
    const updated = {
      ...answers,
      chooseForMe: !hasDestinations,
      destinations: destinations,
      // Legacy fields for backward compatibility
      hasDestinations,
      destinationList: destinations,
    };
    console.log('Landing page saving to localStorage:', updated);
    setAnswers(updated);
    saveSurveyAnswers(updated);
    
    // Verify it was saved
    setTimeout(() => {
      const saved = loadSurveyAnswers();
      console.log('Verified saved data:', saved);
    }, 100);
  };

  const handleNext = () => {
    console.log('handleNext called, navigating to survey');
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
          hasDestinations={answers.hasDestinations || !answers.chooseForMe}
          destinationList={answers.destinations || answers.destinationList}
          onUpdate={handleUpdate}
          onNext={handleNext}
        />
      </div>
    </div>
  );
}
