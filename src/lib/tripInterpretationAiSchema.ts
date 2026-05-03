import { z } from "zod";
import type { ThemeKey } from "@/types/interpretation";

/** Must match `ThemeKey` — this is the allowlist the model may return. */
export const THEME_KEYS = [
  "coastal_calm",
  "rainforest_luxe",
  "golden_adventure",
  "city_spark",
  "slow_romance",
  "wild_explorer",
  "balanced_journey",
] as const satisfies readonly ThemeKey[];

export const themeKeySchema = z.enum(THEME_KEYS);

/**
 * Minimal shape we require from the model. Everything else on cards is optional;
 * `normalizeTripInterpretation` + `normalizeComparisonCard` fill gaps for the UI.
 */
/** Optional card fields we validate when present; other keys pass through. */
export const aiComparisonCardSchema = z
  .object({
    destinationName: z.string().min(1),
    estimatedSpendBand: z.string().min(1).optional(),
    primaryAirportLabel: z.string().min(1).optional(),
    suggestedActivities: z.array(z.string().min(1)).optional(),
  })
  .passthrough();

export const aiTripInterpretationResponseSchema = z.object({
  selectedTheme: themeKeySchema,
  comparisonCards: z.array(aiComparisonCardSchema).min(1).max(5),
  tradeoffWarnings: z.array(z.string()).optional().default([]),
  destinationPreferences: z.array(z.string()).optional().default([]),
  activityPreferences: z.array(z.string()).optional().default([]),
  avoidances: z.array(z.string()).optional().default([]),
  energyLevel: z.enum(["low", "medium", "high"]).optional().default("medium"),
  travelPacing: z
    .enum(["slow", "balanced", "packed"])
    .optional()
    .default("balanced"),
  decisionStyle: z
    .enum(["visual", "comparison-driven", "spontaneous", "research-heavy"])
    .optional()
    .default("comparison-driven"),
});

export type AiTripInterpretationResponse = z.infer<
  typeof aiTripInterpretationResponseSchema
>;

/** Strip markdown fences if the model wraps JSON in ```json ... ``` */
export function extractJsonObjectFromAssistantText(text: string): string {
  const trimmed = text.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)```$/m);
  if (fenced) return fenced[1].trim();
  return trimmed;
}
