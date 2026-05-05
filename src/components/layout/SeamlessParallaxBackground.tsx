"use client";

import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

export type SeamlessParallaxBackgroundProps = {
  imageUrl: string;
  /** One full cycle = drifting exactly one viewport width (default ~2.5 min). */
  durationSec?: number;
  /** Applied to both duplicated panels. Must be valid CSS `filter` functions only (e.g. brightness(0.5) to darken — there is no `darken()`). */
  imageFilter?: string;
  wrapperClassName?: string;
};

/**
 * Infinite horizontal drift in one direction with no reverse: two identical
 * half-width panels tile edge-to-edge; translating by 50% of the track resets
 * visually to the same frame (works with any photo — no seam at the loop).
 */
export function SeamlessParallaxBackground({
  imageUrl,
  durationSec = 150,
  imageFilter,
  wrapperClassName,
}: SeamlessParallaxBackgroundProps) {
  const panelStyle = {
    backgroundImage: `url(${imageUrl})`,
    backgroundSize: "cover",
    backgroundPosition: "center center",
    backgroundRepeat: "no-repeat",
    ...(imageFilter ? { filter: imageFilter } : {}),
  } as const;

  return (
    <div
      className={cn("pointer-events-none overflow-hidden", wrapperClassName)}
      aria-hidden
    >
      <div
        className="seamless-parallax-track absolute left-0 top-0 flex h-full"
        style={
          {
            width: "200%",
            "--seamless-parallax-duration": `${durationSec}s`,
          } as CSSProperties
        }
      >
        <div className="h-full w-1/2 shrink-0 bg-cover bg-center" style={panelStyle} />
        <div className="h-full w-1/2 shrink-0 bg-cover bg-center" style={panelStyle} />
      </div>
    </div>
  );
}
