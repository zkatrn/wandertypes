export type ThemeKey =
  | "coastal_calm"
  | "rainforest_luxe"
  | "golden_adventure"
  | "city_spark"
  | "slow_romance"
  | "wild_explorer"
  | "balanced_journey";

export type DestinationScore = {
  relaxation: number;
  adventure: number;
  accessibility: number;
  wowFactor: number;
  food: number;
  nightlife: number;
  nature: number;
  costEfficiency: number;
  beach: number;
  eightNightValue: number;
};

export type AirportDistanceSource = "google_distance_matrix" | "none";

export type DestinationComparisonCard = {
  destinationName: string;
  summary: string;
  matchScore: number; // 0–100
  matchLabel: string; // e.g. "Best Match", "Strong Runner-Up"
  bestFor: string[];
  possibleDrawbacks: string[];
  verdictGood: string; // "Best fit if…" text
  verdictWatch: string; // "Watch out for…" text
  scores: DestinationScore;
  suggestedActivities: string[];
  /** Qualitative band only — not live booking totals. */
  estimatedSpendBand?: string;
  /** Airport the model expects most guests to use (name + IATA when known). */
  primaryAirportLabel?: string;
  /** Driving distance from primary airport to a central geocode of the base (Google). */
  distanceFromPrimaryAirportKm?: number;
  /** Typical driving time airport → center per Google Distance Matrix (traffic varies). */
  distanceFromPrimaryAirportDriveMinutes?: number;
  airportDistanceSource?: AirportDistanceSource;
  searchLinks: {
    googleMaps?: string;
    airbnbSearch?: string;
    tripadvisorSearch?: string;
  };
  airbnbListings: {
    label: string;
    url: string;
  }[];
};

export type TripInterpretation = {
  travelArchetype: string;
  archetypeDescription: string;
  emotionalGoal: string;
  energyLevel: "low" | "medium" | "high";
  travelPacing: "slow" | "balanced" | "packed";
  decisionStyle:
    | "visual"
    | "comparison-driven"
    | "spontaneous"
    | "research-heavy";
  selectedTheme: ThemeKey;
  destinationPreferences: string[];
  activityPreferences: string[];
  avoidances: string[];
  tradeoffWarnings: string[];
  comparisonCards: DestinationComparisonCard[];
};
