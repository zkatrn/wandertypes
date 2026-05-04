import type { CSSProperties } from "react";
import type { Theme } from "@/lib/themes";

function normalizeHex(hex: string): string | null {
  const h = hex.trim().replace(/^#/, "");
  if (h.length === 3) {
    return (
      h[0]! + h[0]! + h[1]! + h[1]! + h[2]! + h[2]!
    ).toLowerCase();
  }
  if (h.length === 6 && /^[a-f0-9]+$/i.test(h)) {
    return h.toLowerCase();
  }
  return null;
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const full = normalizeHex(hex);
  if (!full) return { r: 42, g: 77, b: 124 };
  const n = parseInt(full, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

export function rgbaFromHex(hex: string, alpha: number): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r},${g},${b},${alpha})`;
}

/** Rough sRGB luminance — for picking readable tints. */
export function isLightColor(hex: string): boolean {
  const { r, g, b } = hexToRgb(hex);
  const [R, G, B] = [r, g, b].map((c) => {
    const x = c / 255;
    return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
  });
  const lum = 0.2126 * R! + 0.7152 * G! + 0.0722 * B!;
  return lum > 0.72;
}

export type DestinationCardVisuals = {
  emphasis: string;
  barGradient: string;
  rootStyle: CSSProperties;
  winnerExtraStyle: CSSProperties;
  matchBadgeStyle: CSSProperties;
  matchBadgeWinnerStyle: CSSProperties;
  matchScoreWellStyle: CSSProperties;
  scoreNumberStyle: CSSProperties;
  starStyle: CSSProperties;
  economicsStyle: CSSProperties;
  verdictGoodStyle: CSSProperties;
  verdictGoodLabelStyle: CSSProperties;
  verdictWatchStyle: CSSProperties;
  verdictWatchLabelStyle: CSSProperties;
  listingLinkStyle: CSSProperties;
};

/**
 * Comparison card chrome derived from the active wandertype theme (primary / secondary / accent)
 * so results stay aligned with the results background art and global brand neutrals.
 */
export function getDestinationCardVisuals(
  theme: Theme,
  index: number,
  isWinner: boolean
): DestinationCardVisuals {
  const { primary, secondary, accent, background, cardBackground } = theme.colors;
  const cycle = [primary, accent, secondary];
  const emphasis = cycle[index % cycle.length]!;
  const barTo = cycle[(index + 1) % cycle.length]!;

  const barGradient = `linear-gradient(to right, ${primary}, ${barTo})`;

  const baseSurface = rgbaFromHex(cardBackground, 0.93);
  const winnerSurface = rgbaFromHex(cardBackground, 0.94);
  const winnerGlow = rgbaFromHex(emphasis, isLightColor(emphasis) ? 0.14 : 0.18);
  /** Sides + bottom only so `borderTopColor` stays the rotating emphasis stripe. */
  const winnerBorderSides = rgbaFromHex(primary, 0.2);

  const watchTint = (() => {
    if (!isLightColor(secondary)) {
      return {
        bg: rgbaFromHex(secondary, 0.12),
        border: rgbaFromHex(secondary, 0.32),
        label: secondary,
      };
    }
    if (!isLightColor(accent)) {
      return {
        bg: rgbaFromHex(accent, 0.12),
        border: rgbaFromHex(accent, 0.32),
        label: accent,
      };
    }
    return {
      bg: rgbaFromHex(primary, 0.06),
      border: rgbaFromHex(primary, 0.22),
      label: primary,
    };
  })();

  return {
    emphasis,
    barGradient,
    rootStyle: {
      backgroundColor: isWinner ? winnerSurface : baseSurface,
      borderTopColor: emphasis,
      borderTopWidth: 4,
    },
    winnerExtraStyle: isWinner
      ? {
          boxShadow: `0 12px 40px ${winnerGlow}`,
          borderLeftColor: winnerBorderSides,
          borderRightColor: winnerBorderSides,
          borderBottomColor: winnerBorderSides,
        }
      : {},
    matchBadgeStyle: {
      backgroundColor: rgbaFromHex(cardBackground, 0.88),
      borderColor: rgbaFromHex(primary, 0.18),
      color: rgbaFromHex(primary, 0.78),
    },
    matchBadgeWinnerStyle: {
      backgroundColor: rgbaFromHex(secondary, isLightColor(secondary) ? 0.42 : 0.22),
      borderColor: rgbaFromHex(emphasis, 0.42),
      color: primary,
    },
    matchScoreWellStyle: {
      backgroundColor: rgbaFromHex(emphasis, 0.08),
      borderColor: rgbaFromHex(emphasis, 0.22),
    },
    scoreNumberStyle: { color: emphasis },
    starStyle: { color: emphasis },
    economicsStyle: {
      backgroundColor: rgbaFromHex(background, 0.55),
      borderColor: rgbaFromHex(primary, 0.12),
    },
    verdictGoodStyle: {
      backgroundColor: rgbaFromHex(primary, 0.09),
      borderColor: rgbaFromHex(primary, 0.26),
    },
    verdictGoodLabelStyle: { color: primary },
    verdictWatchStyle: {
      backgroundColor: watchTint.bg,
      borderColor: watchTint.border,
    },
    verdictWatchLabelStyle: { color: watchTint.label },
    listingLinkStyle: {
      borderColor: rgbaFromHex(primary, 0.15),
      backgroundColor: rgbaFromHex(cardBackground, 0.88),
    },
  };
}
