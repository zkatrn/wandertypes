"use client";

import Link from "next/link";
import type { Theme } from "@/lib/themes";
import { tripLengthDisplayLabel, type SurveyAnswers } from "@/types/survey";

interface WandertypeBannerProps {
  theme: Theme;
  surveyAnswers: SurveyAnswers | null;
  /** Main hero line — typically comma-separated places from the survey or comparison. */
  destinationTitle: string;
}

export function WandertypeBanner({
  theme,
  surveyAnswers,
  destinationTitle,
}: WandertypeBannerProps) {
  const wandertypeHref = `/wandertypes#${theme.key}`;

  // Generate trip context pills from survey answers
  const getTripPills = () => {
    const pills: string[] = [];

    if (surveyAnswers?.destinations?.length) {
      pills.push(
        `${surveyAnswers.destinations.length} destination${surveyAnswers.destinations.length > 1 ? "s" : ""}`
      );
    } else if (surveyAnswers?.chooseForMe) {
      pills.push("Choose for me");
    }

    const tripLen = tripLengthDisplayLabel(surveyAnswers?.tripLengthNights);
    if (tripLen) {
      pills.push(tripLen);
    }

    if (surveyAnswers?.groupType) {
      const groupLabels: Record<string, string> = {
        solo: "Solo trip",
        couple: "Couple",
        friends_small: "Small group",
        friends_large: "Large group",
        family: "Family",
      };
      pills.push(groupLabels[surveyAnswers.groupType] || "Group trip");
    }

    if (surveyAnswers?.pace) {
      const paceLabels: Record<string, string> = {
        slow: "Slow pace",
        moderate: "Moderate pace",
        busy: "Busy pace",
        packed: "Packed itinerary",
        spontaneous: "Spontaneous",
      };
      pills.push(paceLabels[surveyAnswers.pace] || "Flexible pace");
    }

    if (surveyAnswers?.environment) {
      const envLabels: Record<string, string> = {
        ocean: "Ocean vibes",
        mountains: "Mountain retreat",
        rainforest: "Rainforest adventure",
        culture: "Cultural immersion",
        city_energy: "City energy",
        desert: "Desert escape",
        remote: "Remote wilderness",
      };
      pills.push(envLabels[surveyAnswers.environment] || surveyAnswers.environment);
    }

    if (surveyAnswers?.budgetFeel) {
      const budgetLabels: Record<string, string> = {
        stretch_dream: "Dream trip budget",
        comfort_plus: "Comfortable budget",
        reasonable: "Reasonable budget",
        conscious: "Budget conscious",
        fit_over_budget: "Experience over budget",
      };
      pills.push(budgetLabels[surveyAnswers.budgetFeel] || "Flexible budget");
    }

    return pills;
  };

  const tripPills = getTripPills();

  return (
    <div className="text-center mb-12 p-10 bg-stone-50/95 border border-stone-200 rounded-3xl relative overflow-hidden">
      <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 w-80 h-52 bg-gradient-radial from-amber-400/10 to-transparent pointer-events-none" />

      <div className="relative z-10">
        <p className="text-[10px] uppercase tracking-wide text-stone-400 font-medium mb-3">
          Your trip
        </p>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl text-stone-900 font-bold leading-tight mb-10 tracking-tight font-serif px-2">
          {destinationTitle}
        </h1>
{/* 
        <div className="text-[10px] uppercase tracking-wide text-stone-400 font-medium mb-3">
          Your Wandertype
        </div>

        <Link
          href={wandertypeHref}
          className="group inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg"
        >
          <div className="text-3xl sm:text-4xl lg:text-5xl text-primary font-bold leading-tight mb-3 tracking-tight font-serif group-hover:text-primary-dark transition-colors">
            {theme.title}
          </div>
          <span className="text-xs text-primary/80 font-medium opacity-0 group-hover:opacity-100 transition-opacity block -mt-1 mb-2">
            Learn more about this type →
          </span>
        </Link>

        <div className="text-lg italic text-stone-600 mb-5 max-w-2xl mx-auto">
          &ldquo;{theme.description}&rdquo;
        </div>

        <p className="text-sm text-stone-700 leading-relaxed max-w-2xl mx-auto mb-6">
          {theme.longDescription}
        </p> */}

        {tripPills.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center">
            {tripPills.map((pill, index) => (
              <span
                key={index}
                className="px-4 py-2 border border-stone-200 bg-stone-50/95 text-stone-700 rounded-full text-xs font-medium tracking-wide"
              >
                {pill}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
