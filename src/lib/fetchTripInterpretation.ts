import type { SurveyAnswers } from "@/types/survey";
import type { TripInterpretation } from "@/types/interpretation";
import { generateMockInterpretation } from "@/lib/mockInterpretation";

export type TripInterpretationSource = "ai" | "fallback";

export type FetchTripInterpretationResult = {
  interpretation: TripInterpretation;
  source: TripInterpretationSource;
};

/**
 * Calls the server interpret-trip route. On network or validation failure,
 * returns a survey-driven mock so the results page always has data.
 */
export async function fetchTripInterpretation(
  surveyAnswers: SurveyAnswers
): Promise<FetchTripInterpretationResult> {
  try {
    const res = await fetch("/api/interpret-trip", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ surveyAnswers }),
    });
    const data = (await res.json()) as {
      interpretation?: TripInterpretation;
      error?: string;
    };
    if (res.ok && data.interpretation) {
      return { interpretation: data.interpretation, source: "ai" };
    }
    console.warn("interpret-trip not ok:", res.status, data.error);
  } catch (e) {
    console.error("interpret-trip fetch failed:", e);
  }
  return {
    interpretation: generateMockInterpretation(surveyAnswers),
    source: "fallback",
  };
}
