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

export type SurveyAnswers = {
  // Step 0
  destinations?: string[];
  chooseForMe?: boolean;

  // Step 1
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
