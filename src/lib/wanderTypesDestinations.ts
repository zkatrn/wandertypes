import type { WandertypeKey } from "@/lib/wanderType";
import { WANDERTYPES } from "@/lib/wanderType";

const PAD_LINES = [
  "Easy variety without long transfers",
  "Different moods in one region",
  "Room to slow down or lean in when you want",
] as const;

/** Three concise destination hooks for the shareable result card (lines stay distinct). */
export function idealDestinationsTriple(
  key: WandertypeKey,
): [string, string, string] {
  const raw = WANDERTYPES[key].pageDetails.idealDestinations;
  const commaParts = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const slots: [string, string, string] = [
    commaParts[0] ?? PAD_LINES[0],
    commaParts[1] ?? PAD_LINES[1],
    commaParts[2] ?? PAD_LINES[2],
  ];

  const seen = new Set<string>();
  const out: string[] = [];

  for (let i = 0; i < 3; i++) {
    let line = slots[i];
    let bump = 0;
    while (seen.has(line)) {
      bump += 1;
      line = `${slots[i]} · ${bump}`;
    }
    seen.add(line);
    out.push(line);
  }

  return [out[0], out[1], out[2]];
}
