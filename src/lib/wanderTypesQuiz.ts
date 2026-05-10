import type { WandertypeKey } from "@/lib/wanderType";

/** Internal quiz personas — Harmony Seeker is derived, never scored directly. */
export type QuizAlias =
  | "unplugger"
  | "seeker"
  | "wanderer"
  | "nester"
  | "romantic"
  | "collector";

export const QUIZ_ALIASES: QuizAlias[] = [
  "unplugger",
  "seeker",
  "wanderer",
  "nester",
  "romantic",
  "collector",
];

export const ALIAS_TO_WANDERTYPE: Record<QuizAlias, WandertypeKey> = {
  unplugger: "coastal_calm",
  seeker: "golden_adventure",
  wanderer: "city_spark",
  nester: "rainforest_luxe",
  romantic: "slow_romance",
  collector: "wild_explorer",
};

export type QuizWeights = Partial<Record<QuizAlias, number>>;

export type QuizOptionIcon =
  | "Waves"
  | "Mountain"
  | "UtensilsCrossed"
  | "Home"
  | "Heart"
  | "Map"
  | "Compass"
  | "Palmtree"
  | "Camera"
  | "Sparkles"
  | "Moon"
  | "Users"
  | "Ban"
  | "MapPin"
  | "Building2"
  | "Bed";

export type QuizOption = {
  id: string;
  label: string;
  icon: QuizOptionIcon;
  weights: QuizWeights;
};

export type QuizQuestion = {
  id: string;
  prompt: string;
  /** First 8 are “of 8”; last is the tiebreaker (weighted in scoring only). */
  isTiebreaker: boolean;
  options: [QuizOption, QuizOption, QuizOption, QuizOption];
};

