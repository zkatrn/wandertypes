import type { ThemeKey } from "@/types/interpretation";
import { WANDERTYPES, type WandertypeKey } from "./wanderType";

export type Theme = {
  key: ThemeKey;
  /** Display name — from WANDERTYPES (e.g. "The Seeker") */
  name: string;
  /** Short tagline — Wandertype `subtitle` */
  description: string;
  /** Long body copy — Wandertype `description` */
  longDescription: string;
  microcopy: string;
  emoji: string;
  title: string;
  traits: [string, string, string];
  accentColor: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    cardBackground: string;
  };
  gradient: string;
  backgroundImage: string;
};

type VisualTheme = {
  colors: Theme["colors"];
  gradient: string;
  backgroundImage: string;
};

const VISUAL: Record<WandertypeKey, VisualTheme> = {
  coastal_calm: {
    colors: {
      primary: "#2a6f8f",
      secondary: "#f4e4c1",
      accent: "#7ec8c8",
      background: "#f0f9ff",
      cardBackground: "#ffffff",
    },
    gradient: "from-[#1a4a6b] to-[#f9c784]",
    backgroundImage: "/background-the-unplugger.png",
  },
  golden_adventure: {
    colors: {
      primary: "#b85f42",
      secondary: "#f4a53a",
      accent: "#2d6a4f",
      background: "#F7F9F9",
      cardBackground: "#ffffff",
    },
    gradient: "from-[#1a1a2e] to-[#f4800a]",
    backgroundImage: "/background-the-seeker.png",
  },
  city_spark: {
    colors: {
      primary: "#7b3f9e",
      secondary: "#f0c060",
      accent: "#e8734a",
      background: "#eef2ff",
      cardBackground: "#ffffff",
    },
    gradient: "from-[#1e1040] to-[#f4c430]",
    backgroundImage: "/background-the-wanderer.png",
  },
  rainforest_luxe: {
    colors: {
      primary: "#2d6a4f",
      secondary: "#f9e4b7",
      accent: "#c9a84c",
      background: "#ecfdf5",
      cardBackground: "#ffffff",
    },
    gradient: "from-[#1a2e1e] to-[#f9d78a]",
    backgroundImage: "/background-the-nester.png",
  },
  slow_romance: {
    colors: {
      primary: "#8b3a62",
      secondary: "#f9e0d0",
      accent: "#c9956a",
      background: "#fdf2f8",
      cardBackground: "#ffffff",
    },
    gradient: "from-[#1a0a2e] to-[#f4c4a0]",
    backgroundImage: "/background-the-romantic.png",
  },
  wild_explorer: {
    colors: {
      primary: "#1a3a6b",
      secondary: "#f4c430",
      accent: "#4ab8c4",
      background: "#f0fdf4",
      cardBackground: "#ffffff",
    },
    gradient: "from-[#0a1628] to-[#f4c430]",
    backgroundImage: "/background-the-collector.png",
  },
  balanced_journey: {
    colors: {
      primary: "#2a6b5a",
      secondary: "#f9e4a0",
      accent: "#7ab8a0",
      background: "#f0fdf4",
      cardBackground: "#ffffff",
    },
    gradient: "from-[#0e2a24] to-[#f4d060]",
    backgroundImage: "/background-the-harmony-seeker.png",
  },
};

function buildTheme(key: ThemeKey): Theme {
  const w = WANDERTYPES[key];
  const v = VISUAL[key];
  return {
    key,
    name: w.name,
    description: w.subtitle,
    longDescription: w.description,
    microcopy: w.microcopy,
    emoji: w.emoji,
    title: w.title,
    traits: w.traits,
    accentColor: w.color,
    colors: v.colors,
    gradient: v.gradient,
    backgroundImage: v.backgroundImage,
  };
}

export const themes: Record<ThemeKey, Theme> = {
  coastal_calm: buildTheme("coastal_calm"),
  golden_adventure: buildTheme("golden_adventure"),
  city_spark: buildTheme("city_spark"),
  rainforest_luxe: buildTheme("rainforest_luxe"),
  slow_romance: buildTheme("slow_romance"),
  wild_explorer: buildTheme("wild_explorer"),
  balanced_journey: buildTheme("balanced_journey"),
};

export function getTheme(key: ThemeKey): Theme {
  if (key in themes) {
    return themes[key];
  }
  return themes.coastal_calm;
}
