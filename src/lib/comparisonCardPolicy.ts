import type { SurveyAnswers } from "@/types/survey";
import type {
  DestinationComparisonCard,
  TripInterpretation,
} from "@/types/interpretation";

export const MAX_COMPARISON_CARDS = 3;

/** Unique, ordered places from survey (merges destinationList + destinations). */
export function listedPlaces(answers: SurveyAnswers): string[] {
  const raw = [
    ...(answers.destinationList ?? []).map((s) => String(s).trim()).filter(Boolean),
    ...(answers.destinations ?? []).map((s) => String(s).trim()).filter(Boolean),
  ];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const p of raw) {
    const k = p.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(p);
  }
  return out;
}

export function isChooseForMe(answers: SurveyAnswers): boolean {
  return answers.chooseForMe === true;
}

/**
 * User typed a specific place line (e.g. "La Fortuna, Costa Rica") — comparisons
 * should stay on that spot, not invent alternate destinations.
 */
export function looksLikeSpecificPlaceName(place: string): boolean {
  return place.includes(",");
}

function norm(s: string): string {
  return s.trim().toLowerCase();
}

function dedupeCardsByName(
  cards: DestinationComparisonCard[]
): DestinationComparisonCard[] {
  const seen = new Set<string>();
  const out: DestinationComparisonCard[] = [];
  for (const c of cards) {
    const k = norm(c.destinationName);
    if (!k || seen.has(k)) continue;
    seen.add(k);
    out.push(c);
  }
  return out;
}

export function nameRoughlyMatchesPlace(
  cardName: string,
  place: string
): boolean {
  const a = norm(cardName);
  const b = norm(place);
  if (a.includes(b) || b.includes(a)) return true;
  const head = b.split(",")[0]?.trim() ?? b;
  if (head.length >= 4 && a.includes(norm(head))) return true;
  return false;
}

function pickBestCard(
  cards: DestinationComparisonCard[]
): DestinationComparisonCard {
  return [...cards].sort(
    (x, y) => (y.matchScore ?? 0) - (x.matchScore ?? 0)
  )[0]!;
}

function fallbackCard(place: string): DestinationComparisonCard {
  return {
    destinationName: place,
    summary: `Focused comparison for ${place}.`,
    matchScore: 82,
    matchLabel: "Your pick",
    bestFor: ["Your itinerary", "What you asked to compare"],
    possibleDrawbacks: ["Verify seasonal closures and local access."],
    verdictGood: `Use this board as a planning anchor for ${place}.`,
    verdictWatch: "Double-check drive times and parking at busy windows.",
    scores: {
      relaxation: 70,
      adventure: 65,
      accessibility: 70,
      wowFactor: 72,
      food: 70,
      nightlife: 55,
      nature: 75,
      costEfficiency: 68,
      beach: 50,
      eightNightValue: 70,
    },
    suggestedActivities: [
      `Explore the main area of ${place}`,
      "Local food walk",
      "Half-day nature or culture outing",
    ],
    searchLinks: {
      googleMaps: `https://maps.google.com/?q=${encodeURIComponent(place)}`,
    },
    airbnbListings: [],
  };
}

function oneCardForPlace(
  cards: DestinationComparisonCard[],
  place: string
): DestinationComparisonCard {
  const hits = cards.filter((c) =>
    nameRoughlyMatchesPlace(c.destinationName, place)
  );
  const base = hits.length > 0 ? pickBestCard(hits) : cards[0];
  if (!base) {
    return fallbackCard(place);
  }
  return {
    ...base,
    destinationName: place,
    matchLabel: "Your pick",
    matchScore: Math.max(base.matchScore ?? 0, 85),
  };
}

/**
 * Enforces destination count rules from survey input after AI (or mock) output:
 * - Dedupes identical destination names.
 * - Single "City, Region" style pick → exactly one card for that place.
 * - Single broad name (e.g. country) → up to 3 cards, preferring names that match.
 * - Multiple listed places → up to one card per listed place (max 3).
 * - Choose-for-me → up to 3 cards.
 */
export function applyComparisonCardPolicy(
  interpretation: TripInterpretation,
  answers: SurveyAnswers | null | undefined
): TripInterpretation {
  if (!answers) {
    return interpretation;
  }

  let cards = dedupeCardsByName(interpretation.comparisonCards ?? []);
  if (cards.length === 0) {
    return interpretation;
  }

  if (isChooseForMe(answers)) {
    return {
      ...interpretation,
      comparisonCards: cards.slice(0, MAX_COMPARISON_CARDS),
    };
  }

  const places = listedPlaces(answers);
  if (places.length === 0) {
    return {
      ...interpretation,
      comparisonCards: cards.slice(0, MAX_COMPARISON_CARDS),
    };
  }

  if (places.length === 1 && looksLikeSpecificPlaceName(places[0]!)) {
    return {
      ...interpretation,
      comparisonCards: [oneCardForPlace(cards, places[0]!)],
    };
  }

  if (places.length === 1) {
    const place = places[0]!;
    const preferred = cards.filter((c) =>
      nameRoughlyMatchesPlace(c.destinationName, place)
    );
    const merged = [
      ...preferred,
      ...cards.filter((c) => !preferred.includes(c)),
    ];
    return {
      ...interpretation,
      comparisonCards: dedupeCardsByName(merged).slice(0, MAX_COMPARISON_CARDS),
    };
  }

  const mapped: DestinationComparisonCard[] = [];
  const cappedPlaces = places.slice(0, MAX_COMPARISON_CARDS);
  for (let i = 0; i < cappedPlaces.length; i++) {
    const place = cappedPlaces[i]!;
    const hit = cards.find((c) =>
      nameRoughlyMatchesPlace(c.destinationName, place)
    );
    if (hit) {
      mapped.push({ ...hit, destinationName: place });
    } else if (cards.length > 0) {
      const tpl = cards[i % cards.length]!;
      mapped.push({ ...tpl, destinationName: place });
    }
  }

  if (mapped.length > 0) {
    return {
      ...interpretation,
      comparisonCards: dedupeCardsByName(mapped),
    };
  }

  return {
    ...interpretation,
    comparisonCards: cards.slice(0, MAX_COMPARISON_CARDS),
  };
}
