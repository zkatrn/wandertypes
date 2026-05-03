import { heuristicActivitiesForDestination } from "@/lib/destinationHeuristics";

export const MIN_SUGGESTED_ACTIVITIES = 3;
export const MAX_SUGGESTED_ACTIVITIES = 6;

/** Template list when the model returns fewer than MIN activities. */
export function activityFallbackIdeas(destinationName: string): string[] {
  return heuristicActivitiesForDestination(destinationName);
}

/**
 * Dedupes, merges survey activity tags, pads with templates, clamps to
 * MIN–MAX so every base shows a comparable number of ideas.
 */
export function ensureSuggestedActivitiesCount(
  destinationName: string,
  suggestedActivities: string[] | undefined,
  activityPreferences: string[]
): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  const add = (s: string) => {
    const t = s.trim();
    if (!t) return;
    const k = t.toLowerCase();
    if (seen.has(k)) return;
    seen.add(k);
    out.push(t);
  };

  for (const a of suggestedActivities ?? []) add(a);
  for (const a of activityPreferences) add(a);

  const fallbacks = activityFallbackIdeas(destinationName);
  let i = 0;
  while (out.length < MIN_SUGGESTED_ACTIVITIES && i < fallbacks.length) {
    add(fallbacks[i]!);
    i += 1;
  }

  return out.slice(0, MAX_SUGGESTED_ACTIVITIES);
}
