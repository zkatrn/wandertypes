import { THEME_KEYS } from "@/lib/tripInterpretationAiSchema";

/**
 * Instructions for the model: output must validate against
 * `aiTripInterpretationResponseSchema` + rich optional fields on each card
 * (normalized server-side into `TripInterpretation`).
 */
export function buildInterpretTripUserPrompt(surveyAnswers: unknown): string {
  return `You are the Trip Interpreter for WanderMoodz. You receive survey answers and return ONE JSON object only (no markdown, no commentary).

## Input: survey answers
${JSON.stringify(surveyAnswers, null, 2)}

## Output contract (strict keys)
Return a JSON object with exactly these top-level keys:
- selectedTheme: string, MUST be one of: ${THEME_KEYS.join(", ")}
- comparisonCards: array of 1–5 destination comparison objects
- tradeoffWarnings: string[] (honest tradeoffs; can be empty)
- destinationPreferences: string[] (short tags, e.g. "beach + jungle")
- activityPreferences: string[] (from survey or inferred)
- avoidances: string[] (things to steer clear of)
- energyLevel: "low" | "medium" | "high"
- travelPacing: "slow" | "balanced" | "packed"
- decisionStyle: "visual" | "comparison-driven" | "spontaneous" | "research-heavy"

Do NOT include travelArchetype, archetypeDescription, or emotionalGoal — the server fills those from the official Wandertype for selectedTheme.

## Each comparisonCard object
Required:
- destinationName: string

Strongly include (server can backfill if missing, but you should provide them):
- summary: string (2–4 sentences)
- matchScore: number 0–100
- matchLabel: string (e.g. "Best Match", "Strong Runner-Up", "Scenic Pick")
- bestFor: string[] (2–4 bullets)
- possibleDrawbacks: string[] (1–3 honest cons)
- verdictGood: string (one sentence, "best fit if…" voice)
- verdictWatch: string (one sentence, "watch out…" voice)
- scores: object with ALL numeric 0–100 fields:
  relaxation, adventure, accessibility, wowFactor, food, nightlife, nature, costEfficiency, beach, eightNightValue
- suggestedActivities: string[] (4–8 concrete activities)
- searchLinks: { googleMaps?: string, airbnbSearch?: string, tripadvisorSearch?: string } — use real search URLs, no invented booking pages
- airbnbListings: array of { label: string, url: string } — ONLY if the user pasted listing URLs in survey notes; otherwise use []

Rules:
- Never invent live prices or availability.
- Never claim real-time data.
- Theme must match the emotional + pacing signal from answers; prefer one clear Wandertype.
- JSON only. No trailing commas.`;
}
