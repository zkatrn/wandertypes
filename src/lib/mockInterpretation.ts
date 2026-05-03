import type { TripInterpretation, DestinationComparisonCard } from "@/types/interpretation";
import type { SurveyAnswers } from "@/types/survey";
import { getInterpretationCopyForWandertype } from "@/lib/wanderType";

export function generateMockInterpretation(
  answers: SurveyAnswers
): TripInterpretation {
  const selectedTheme = selectThemeFromAnswers(answers);
  const comparisonCards =
    answers.hasDestinations &&
    answers.destinationList &&
    answers.destinationList.length > 0
      ? generateCardsForUserDestinations(answers.destinationList)
      : getDefaultDestinations();

  return {
    ...getInterpretationCopyForWandertype(selectedTheme),
    energyLevel: "medium",
    travelPacing: "balanced",
    decisionStyle: "comparison-driven",
    selectedTheme,
    destinationPreferences: ["Nature-focused", "Accessible beauty", "Good food scene"],
    activityPreferences: answers.activities || [],
    avoidances: ["Overpacked schedules", "Too many hotel changes"],
    tradeoffWarnings: [
      "Popular spots may be crowded in peak season",
      "Some remote areas require longer drives",
    ],
    comparisonCards,
  };
}

function generateCardsForUserDestinations(destinations: string[]): DestinationComparisonCard[] {
  return destinations.map((dest, index) => ({
    destinationName: dest,
    summary: `A destination that matches your travel style with unique experiences and comfortable access.`,
    matchScore: 85 - index * 5,
    matchLabel: index === 0 ? "Best Match" : index === 1 ? "Strong option" : "Worth considering",
    bestFor: [
      "Travelers seeking authentic experiences",
      "Those who value local culture",
      "Groups with mixed interests",
    ],
    possibleDrawbacks: [
      "Research local customs before visiting",
      "Peak season may affect availability",
    ],
    verdictGood: "You want a place that balances discovery with comfort.",
    verdictWatch: "Check seasonal weather and local events before locking dates.",
    scores: {
      relaxation: 70 + Math.floor(Math.random() * 20),
      adventure: 60 + Math.floor(Math.random() * 25),
      accessibility: 65 + Math.floor(Math.random() * 25),
      wowFactor: 70 + Math.floor(Math.random() * 20),
      food: 65 + Math.floor(Math.random() * 25),
      nightlife: 50 + Math.floor(Math.random() * 30),
      nature: 70 + Math.floor(Math.random() * 20),
      costEfficiency: 60 + Math.floor(Math.random() * 25),
      beach: 40 + Math.floor(Math.random() * 40),
      eightNightValue: 65 + Math.floor(Math.random() * 25),
    },
    suggestedActivities: [
      "Explore local markets",
      "Try regional cuisine",
      "Visit cultural sites",
      "Connect with locals",
    ],
    searchLinks: {
      googleMaps: `https://maps.google.com/?q=${encodeURIComponent(dest)}`,
      airbnbSearch: `https://www.airbnb.com/s/${encodeURIComponent(dest)}`,
    },
    airbnbListings: [],
  }));
}

function getDefaultDestinations(): DestinationComparisonCard[] {
  return [
      {
        destinationName: "Costa Rica - Manuel Antonio",
        summary:
          "Beach meets rainforest with easy wildlife access and comfortable infrastructure.",
        bestFor: [
          "Nature lovers who want comfort",
          "First-time rainforest visitors",
          "Couples seeking relaxation + adventure",
        ],
        possibleDrawbacks: [
          "Can be touristy in high season",
          "Some beach areas get crowded",
        ],
        matchScore: 88,
        matchLabel: "Best Match",
        verdictGood: "Strong nature access with enough comfort for mixed groups.",
        verdictWatch: "Peak season crowds and some driving between highlights.",
        scores: {
          relaxation: 80,
          adventure: 70,
          accessibility: 90,
          wowFactor: 80,
          food: 70,
          nightlife: 40,
          nature: 100,
          costEfficiency: 70,
          beach: 75,
          eightNightValue: 82,
        },
        suggestedActivities: [
          "Manuel Antonio National Park",
          "Beach time",
          "Sloth watching",
          "Sunset catamaran tour",
        ],
        searchLinks: {
          googleMaps: "https://maps.google.com/?q=Manuel+Antonio+Costa+Rica",
          airbnbSearch: "https://www.airbnb.com/s/Manuel-Antonio--Costa-Rica",
        },
        airbnbListings: [],
      },
      {
        destinationName: "Portugal - Algarve Coast",
        summary:
          "Dramatic cliffs, hidden beaches, charming towns, and incredible food without the crowds.",
        bestFor: [
          "Beach lovers who want variety",
          "Food-focused travelers",
          "Those seeking value",
        ],
        possibleDrawbacks: [
          "Water can be chilly",
          "Some areas require driving",
        ],
        matchScore: 81,
        matchLabel: "Strong Runner-Up",
        verdictGood: "Great mix of coastline, food, and relaxed pacing.",
        verdictWatch: "Some areas need a car; water temps vary by season.",
        scores: {
          relaxation: 90,
          adventure: 60,
          accessibility: 80,
          wowFactor: 90,
          food: 100,
          nightlife: 50,
          nature: 80,
          costEfficiency: 90,
          beach: 85,
          eightNightValue: 78,
        },
        suggestedActivities: [
          "Beach hopping",
          "Seafood dinners",
          "Benagil Cave boat tour",
          "Lagos old town",
        ],
        searchLinks: {
          googleMaps: "https://maps.google.com/?q=Algarve+Portugal",
          airbnbSearch: "https://www.airbnb.com/s/Algarve--Portugal",
        },
        airbnbListings: [],
      },
      {
        destinationName: "Bali - Ubud + Canggu",
        summary:
          "Jungle serenity in Ubud, beach vibes in Canggu. Split your time for the best of both.",
        bestFor: [
          "Couples and friends",
          "Those who want culture + beach",
          "Wellness-focused travelers",
        ],
        possibleDrawbacks: [
          "Traffic can be frustrating",
          "Very touristy in parts",
        ],
        matchScore: 74,
        matchLabel: "Balanced Pick",
        verdictGood: "Culture, wellness, and beach energy in one trip shape.",
        verdictWatch: "Traffic and tourist density in popular pockets.",
        scores: {
          relaxation: 80,
          adventure: 70,
          accessibility: 70,
          wowFactor: 90,
          food: 90,
          nightlife: 60,
          nature: 90,
          costEfficiency: 100,
          beach: 70,
          eightNightValue: 72,
        },
        suggestedActivities: [
          "Rice terrace walk",
          "Temple visits",
          "Surf lessons",
          "Spa day",
        ],
        searchLinks: {
          googleMaps: "https://maps.google.com/?q=Ubud+Bali",
          airbnbSearch: "https://www.airbnb.com/s/Ubud--Bali",
        },
        airbnbListings: [],
      },
    ];
}

function selectThemeFromAnswers(answers: SurveyAnswers) {
  if (answers.environment === "ocean") return "coastal_calm";
  if (answers.environment === "rainforest") return "rainforest_luxe";
  if (answers.environment === "mountains") return "golden_adventure";
  if (answers.environment === "culture" || answers.environment === "city_energy") return "city_spark";
  if (answers.tripMood === "romantic") return "slow_romance";
  if (answers.environment === "remote") return "wild_explorer";
  return "coastal_calm";
}
