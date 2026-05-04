import type { TripInterpretation, DestinationComparisonCard } from "@/types/interpretation";
import type { SurveyAnswers } from "@/types/survey";
import { getInterpretationCopyForWandertype } from "@/lib/wanderType";
import {
  heuristicActivitiesForDestination,
  heuristicBestFor,
  heuristicDrawbacks,
  heuristicPrimaryAirportLabel,
  heuristicSpendBand,
  heuristicSummary,
  heuristicVerdictGood,
  heuristicVerdictWatch,
} from "@/lib/destinationHeuristics";
import { listedPlaces, MAX_COMPARISON_CARDS } from "@/lib/comparisonCardPolicy";
import { selectThemeFromSurveyAnswers } from "@/lib/themeFromSurvey";

function userPickedDestinationList(answers: SurveyAnswers): string[] | null {
  if (answers.chooseForMe === true) return null;
  const merged = listedPlaces(answers);
  if (merged.length === 0) return null;
  return merged.slice(0, MAX_COMPARISON_CARDS);
}

export function generateMockInterpretation(
  answers: SurveyAnswers
): TripInterpretation {
  const selectedTheme = selectThemeFromSurveyAnswers(answers);
  const picked = userPickedDestinationList(answers);
  const comparisonCards =
    picked && picked.length > 0
      ? generateCardsForUserDestinations(picked, answers)
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
    tradeoffWarnings: buildMockTradeoffWarnings(comparisonCards, answers),
    comparisonCards,
  };
}

function buildMockTradeoffWarnings(
  cards: DestinationComparisonCard[],
  answers: SurveyAnswers
): string[] {
  const names = cards.map((c) => c.destinationName.trim()).filter(Boolean);
  const out: string[] = [];

  if (names.length >= 2) {
    const [a, b] = names;
    out.push(
      `Splitting nights between ${a} and ${b} usually burns at least a half-day to a full day in transfers — plan roughly 3–8 hours door-to-door depending on mode, traffic, and whether you are hauling luggage.`
    );
  } else if (names.length === 1) {
    out.push(
      `With ${names[0]} as your main base, double-check how far your must-see stops sit from where you sleep — short hops on a map often become 2–4 hour round trips once parking, ferries, or mountain roads are included.`
    );
  }

  if (names.length >= 3) {
    out.push(
      `With ${names.length} different bases on the board, watch for backtracking — the most scenic route is not always the fastest between ${names[0]}, ${names[1]}, and ${names[2]}.`
    );
  }

  const legacyList =
    answers.destinationList?.length && answers.destinationList.length > 0
      ? answers.destinationList
      : answers.destinations;
  if (legacyList && legacyList.length >= 2) {
    const x = legacyList[0];
    const y = legacyList[1];
    out.push(
      `If you are weighing ${x} vs ${y}, sanity-check what a realistic day looks like from each address (not just city center pins) — last-mile time is where trips quietly go off the rails.`
    );
  }

  if (answers.openText?.trim()) {
    const snippet = answers.openText.trim().slice(0, 140);
    out.push(
      `You noted: "${snippet}${answers.openText.trim().length > 140 ? "…" : ""}" — map that explicitly onto arrival windows, luggage, and how tired the group will be on transfer days.`
    );
  }

  for (const c of cards) {
    for (const d of c.possibleDrawbacks) {
      if (out.length >= 6) break;
      if (!out.includes(d)) out.push(`${c.destinationName}: ${d}`);
    }
    if (out.length >= 6) break;
  }

  if (out.length < 2) {
    out.push(
      "Peak weeks concentrate crowds around the top-rated few blocks in each area — book dinner and any timed entry early, especially for weekend arrivals."
    );
  }

  return out.slice(0, 6);
}

function generateCardsForUserDestinations(
  destinations: string[],
  answers: SurveyAnswers
): DestinationComparisonCard[] {
  return destinations.map((dest, index) => ({
    destinationName: dest,
    summary: heuristicSummary(dest, index),
    matchScore: 85 - index * 5,
    matchLabel: index === 0 ? "Best Match" : index === 1 ? "Strong option" : "Worth considering",
    bestFor: heuristicBestFor(dest),
    possibleDrawbacks: heuristicDrawbacks(dest),
    verdictGood: heuristicVerdictGood(dest),
    verdictWatch: heuristicVerdictWatch(dest),
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
    estimatedSpendBand: heuristicSpendBand(
      dest,
      index,
      answers.tripLengthNights
    ),
    primaryAirportLabel: heuristicPrimaryAirportLabel(dest),
    suggestedActivities: heuristicActivitiesForDestination(dest),
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
        estimatedSpendBand:
          "Mid week in CR: about $2.5k–4.2k per person (lodging + meals + local transport); flights extra.",
        primaryAirportLabel: "Juan Santamaría (SJO) — most international arrivals",
        suggestedActivities: [
          "Manuel Antonio National Park wildlife loop",
          "Espadilla Beach morning",
          "Catamaran + snorkeling (Quepos coast)",
          "Mangrove kayak near Damas Island",
          "Sunset viewpoint above the park ridge",
          "Local sodas + ceviche crawl in Quepos",
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
        estimatedSpendBand:
          "Strong euro value: about $2k–3.5k per person for a week (lodging + meals + local transport); flights extra.",
        primaryAirportLabel: "Faro (FAO) — closest major airport to the coast",
        suggestedActivities: [
          "Benagil sea cave boat tour",
          "Seven Hanging Valleys cliff walk",
          "Lagos old town + Ponta da Piedade viewpoints",
          "Sagres fortress + surf beaches",
          "Olhão market + grilled fish lunch",
          "East Algarve salt pans & flamingo flats",
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
        estimatedSpendBand:
          "Wide range: about $1.2k–3k per person for a week depending on villa tier; flights extra.",
        primaryAirportLabel: "Ngurah Rai (DPS) — Denpasar / Bali main airport",
        suggestedActivities: [
          "Campuhan Ridge sunrise walk (Ubud)",
          "Tegalalang rice terraces + swing viewpoints",
          "Sacred Monkey Forest (Ubud)",
          "Balinese cooking class",
          "Canggu beginner surf session",
          "Spa + sound bath afternoon",
        ],
        searchLinks: {
          googleMaps: "https://maps.google.com/?q=Ubud+Bali",
          airbnbSearch: "https://www.airbnb.com/s/Ubud--Bali",
        },
        airbnbListings: [],
      },
    ];
}

