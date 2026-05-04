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

If \`tripLengthNights\` is present, it is one of: "2-4_nights", "5-7_nights", "8-10_nights", "11plus_nights", "not_sure". Use it to scale **total-trip** \`estimatedSpendBand\` ranges (longer stays → higher totals for lodging + food + local transport; not fake nightly rates). If absent, assume roughly a week unless other hints contradict.

## Output contract (strict keys)
Return a JSON object with exactly these top-level keys:
- selectedTheme: string, MUST be one of: ${THEME_KEYS.join(", ")}
- comparisonCards: array of 1–5 destination comparison objects
- tradeoffWarnings: string[] — 2–5 items. Each line should be specific and place-aware: name real hubs or regions from the comparison, compare relative positions (e.g. day-trip distance between two named spots), call out realistic drive or train time ranges when inferable from the survey (home airport, origin city, listed destinations), seasonal crowding where it hits worst, and one logistics trap (parking, last-mile walk, ferry schedules). Avoid vague filler like "do your research" with no location.
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
- suggestedActivities: string[] — exactly 3 to 6 concrete, bookable-style ideas per destination (named trails, neighborhoods, museums, boat tours, day hikes, food experiences). Each string should stand alone (no fake durations).
- estimatedSpendBand: string — one qualitative **total-trip** band for lodging + food + local transport matching \`tripLengthNights\` when set (e.g. "Mid: about $2.5k–4k per person for ~6 nights, flights extra"). Ranges only; no fake invoices or live fares.
- primaryAirportLabel: string — the main international or major airport most travelers use for this base (include IATA code when you know it, e.g. "Marco Polo (VCE)").
- searchLinks: { googleMaps?: string, airbnbSearch?: string, tripadvisorSearch?: string } — use real search URLs, no invented booking pages
- airbnbListings: array of { label: string, url: string } — ONLY if the user pasted listing URLs in survey notes; otherwise use []

Do NOT include driving distance or minutes to the airport in JSON — the server may attach Google Distance Matrix data when configured.

Rules:
- Never invent live prices or availability.
- Never claim real-time data.
- Theme must match the emotional + pacing signal from answers; prefer one clear Wandertype.
- JSON only. No trailing commas.`;
}
