"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ProgressBar } from "@/components/ProgressBar";
import { SurveyHeader } from "@/components/SurveyHeader";
import { saveSurveyAnswers, loadSurveyAnswers } from "@/lib/surveyStorage";
import type { SurveyAnswers } from "@/types/survey";
import { Step1 } from "./steps/Step1";
import { Step2 } from "./steps/Step2";
import { Step3 } from "./steps/Step3";
import { Step4 } from "./steps/Step4";
import { Step5 } from "./steps/Step5";
import { Step6 } from "./steps/Step6";
import { Step7 } from "./steps/Step7";
import { Step8 } from "./steps/Step8";

type SurveyStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export default function SurveyPage() {
  const router = useRouter();
  const [step, setStep] = useState<SurveyStep>(1);
  const [maxStepReached, setMaxStepReached] = useState<number>(1);
  
  // Initialize answers from localStorage to avoid overwriting
  const [answers, setAnswers] = useState<SurveyAnswers>(() => {
    const saved = loadSurveyAnswers();
    console.log('Survey page initializing with:', saved);
    return saved || {};
  });
  
  const [isFinalAnimation, setIsFinalAnimation] = useState(false);
  const hasInitialized = useRef(false);

  // Only save to localStorage after the first render (not on mount)
  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      return;
    }
    console.log('Survey page saving answers:', answers);
    saveSurveyAnswers(answers);
  }, [answers]);

  useEffect(() => {
    if (step > maxStepReached) {
      setMaxStepReached(step);
    }
  }, [step, maxStepReached]);

  const updateAnswer = <K extends keyof SurveyAnswers>(
    key: K,
    value: SurveyAnswers[K]
  ) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const goNext = () => {
    if (step < 8) {
      setStep((prev) => (prev + 1) as SurveyStep);
    } else {
      // Final step - trigger balloon animation then navigate
      setIsFinalAnimation(true);
      setTimeout(() => {
        router.push("/results");
      }, 1000);
    }
  };

  const goBack = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as SurveyStep);
    } else {
      router.push("/");
    }
  };

  const goToStep = (targetStep: number) => {
    if (targetStep <= maxStepReached && targetStep >= 1 && targetStep <= 8) {
      setStep(targetStep as SurveyStep);
    }
  };

  return (
    <>
      <div className="min-h-screen py-8 pb-32">
        {/* Full-width header with logo and auth at screen edges */}
        <div className="px-6 mb-4">
          <SurveyHeader />
        </div>
        
        {/* Centered progress bar */}
        <div className="px-4 max-w-3xl mx-auto">
          <ProgressBar 
            current={step} 
            total={8} 
            maxStepReached={maxStepReached}
            onStepClick={goToStep}
            isFinalAnimation={isFinalAnimation}
          />

        {step === 1 && (
          <Step1
            selected={answers.tripMood}
            tripLengthNights={answers.tripLengthNights}
            onSelect={(value) => updateAnswer("tripMood", value as any)}
            onTripLengthChange={(value) => updateAnswer("tripLengthNights", value)}
            onNext={goNext}
            onBack={goBack}
          />
        )}

        {step === 2 && (
          <Step2
            selected={answers.pace}
            onSelect={(value) => updateAnswer("pace", value as any)}
            onNext={goNext}
            onBack={goBack}
          />
        )}

        {step === 3 && (
          <Step3
            selected={answers.environment}
            onSelect={(value) => updateAnswer("environment", value as any)}
            onNext={goNext}
            onBack={goBack}
          />
        )}

        {step === 4 && (
          <Step4
            groupType={answers.groupType}
            groupAlignment={answers.groupAlignment}
            onUpdateGroupType={(value) => updateAnswer("groupType", value as any)}
            onUpdateGroupAlignment={(value) => updateAnswer("groupAlignment", value as any)}
            onNext={goNext}
            onBack={goBack}
          />
        )}

        {step === 5 && (
          <Step5
            selected={answers.activities || []}
            onSelect={(value) => updateAnswer("activities", value)}
            onNext={goNext}
            onBack={goBack}
          />
        )}

        {step === 6 && (
          <Step6
            frictionTolerance={answers.frictionTolerance}
            dealbreakers={answers.dealbreakers || []}
            onUpdateFrictionTolerance={(value) => updateAnswer("frictionTolerance", value as any)}
            onUpdateDealbreakers={(value) => updateAnswer("dealbreakers", value)}
            onNext={goNext}
            onBack={goBack}
          />
        )}

        {step === 7 && (
          <Step7
            selected={answers.budgetFeel}
            onSelect={(value) => updateAnswer("budgetFeel", value as any)}
            onNext={goNext}
            onBack={goBack}
          />
        )}

        {step === 8 && (
          <Step8
            value={answers.openText || ""}
            onChange={(value) => updateAnswer("openText", value)}
            answers={answers}
            onNext={goNext}
            onBack={goBack}
            onNavigateToStep={goToStep}
          />
        )}
      </div>
    </div>
    </>
  );
}
