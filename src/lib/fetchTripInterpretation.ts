import type { SurveyAnswers } from "@/types/survey";
import type { TripInterpretation } from "@/types/interpretation";
import { generateMockInterpretation } from "@/lib/mockInterpretation";
import { normalizeTripInterpretation } from "@/lib/normalizeInterpretation";
import { applyComparisonCardPolicy } from "@/lib/comparisonCardPolicy";

export type TripInterpretationSource = "ai" | "fallback";

export type FetchTripInterpretationResult = {
  interpretation: TripInterpretation;
  source: TripInterpretationSource;
};

export function isAbortError(e: unknown): boolean {
  return (
    typeof e === "object" &&
    e !== null &&
    "name" in e &&
    (e as { name: string }).name === "AbortError"
  );
}

/**
 * Calls the server interpret-trip route. On network or validation failure,
 * returns a survey-driven mock so the results page always has data.
 * Pass `signal` to cancel (e.g. React Strict Mode remount); aborted requests
 * rethrow and must not be treated as model failure.
 */
export async function fetchTripInterpretation(
  surveyAnswers: SurveyAnswers,
  options?: { signal?: AbortSignal },
): Promise<FetchTripInterpretationResult> {
  try {
    const res = await fetch("/api/interpret-trip", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ surveyAnswers }),
      signal: options?.signal,
    });
    const rawBody = await res.text();
    let data: { interpretation?: TripInterpretation; error?: string } = {};
    if (rawBody.trim()) {
      try {
        data = JSON.parse(rawBody) as typeof data;
      } catch {
        console.warn(
          "interpret-trip response was not JSON:",
          res.status,
          rawBody.slice(0, 240)
        );
      }
    }
    if (res.ok && data.interpretation) {
      return { interpretation: data.interpretation, source: "ai" };
    }
    console.warn("interpret-trip not ok:", res.status, data.error);
  } catch (e) {
    if (isAbortError(e)) throw e;
    console.error("interpret-trip fetch failed:", e);
  }
  try {
    const raw = generateMockInterpretation(surveyAnswers);
    let interpretation = normalizeTripInterpretation(
      raw as Partial<TripInterpretation> & Record<string, unknown>
    );
    interpretation = applyComparisonCardPolicy(interpretation, surveyAnswers);
    return {
      interpretation,
      source: "fallback",
    };
  } catch (e) {
    console.error("fallback interpretation failed:", e);
    throw e instanceof Error ? e : new Error("Could not build trip preview");
  }
}
