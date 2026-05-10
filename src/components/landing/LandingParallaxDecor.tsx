"use client";

import { useEffect, useState } from "react";

type StarSpec = {
  id: number;
  size: number;
  topPct: number;
  leftPct: number;
  durationS: number;
  delayS: number;
};

type VesselLayer = {
  src: string;
  top: string;
  cd: string;
  cdelay: string;
  /** CSS length for --vessel-h */
  heightVar: string;
};

/**
 * Only four layers (≤4 on screen). Long cycle + quarter-phase delays spread them out.
 * Sailboat PNGs use ~50% of the original visual height.
 *
 * Add matching files under `/public` for artwork; if a file is missing, an emoji
 * fallback renders so the drift layer never collapses to zero size.
 */
const VESSEL_LAYERS: VesselLayer[] = [
  {
    src: "/sailboat-1.png",
    top: "11%",
    cd: "112s",
    cdelay: "0s",
    heightVar: "clamp(18px, 3vw, 37px)",
  },
  {
    src: "/ship-1.png",
    top: "34%",
    cd: "112s",
    cdelay: "28s",
    heightVar: "clamp(42px, 7vw, 84px)",
  },
  {
    src: "/sailboat-2.png",
    top: "56%",
    cd: "112s",
    cdelay: "56s",
    heightVar: "clamp(17px, 2.9vw, 35px)",
  },
  {
    src: "/submarine.png",
    top: "68%",
    cd: "112s",
    cdelay: "84s",
    heightVar: "clamp(24px, 4.2vw, 52px)",
  },
];

function fallbackEmoji(src: string): string {
  if (src.includes("sailboat")) return "⛵";
  if (src.includes("submarine")) return "🛳️";
  if (src.includes("boat")) return "🚤";
  if (src.includes("ship")) return "🚢";
  return "⛵";
}

function generateStars(): StarSpec[] {
  return Array.from({ length: 60 }, (_, id) => ({
    id,
    size: Math.random() * 2.5 + 0.8,
    topPct: Math.random() * 100,
    leftPct: Math.random() * 100,
    durationS: Math.random() * 3 + 1.5,
    delayS: Math.random() * 5,
  }));
}

function DriftingVessel({ layer }: { layer: VesselLayer }) {
  const [showImg, setShowImg] = useState(true);

  const shellStyle = {
    top: layer.top,
    ["--cd" as string]: layer.cd,
    ["--cdelay" as string]: layer.cdelay,
    ["--vessel-h" as string]: layer.heightVar,
  } as const;

  return (
    <div className="lpd-vessel" style={shellStyle}>
      {showImg ? (
        // eslint-disable-next-line @next/next/no-img-element -- decorative sprites
        <img
          src={layer.src}
          alt=""
          draggable={false}
          onError={() => setShowImg(false)}
        />
      ) : (
        <span
          className="select-none leading-none"
          style={{
            fontSize: "var(--vessel-h)",
            filter:
              "drop-shadow(0 2px 8px rgba(15, 12, 41, 0.45)) drop-shadow(0 4px 16px rgba(42, 111, 143, 0.25))",
          }}
          aria-hidden
        >
          {fallbackEmoji(layer.src)}
        </span>
      )}
    </div>
  );
}

/**
 * Fixed stars + drifting vessel sprites from `/public` (PNG or emoji fallback).
 */
export function LandingParallaxDecor() {
  const [stars, setStars] = useState<StarSpec[]>([]);

  useEffect(() => {
    setStars(generateStars());
  }, []);

  return (
    <div className="lpd-root" aria-hidden>
      <div className="lpd-stars">
        {stars.map((s) => (
          <div
            key={s.id}
            className="lpd-star"
            style={{
              width: s.size,
              height: s.size,
              top: `${s.topPct}%`,
              left: `${s.leftPct}%`,
              ["--d" as string]: `${s.durationS.toFixed(1)}s`,
              animationDelay: `${s.delayS.toFixed(1)}s`,
            }}
          />
        ))}
      </div>
      <div className="lpd-sea">
        {VESSEL_LAYERS.map((layer, i) => (
          <DriftingVessel key={`${layer.src}-${i}`} layer={layer} />
        ))}
      </div>
    </div>
  );
}