export const WANDERTYPES_QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    prompt: "You just landed. First instinct?",
    isTiebreaker: false,
    options: [
      {
        id: "q1a",
        label: "Drop bags, find the nearest beach or water",
        icon: "Waves",
        weights: { unplugger: 2 },
      },
      {
        id: "q1b",
        label: "Ask a local where they actually eat",
        icon: "UtensilsCrossed",
        weights: { wanderer: 1, collector: 1 },
      },
      {
        id: "q1c",
        label: "Open maps and start walking with no plan",
        icon: "Map",
        weights: { wanderer: 2 },
      },
      {
        id: "q1d",
        label: "Check in, unpack properly, pour a drink",
        icon: "Home",
        weights: { nester: 2 },
      },
    ],
  },
  {
    id: "q2",
    prompt: "Your perfect travel day looks like…",
    isTiebreaker: false,
    options: [
      {
        id: "q2a",
        label: "Nothing scheduled. Hammock, book, horizon.",
        icon: "Palmtree",
        weights: { unplugger: 2 },
      },
      {
        id: "q2b",
        label:
          "One big adventure — hike, dive, volcano, something that scares me a little",
        icon: "Mountain",
        weights: { seeker: 2 },
      },
      {
        id: "q2c",
        label: "Wandering a neighborhood until something pulls me in",
        icon: "Compass",
        weights: { wanderer: 2 },
      },
      {
        id: "q2d",
        label: "A beautiful house, a pool, good food, nowhere to be",
        icon: "Home",
        weights: { nester: 2 },
      },
    ],
  },
  {
    id: "q3",
    prompt: "You're traveling with someone. You…",
    isTiebreaker: false,
    options: [
      {
        id: "q3a",
        label: "Need them to be okay with doing nothing for long stretches",
        icon: "Moon",
        weights: { unplugger: 2 },
      },
      {
        id: "q3b",
        label: "Want a partner who'll say yes to anything",
        icon: "Mountain",
        weights: { seeker: 2 },
      },
      {
        id: "q3c",
        label: "Love getting separated and meeting back up with stories",
        icon: "Users",
        weights: { wanderer: 2, collector: 1 },
      },
      {
        id: "q3d",
        label: "Are happiest when you're both cozy and unhurried together",
        icon: "Heart",
        weights: { romantic: 2 },
      },
    ],
  },
  {
    id: "q4",
    prompt: "If budget weren't a thing, you'd spend it on…",
    isTiebreaker: false,
    options: [
      {
        id: "q4a",
        label: "An overwater bungalow or private beach",
        icon: "Waves",
        weights: { unplugger: 1, romantic: 1 },
      },
      {
        id: "q4b",
        label: "A once-in-a-lifetime experience — safari, glacier, summit",
        icon: "Mountain",
        weights: { seeker: 2, collector: 1 },
      },
      {
        id: "q4c",
        label: "Eating everywhere — tasting menus, street carts, everything",
        icon: "UtensilsCrossed",
        weights: { wanderer: 2 },
      },
      {
        id: "q4d",
        label: "The most extraordinary house or villa you can find",
        icon: "Home",
        weights: { nester: 2 },
      },
    ],
  },
  {
    id: "q5",
    prompt: "The photo you actually want to take is…",
    isTiebreaker: false,
    options: [
      {
        id: "q5a",
        label: "Feet in the sand, drink in hand, nothing else needed",
        icon: "Palmtree",
        weights: { unplugger: 2 },
      },
      {
        id: "q5b",
        label: "You mid-action — ziplining, at a summit, in the water",
        icon: "Camera",
        weights: { seeker: 2 },
      },
      {
        id: "q5c",
        label: "A tiny street, a door, a moment nobody else caught",
        icon: "Sparkles",
        weights: { wanderer: 2 },
      },
      {
        id: "q5d",
        label: "The view from your incredible accommodation at golden hour",
        icon: "Home",
        weights: { nester: 1, romantic: 1 },
      },
    ],
  },
  {
    id: "q6",
    prompt: "Which would genuinely ruin your trip?",
    isTiebreaker: false,
    options: [
      {
        id: "q6a",
        label: "A packed itinerary with no downtime",
        icon: "Ban",
        weights: { unplugger: 2, romantic: 1 },
      },
      {
        id: "q6b",
        label: "Staying in one place the whole time",
        icon: "MapPin",
        weights: { collector: 2 },
      },
      {
        id: "q6c",
        label: "A resort with nothing around it",
        icon: "Building2",
        weights: { unplugger: 1, nester: 1 },
      },
      {
        id: "q6d",
        label: "Roughing it — bad bed, no AC, no privacy",
        icon: "Bed",
        weights: { seeker: 1, wanderer: 1 },
      },
    ],
  },
  {
    id: "q7",
    prompt: "Travel, to you, is mostly about…",
    isTiebreaker: false,
    options: [
      {
        id: "q7a",
        label: "Recovering and resetting — coming home lighter",
        icon: "Moon",
        weights: { unplugger: 2 },
      },
      {
        id: "q7b",
        label: "Collecting experiences and proving something to yourself",
        icon: "Map",
        weights: { seeker: 1, collector: 2 },
      },
      {
        id: "q7c",
        label: "Disappearing into somewhere completely different",
        icon: "Compass",
        weights: { wanderer: 2 },
      },
      {
        id: "q7d",
        label: "Creating memories with the people you love most",
        icon: "Heart",
        weights: { romantic: 2 },
      },
    ],
  },
  {
    id: "q8",
    prompt: 'Someone says “pick anywhere.” You say…',
    isTiebreaker: false,
    options: [
      {
        id: "q8a",
        label: "Somewhere warm, slow, and by the water",
        icon: "Waves",
        weights: { unplugger: 2 },
      },
      {
        id: "q8b",
        label: "Somewhere few people have been — raw, epic, worth the effort",
        icon: "Mountain",
        weights: { seeker: 1, collector: 1 },
      },
      {
        id: "q8c",
        label: "A city I can get lost in for days",
        icon: "Building2",
        weights: { wanderer: 2 },
      },
      {
        id: "q8d",
        label: "Anywhere with an incredible place to stay",
        icon: "Home",
        weights: { nester: 2 },
      },
    ],
  },
  {
    id: "q9",
    prompt: "After the trip, what do you want to feel?",
    isTiebreaker: true,
    options: [
      {
        id: "q9a",
        label: "Genuinely rested — like I actually exhaled",
        icon: "Moon",
        weights: { unplugger: 4 },
      },
      {
        id: "q9b",
        label: "Like I lived something — a story I'll tell for years",
        icon: "Mountain",
        weights: { seeker: 2, collector: 2 },
      },
      {
        id: "q9c",
        label: "Like I understood somewhere new, even just a little",
        icon: "Compass",
        weights: { wanderer: 4 },
      },
      {
        id: "q9d",
        label: "Like we made something beautiful together",
        icon: "Heart",
        weights: { romantic: 4 },
      },
    ],
  },
];

export function emptyAliasScores(): Record<QuizAlias, number> {
  return Object.fromEntries(QUIZ_ALIASES.map((a) => [a, 0])) as Record<
    QuizAlias,
    number
  >;
}

export function applyAliasWeights(
  scores: Record<QuizAlias, number>,
  weights: QuizWeights,
): void {
  for (const alias of QUIZ_ALIASES) {
    const add = weights[alias];
    if (typeof add === "number") scores[alias] += add;
  }
}

/** Rebuild scores from completed answer indices (one per question, in order). */
export function computeScoresFromSelections(
  selections: readonly number[],
): Record<QuizAlias, number> {
  const s = emptyAliasScores();
  for (let i = 0; i < selections.length; i++) {
    applyAliasWeights(s, WANDERTYPES_QUIZ[i].options[selections[i]].weights);
  }
  return s;
}

/**
 * Top two types within 2 points → Harmony Seeker (`balanced_journey`).
 * Otherwise the highest-scoring persona wins (mapped to WanderType key).
 */
export function resolveWandertypeKey(
  scores: Record<QuizAlias, number>,
): WandertypeKey {
  const sorted = (Object.entries(scores) as [QuizAlias, number][]).sort(
    (a, b) => b[1] - a[1],
  );
  const topScore = sorted[0][1];
  const secondScore = sorted[1][1];
  if (topScore - secondScore <= 2) {
    return "balanced_journey";
  }
  return ALIAS_TO_WANDERTYPE[sorted[0][0]];
}
