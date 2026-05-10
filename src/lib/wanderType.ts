export type WandertypeKey =
  | "coastal_calm"
  | "golden_adventure"
  | "city_spark"
  | "rainforest_luxe"
  | "slow_romance"
  | "wild_explorer"
  | "balanced_journey";

export type WandertypePageDetails = {
  idealDestinations: string;
  avoids: string;
  pace: string;
  bestWith: string;
};

export type Wandertype = {
  key: WandertypeKey;
  name: string;
  emoji: string;
  title: string;
  subtitle: string;
  description: string;
  microcopy: string;
  traits: [string, string, string];
  color: string;
  pageDetails: WandertypePageDetails;
};

export const WANDERTYPES: Record<WandertypeKey, Wandertype> = {

  coastal_calm: {
    key: "coastal_calm",
    name: "The Unplugger",
    emoji: "🌊",
    title: "🌊 The Unplugger",
    subtitle: "I don't need an itinerary. I need a hammock and a horizon.",
    description:
      "You're not here to maximize — you're here to exhale. The best version of this trip is slow mornings, warm water, and zero pressure to perform. You're probably coming off something hard, and the trip itself is the recovery. Rest isn't laziness. It's the whole point.",
    microcopy:
      "You don't need the most epic trip. You need the most restorative one. We found destinations that will actually let you breathe.",
    traits: ["Slow mornings", "Zero agenda", "Maximum exhale"],
    color: "#2a6f8f",
    pageDetails: {
      idealDestinations:
        "Beach towns, island retreats, coastal villages, spa resorts",
      avoids:
        "Packed itineraries, long drives, loud nightlife, changing hotels",
      pace: "Slow — coffee first, always",
      bestWith: "Solo, couple, or very aligned small group",
    },
  },

  golden_adventure: {
    key: "golden_adventure",
    name: "The Seeker",
    emoji: "🌋",
    title: "🌋 The Seeker",
    subtitle: "I want to come home with a story nobody else has.",
    description:
      "You travel for the moments that feel earned — the waterfall at the end of a muddy trail, the volcano glowing at dusk, the zip line that made your stomach drop. You're not afraid of friction. If anything, it's part of the story. You'll sleep when you're home.",
    microcopy:
      "You're not here for pretty — you're here for unforgettable. We found the destinations that will actually push you.",
    traits: ["Adventure-first", "Friction is fine", "Earned experiences"],
    color: "#b85f42",
    pageDetails: {
      idealDestinations:
        "Jungle regions, volcanic areas, rainforest lodges, adventure hubs",
      avoids:
        "Pure beach trips, passive pool days, over-comfortable itineraries",
      pace: "Packed or balanced — every day counts",
      bestWith: "Friends, solo, or aligned mixed group",
    },
  },

  city_spark: {
    key: "city_spark",
    name: "The Wanderer",
    emoji: "🍜",
    title: "🍜 The Wanderer",
    subtitle: "The best part of travel is getting beautifully lost.",
    description:
      "You follow your nose. You'd rather stumble onto a perfect local restaurant than book the most reviewed one. You want to feel a place — its rhythms, its flavors, its streets at golden hour. Plans are suggestions. The best moments are always unscheduled.",
    microcopy:
      "You travel to feel somewhere, not just see it. We found destinations with enough soul to get beautifully lost in.",
    traits: ["Culture-driven", "Spontaneous", "Flavor-first"],
    color: "#7b3f9e",
    pageDetails: {
      idealDestinations:
        "Historic cities, food capitals, old towns, street market cultures",
      avoids:
        "Rigid itineraries, resort-only trips, pure beach with no culture",
      pace: "Balanced — depends on what the day brings",
      bestWith: "Solo, couple, or culturally curious friends",
    },
  },

  rainforest_luxe: {
    key: "rainforest_luxe",
    name: "The Nester",
    emoji: "🏡",
    title: "🏡 The Nester",
    subtitle: "Find us an extraordinary house and we'll make our own magic.",
    description:
      "The property is the vacation. A stunning pool, a kitchen worth using, views that make you stop mid-sentence — that's what you're optimizing for. You're not avoiding adventure, you just want the base camp to be so good that staying in is equally appealing. The house is the trip.",
    microcopy:
      "The right base changes everything. We found destinations where the house itself is worth the trip — everything else is a bonus.",
    traits: ["Property-first", "Comfortable base", "Unhurried"],
    color: "#2d6a4f",
    pageDetails: {
      idealDestinations:
        "Villa destinations, jungle lodges, mountain retreats, anywhere with exceptional rentals",
      avoids:
        "Constantly moving, purely functional properties, destinations where the house doesn't matter",
      pace: "Slow — one great thing per day, maybe",
      bestWith:
        "Friends group, family, or anyone who loves a beautiful shared space",
    },
  },

  slow_romance: {
    key: "slow_romance",
    name: "The Romantic",
    emoji: "💕",
    title: "💕 The Romantic",
    subtitle: "I want this trip to feel like a memory we'll talk about forever.",
    description:
      "Every detail matters — the right table, the right light, the view from the right window. You're not chasing activities; you're chasing atmosphere. You want the trip to feel cinematic, intimate, and quietly unforgettable. Less itinerary, more love story.",
    microcopy:
      "You're not looking for the most — you're looking for the most meaningful. We found destinations that turn a trip into a love story.",
    traits: ["Atmosphere over activity", "Intimate", "Cinematic"],
    color: "#8b3a62",
    pageDetails: {
      idealDestinations:
        "Mediterranean islands, cliffside villages, boutique hotel destinations",
      avoids:
        "Loud group activities, packed schedules, anywhere that feels impersonal",
      pace: "Slow — linger over every moment",
      bestWith: "Couple, or solo traveler seeking beauty and depth",
    },
  },

  wild_explorer: {
    key: "wild_explorer",
    name: "The Collector",
    emoji: "🗺️",
    title: "🗺️ The Collector",
    subtitle: "More stamps, more stories, more everything.",
    description:
      "You've already started the research. You have a list. You feel genuine satisfaction crossing things off it. You want to do a destination justice — not just visit it, but *do* it. High energy, high curiosity, high output. You'll rest on the next trip.",
    microcopy:
      "You want the full picture — and you've got the energy to get it. We found destinations with enough on the list to satisfy even you.",
    traits: ["Maximize every day", "Lists are love", "High output"],
    color: "#1a3a6b",
    pageDetails: {
      idealDestinations:
        "High activity density, multi-base trips, iconic experience-rich regions",
      avoids:
        "Slow single-note trips, passive beach-only experiences, limited activity zones",
      pace: "Packed — every hour is an opportunity",
      bestWith: "Solo, or equally energetic travel companions",
    },
  },

  balanced_journey: {
    key: "balanced_journey",
    name: "The Harmony Seeker",
    emoji: "🌿",
    title: "🌿 The Harmony Seeker",
    subtitle: "I want it all — just balanced beautifully.",
    description:
      "You're probably the one holding the group together. You want adventure AND rest, nature AND comfort, something for the beach people AND the hiking people. You'll sacrifice your own preference to make sure everyone's happy — which means you need a destination that makes that easy.",
    microcopy:
      "You're the reason this trip is going to work for everyone. We found destinations with enough variety that nobody has to compromise — they just have to show up.",
    traits: ["Group diplomat", "Balanced pace", "Something for everyone"],
    color: "#2a6b5a",
    pageDetails: {
      idealDestinations:
        "Varied destinations — beach AND nature AND culture within reach",
      avoids:
        "Single-note destinations, anywhere that only works for one traveler type",
      pace: "Balanced — active some days, slow others",
      bestWith: "Mixed groups, families, friends with different priorities",
    },
  },

};