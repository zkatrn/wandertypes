import type { TripSession } from "@/lib/firestore";

/**
 * Primary label for My Trips cards: user-chosen places, else comparison destinations.
 */
export function getTripListTitle(session: TripSession): string {
  const answers = session.surveyAnswers;
  const raw = [
    ...(answers.destinations ?? []),
    ...(answers.destinationList ?? []),
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

  const cards = session.interpretation.comparisonCards ?? [];
  const names = cards.map((c) => c.destinationName).filter(Boolean);
  if (names.length > 0) {
    return names.join(", ");
  }

  return "Your trip";
}
