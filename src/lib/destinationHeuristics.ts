import type { TripLengthNights } from "@/types/survey";

/**
 * Lightweight, offline heuristics for preview / fallback data when the AI
 * route is unavailable. Not a substitute for model output — just less
 * obviously wrong duplicate copy between two cities.
 */

function hubLabel(destinationName: string): string {
  const first = destinationName.split("/")[0]?.trim() || destinationName;
  return first.split(",")[0]?.trim() || first;
}

/** Simple string hash for stable variation between places. */
function placeHash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i += 1) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

type AirportRule = { test: RegExp; label: string };

const AIRPORT_RULES: AirportRule[] = [
  {
    test: /\bsan\s*diego\b/i,
    label: "San Diego International (SAN)",
  },
  {
    test: /\birvine\b|\bnewport\s*beach\b|\bcosta\s*mesa\b|\bsanta\s*ana\b|\borgange\s*county\b|\blaguna\s*beach\b|\bhuntington\s*beach\b/i,
    label:
      "John Wayne / Orange County (SNA) — usual for coastal OC & Irvine; LAX if you need more international nonstops",
  },
  {
    test: /\blos\s*angeles\b|\bhollywood\b|\bsanta\s*monica\b|\bvenice\b.*\b(ca|california)\b/i,
    label: "Los Angeles International (LAX)",
  },
  {
    test: /\bsan\s*francisco\b|\bsf\b|\boakland\b|\bberkeley\b/i,
    label: "San Francisco International (SFO); Oakland (OAK) on some carriers",
  },
  {
    test: /\bseattle\b/i,
    label: "Seattle–Tacoma International (SEA)",
  },
  {
    test: /\bportland\b.*\b(or|oregon)\b/i,
    label: "Portland International (PDX)",
  },
  {
    test: /\bphoenix\b|\bscottsdale\b|\btempe\b/i,
    label: "Phoenix Sky Harbor (PHX)",
  },
  {
    test: /\bdenver\b/i,
    label: "Denver International (DEN)",
  },
  {
    test: /\baustin\b/i,
    label: "Austin–Bergstrom International (AUS)",
  },
  {
    test: /\bdallas\b|\bfort\s*worth\b/i,
    label: "Dallas/Fort Worth International (DFW) or Dallas Love Field (DAL) depending on carrier",
  },
  {
    test: /\bhouston\b/i,
    label: "George Bush Intercontinental (IAH) or William P. Hobby (HOU)",
  },
  {
    test: /\bchicago\b/i,
    label: "O'Hare (ORD) or Midway (MDW) depending on airline",
  },
  {
    test: /\bnew\s*york\b|\bmanhattan\b|\bbrooklyn\b|\bqueens\b/i,
    label: "JFK, Newark (EWR), or LaGuardia (LGA) — pick by airline and origin",
  },
  {
    test: /\bmiami\b|\bfort\s*lauderdale\b|\bwest\s*palm\b/i,
    label: "Miami (MIA) or Fort Lauderdale (FLL)",
  },
  {
    test: /\borlando\b/i,
    label: "Orlando International (MCO)",
  },
  {
    test: /\bvegas\b|\blas\s*vegas\b/i,
    label: "Harry Reid International (LAS)",
  },
  {
    test: /\bhonolulu\b|\boahu\b|\bwaikiki\b/i,
    label: "Daniel K. Inouye International (HNL)",
  },
];

export function heuristicPrimaryAirportLabel(destinationName: string): string {
  const raw = destinationName.trim();
  for (const { test, label } of AIRPORT_RULES) {
    if (test.test(raw)) return label;
  }
  const hub = hubLabel(destinationName);
  return `Search flights to the main international or large hub airport closest to ${hub} (varies by airline — use your origin city in Google Flights).`;
}

function tripSpendCopy(trip?: TripLengthNights): {
  durationPhrase: string;
  moneyLine: string;
} {
  const t = trip ?? "not_sure";
  switch (t) {
    case "2-4_nights":
      return {
        durationPhrase: "2–4 nights",
        moneyLine:
          "about $800–1.9k per person total for lodging + meals + local transport",
      };
    case "5-7_nights":
      return {
        durationPhrase: "5–7 nights",
        moneyLine:
          "about $2.0k–3.9k per person total for lodging + meals + local transport",
      };
    case "8-10_nights":
      return {
        durationPhrase: "8–10 nights",
        moneyLine:
          "about $2.8k–5.4k per person total for lodging + meals + local transport",
      };
    case "11plus_nights":
      return {
        durationPhrase: "11+ nights",
        moneyLine:
          "about $3.5k–6.8k per person total for lodging + meals + local transport",
      };
    case "not_sure":
    default:
      return {
        durationPhrase: "unspecified length (assume roughly a week if unsure)",
        moneyLine:
          "about $1.8k–4.0k per person total for lodging + meals + local transport",
      };
  }
}

