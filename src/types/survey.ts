export type TripMood =
  | "reset"
  | "unforgettable"
  | "explore"
  | "comfortable_adventure"
  | "romantic"
  | "surprise";

export type TravelPacing =
  | "slow"
  | "one_per_day"
  | "balanced"
  | "packed"
  | "depends";

export type Environment =
  | "ocean"
  | "rainforest"
  | "mountains"
  | "culture"
  | "city_energy"
  | "boutique"
  | "remote";

export type GroupType = "solo" | "couple" | "friends" | "family" | "mixed";

export type GroupAlignment =
  | "same_page"
  | "mostly_aligned"
  | "different_priorities"
  | "chaos";

export type FrictionTolerance =
  | "worth_it"
  | "some_is_fine"
  | "low_friction"
  | "avoid";

export type BudgetFeel =
  | "budget_conscious"
  | "comfortable_mid"
  | "splurge_few"
  | "luxe"
  | "fit_over_budget";

/** Trip length — collected on survey Step 1 (mood) before mood cards. */
export type TripLengthNights =
  | "2-4_nights"
  | "5-7_nights"
  | "8-10_nights"
  | "11plus_nights"
  | "not_sure";

export const TRIP_LENGTH_OPTIONS: ReadonlyArray<{
  value: TripLengthNights;
  label: string;
}> = [
  { value: "2-4_nights", label: "2–4 nights" },
  { value: "5-7_nights", label: "5–7 nights" },
  { value: "8-10_nights", label: "8–10 nights" },
  { value: "11plus_nights", label: "11+ nights" },
  { value: "not_sure", label: "Not sure yet" },
];

export function tripLengthDisplayLabel(
  value: TripLengthNights | undefined
): string | null {
  if (!value) return null;
  return TRIP_LENGTH_OPTIONS.find((o) => o.value === value)?.label ?? null;
}

export type SurveyAnswers = {
  // Step 0 (landing — destinations only)
  destinations?: string[];
  chooseForMe?: boolean;

  // Step 1 (trip length chips, then mood)
  tripLengthNights?: TripLengthNights;
  tripMood?: TripMood;

  // Step 2
  pace?: TravelPacing;

  // Step 3
  environment?: Environment;

  // Step 4
  groupType?: GroupType;
  groupAlignment?: GroupAlignment;

  // Step 5
  activities?: string[];

  // Step 6
  frictionTolerance?: FrictionTolerance;
  dealbreakers?: string[];

  // Step 7
  budgetFeel?: BudgetFeel;

  // Step 8
  openText?: string;

  // Legacy fields for backward compatibility
  hasDestinations?: boolean;
  destinationList?: string[];
  travelPacing?: TravelPacing;
  additionalNotes?: string;
};
