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

/**
 * Fixed stars + drifting clouds with the landing photo stack: inside the main
 * chrome shell at `z-index: 0`, below the inner `z-10` content (see `globals.css`
 * `.lpd-root`). Home (`/`) only.
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
      <div className="lpd-clouds">
        <div
          className="lpd-cloud"
          style={{
            top: "15%",
            ["--cd" as string]: "25s",
            ["--cdelay" as string]: "0s",
          }}
        >
          ☁️
        </div>
        <div
          className="lpd-cloud"
          style={{
            top: "28%",
            ["--cd" as string]: "32s",
            ["--cdelay" as string]: "8s",
          }}
        >
          ☁️
        </div>
        <div
          className="lpd-cloud"
          style={{
            top: "10%",
            ["--cd" as string]: "28s",
            ["--cdelay" as string]: "14s",
          }}
        >
          ☁️
        </div>
        <div
          className="lpd-cloud"
          style={{
            top: "22%",
            ["--cd" as string]: "36s",
            ["--cdelay" as string]: "4s",
          }}
        >
          ☁️
        </div>
      </div>
    </div>
  );
}
