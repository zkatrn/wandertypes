import type { TripInterpretation } from "@/types/interpretation";
import type { SurveyAnswers } from "@/types/survey";
import type { TripSession } from "@/lib/firestore";

function destinationPlacesFromSurveyAndCards(
  surveyAnswers: SurveyAnswers | null | undefined,
  interpretation: TripInterpretation
): string {
  const raw = [
    ...(surveyAnswers?.destinations ?? []),
    ...(surveyAnswers?.destinationList ?? []),
  ];
  const seen = new Set<string>();
  const unique: string[] = [];
  for (const s of raw) {
    const t = s.trim();
    if (!t) continue;
    const k = t.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    unique.push(t);
  }
  if (unique.length > 0) {
    return unique.join(", ");
  }

  const cards = interpretation.comparisonCards ?? [];
  const names = cards.map((c) => c.destinationName).filter(Boolean);
  if (names.length > 0) {
    return names.join(", ");
  }

  return "Your trip";
}

/** Results hero: user-chosen places, else comparison card destinations. */
export function getResultsDestinationTitle(
  surveyAnswers: SurveyAnswers | null | undefined,
  interpretation: TripInterpretation
): string {
  return destinationPlacesFromSurveyAndCards(surveyAnswers, interpretation);
}

/** My Trips card title — same logic as results destination headline. */
export function getTripListTitle(session: TripSession): string {
  return destinationPlacesFromSurveyAndCards(
    session.surveyAnswers,
    session.interpretation
  );
}
