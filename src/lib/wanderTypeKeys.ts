import type { WandertypeKey } from "@/lib/wanderType";

export const WANDERTYPE_KEYS: WandertypeKey[] = [
  "coastal_calm",
  "golden_adventure",
  "city_spark",
  "rainforest_luxe",
  "slow_romance",
  "wild_explorer",
  "balanced_journey",
];

export function isWandertypeKey(s: string): s is WandertypeKey {
  return (WANDERTYPE_KEYS as readonly string[]).includes(s);
}