export function heuristicSpendBand(
  destinationName: string,
  cardIndex: number,
  tripLength?: TripLengthNights
): string {
  const hub = hubLabel(destinationName);
  const { durationPhrase, moneyLine } = tripSpendCopy(tripLength);
  const suffixes = [
    "; flights extra.",
    " (order-of-magnitude, not a quote); flights extra.",
    "; flights and peak weeks move the range a lot.",
  ];
  const suf =
    suffixes[(placeHash(destinationName) + cardIndex) % suffixes.length]!;
  return `For ${hub} over ${durationPhrase}: ${moneyLine}${suf}`;
}

const SAN_DIEGO_ACTIVITIES = [
  "Balboa Park museums, gardens, and Spanish Colonial architecture",
  "La Jolla Cove + sea lions + coastal bluffs walk",
  "Gaslamp Quarter evening food crawl",
  "USS Midway Museum (waterfront)",
  "Coronado Island beach + Hotel del Coronado stroll",
  "Torrey Pines State Natural Reserve coastal hike",
];

const IRVINE_OC_ACTIVITIES = [
  "Orange County Great Park (balloon ride / sports complex — check hours)",
  "Crystal Cove State Park — tidepools + bluff trails (short drive)",
  "Newport Back Bay loop walk or kayak rental",
  "University of California, Irvine campus + Aldrich Park",
  "Laguna Beach galleries + Heisler Park sunset",
  "Irvine Spectrum Center evening + nearby dining pockets",
];

const GENERIC_ACTIVITY_BUILDERS = (hub: string) =>
  [
    `${hub}: signature park or waterfront walk (pick top-rated in Maps)`,
    `${hub}: one museum or historic site block (half day)`,
    `${hub}: neighborhood breakfast + local coffee crawl`,
    `${hub}: farmers market or weekend craft market`,
    `${hub}: sunset viewpoint — search “${hub} sunset” in Maps`,
    `${hub}: easy day trip — pick one nearby town with a different vibe`,
  ] as const;

export function heuristicActivitiesForDestination(destinationName: string): string[] {
  const raw = destinationName.toLowerCase();
  if (/\bsan\s*diego\b/.test(raw)) return [...SAN_DIEGO_ACTIVITIES];
  if (
    /\birvine\b/.test(raw) ||
    /\bnewport\s*beach\b/.test(raw) ||
    /\bcosta\s*mesa\b/.test(raw) ||
    /\borgange\s*county\b/.test(raw)
  ) {
    return [...IRVINE_OC_ACTIVITIES];
  }

  const hub = hubLabel(destinationName);
  return [...GENERIC_ACTIVITY_BUILDERS(hub)];
}

export function heuristicSummary(destinationName: string, cardIndex: number): string {
  const hub = hubLabel(destinationName);
  const tone =
    cardIndex === 0
      ? "Leads your comparison on overall fit for the mood you described."
      : "A contrasting base worth weighing against your first pick.";
  return `${hub} — ${tone} Use the activity list as a starting point; swap in what matches your dates and pace.`;
}

export function heuristicVerdictGood(destinationName: string): string {
  const hub = hubLabel(destinationName);
  return `Best fit if you want ${hub} as your main anchor for dining, day trips, and the vibe you described in the survey.`;
}

export function heuristicVerdictWatch(destinationName: string): string {
  const hub = hubLabel(destinationName);
  return `Watch weekend crowds and parking around ${hub}'s most popular strips — book timed entries and dinner where needed.`;
}

export function heuristicBestFor(destinationName: string): string[] {
  const hub = hubLabel(destinationName);
  return [
    `Exploring ${hub} without constant hotel changes`,
    "Mix of easy days + one or two bigger outings",
    "Groups that like having a clear home base",
  ];
}

export function heuristicDrawbacks(destinationName: string): string[] {
  const hub = hubLabel(destinationName);
  return [
    `Peak weekends stack traffic and reservations in ${hub}`,
    "Holiday pricing can jump faster than midweek stays",
  ];
}
