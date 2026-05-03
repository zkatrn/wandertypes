import type {
  DestinationComparisonCard,
  DestinationScore,
  TripInterpretation,
} from "@/types/interpretation";
import { getInterpretationCopyForWandertype } from "@/lib/wanderType";
import type { ThemeKey } from "@/types/interpretation";

/** Firestore may store older card shapes (e.g. airportDistance, no airbnbListings). */
type LooseScores = Partial<DestinationScore> & {
  airportDistance?: number;
};

function normalizeScores(raw: LooseScores | undefined): DestinationScore {
  const r = raw ?? {};
  const nature = r.nature ?? 50;
  const cost = r.costEfficiency ?? 50;
  return {
    relaxation: r.relaxation ?? 50,
    adventure: r.adventure ?? 50,
    accessibility: r.accessibility ?? 50,
    wowFactor: r.wowFactor ?? 50,
    food: r.food ?? 50,
    nightlife: r.nightlife ?? 50,
    nature: nature,
    costEfficiency: cost,
    beach: r.beach ?? Math.min(100, Math.round(nature * 0.75)),
    eightNightValue:
      r.eightNightValue ?? r.airportDistance ?? cost,
  };
}

function normalizeComparisonCard(
  card: Partial<DestinationComparisonCard> & Record<string, unknown>
): DestinationComparisonCard {
  const scores = normalizeScores(card.scores as LooseScores);
  const matchScore =
    typeof card.matchScore === "number" && !Number.isNaN(card.matchScore)
      ? card.matchScore
      : Math.round(
          (scores.adventure +
            scores.relaxation +
            scores.nature +
            scores.wowFactor) /
            4
        );

  const summary = (card.summary as string) || "";
  const drawbacks = (card.possibleDrawbacks as string[]) || [];

  return {
    destinationName: (card.destinationName as string) || "Destination",
    summary,
    matchScore,
    matchLabel:
      (card.matchLabel as string) ||
      (matchScore >= 85 ? "Strong match" : "Saved comparison"),
    bestFor: (card.bestFor as string[]) || [],
    possibleDrawbacks: drawbacks,
    verdictGood:
      (card.verdictGood as string) ||
      summary ||
      "A solid option to compare with your priorities.",
    verdictWatch:
      (card.verdictWatch as string) ||
      drawbacks[0] ||
      "Double-check timing, weather, and logistics for your group.",
    scores,
    suggestedActivities: (card.suggestedActivities as string[]) || [],
    searchLinks: (card.searchLinks as DestinationComparisonCard["searchLinks"]) || {},
    airbnbListings: Array.isArray(card.airbnbListings)
      ? (card.airbnbListings as DestinationComparisonCard["airbnbListings"])
      : [],
  };
}

const THEME_KEYS: ThemeKey[] = [
  "coastal_calm",
  "rainforest_luxe",
  "golden_adventure",
  "city_spark",
  "slow_romance",
  "wild_explorer",
  "balanced_journey",
];

function isThemeKey(k: string): k is ThemeKey {
  return THEME_KEYS.includes(k as ThemeKey);
}

/**
 * Ensures a TripInterpretation from Firestore matches the current app shape
 * and merges wandertype copy for archetype fields when `selectedTheme` is valid.
 */
export function normalizeTripInterpretation(
  raw: Partial<TripInterpretation> & Record<string, unknown>
): TripInterpretation {
  const selectedTheme: ThemeKey = isThemeKey(String(raw.selectedTheme))
    ? (raw.selectedTheme as ThemeKey)
    : "coastal_calm";

  const wandertypeCopy = getInterpretationCopyForWandertype(selectedTheme);

  const cardsRaw = raw.comparisonCards;
  const comparisonCards: DestinationComparisonCard[] = Array.isArray(cardsRaw)
    ? cardsRaw.map((c) =>
        normalizeComparisonCard(c as Partial<DestinationComparisonCard>)
      )
    : [];

  return {
    travelArchetype: wandertypeCopy.travelArchetype,
    archetypeDescription: wandertypeCopy.archetypeDescription,
    emotionalGoal: wandertypeCopy.emotionalGoal,
    energyLevel: (raw.energyLevel as TripInterpretation["energyLevel"]) || "medium",
    travelPacing:
      (raw.travelPacing as TripInterpretation["travelPacing"]) || "balanced",
    decisionStyle:
      (raw.decisionStyle as TripInterpretation["decisionStyle"]) ||
      "comparison-driven",
    selectedTheme,
    destinationPreferences: Array.isArray(raw.destinationPreferences)
      ? (raw.destinationPreferences as string[])
      : [],
    activityPreferences: Array.isArray(raw.activityPreferences)
      ? (raw.activityPreferences as string[])
      : [],
    avoidances: Array.isArray(raw.avoidances) ? (raw.avoidances as string[]) : [],
    tradeoffWarnings: Array.isArray(raw.tradeoffWarnings)
      ? (raw.tradeoffWarnings as string[])
      : [],
    comparisonCards,
  };
}
