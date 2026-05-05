"use client";

/**
 * Full-column navy wash behind night marketing sections (deeper than the home hero card — see `.bg-landing-navy-wash-hero` in `globals.css`).
 * Stars + clouds: `LandingParallaxDecor` (layout) + `LandingMarketingFixedStarfield` (home night column).
 */
export function LandingMarketingAtmosphere() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <div className="absolute inset-0 bg-landing-navy-wash" />
    </div>
  );
}
