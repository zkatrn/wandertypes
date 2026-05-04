"use client";

import { motion } from "framer-motion";
import type { DestinationComparisonCard } from "@/types/interpretation";
import type { Theme } from "@/lib/themes";
import { getDestinationCardVisuals } from "@/lib/themeColors";

interface DestinationCardProps {
  card: DestinationComparisonCard;
  index: number;
  theme: Theme;
}

export function DestinationCard({ card, index, theme }: DestinationCardProps) {
  const rawScores = card.scores as Record<string, number> | undefined;
  const scores = {
    relaxation: rawScores?.relaxation ?? 0,
    adventure: rawScores?.adventure ?? 0,
    accessibility: rawScores?.accessibility ?? 0,
    wowFactor: rawScores?.wowFactor ?? 0,
    food: rawScores?.food ?? 0,
    nightlife: rawScores?.nightlife ?? 0,
    nature: rawScores?.nature ?? 0,
    costEfficiency: rawScores?.costEfficiency ?? 0,
    beach:
      rawScores?.beach ??
      Math.min(100, Math.round((rawScores?.nature ?? 50) * 0.75)),
    eightNightValue:
      rawScores?.eightNightValue ??
      rawScores?.airportDistance ??
      rawScores?.costEfficiency ??
      50,
  };

  const matchScore =
    typeof card.matchScore === "number" && !Number.isNaN(card.matchScore)
      ? card.matchScore
      : Math.round(
          (scores.adventure +
            scores.relaxation +
            scores.nature +
            scores.wowFactor) /
            4
        );

  const matchLabel =
    card.matchLabel ||
    (matchScore >= 85 ? "Strong match" : "Saved comparison");

  const verdictGood =
    card.verdictGood ||
    card.summary ||
    "A solid option to compare with your priorities.";

  const verdictWatch =
    card.verdictWatch ||
    card.possibleDrawbacks?.[0] ||
    "Double-check timing, weather, and logistics for your group.";

  const airbnbListings = card.airbnbListings ?? [];

  const isWinner = matchScore >= 85;
  const v = getDestinationCardVisuals(theme, index, isWinner);

  const getStarRating = (score: number) => {
    const stars = Math.round((score / 20) * 2) / 2;
    const fullStars = Math.floor(stars);
    const hasHalfStar = stars % 1 !== 0;
    const emptyStars = 5 - Math.ceil(stars);

    return (
      <div
        className="text-lg tracking-wide"
        style={{
          ...v.starStyle,
          opacity: 1,
        }}
      >
        {"★".repeat(fullStars)}
        {hasHalfStar && "½"}
        <span style={{ opacity: 0.32 }}>{"★".repeat(emptyStars)}</span>
      </div>
    );
  };

  const categories = [
    { icon: "🥾", label: "Adventure", value: scores.adventure },
    { icon: "🚗", label: "Logistics", value: scores.accessibility },
    { icon: "🌊", label: "Beach", value: scores.beach },
    { icon: "🏡", label: "Wow Factor", value: scores.wowFactor },
    { icon: "🍽️", label: "Food & Life", value: scores.food },
    { icon: "🗓️", label: "8-Night Value", value: scores.eightNightValue },
  ];

  const hasTripEconomics =
    Boolean(card.estimatedSpendBand) ||
    Boolean(card.primaryAirportLabel) ||
    card.distanceFromPrimaryAirportKm != null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`
        border border-stone-200 border-t-4 rounded-lg p-6
        flex flex-col gap-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg
      `}
      style={{
        ...v.rootStyle,
        ...(isWinner ? v.winnerExtraStyle : {}),
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold leading-tight text-stone-900 font-serif">
          {card.destinationName}
        </h3>
        <span
          className="text-[10px] uppercase tracking-wide px-3 py-1 rounded-full whitespace-nowrap font-medium border"
          style={isWinner ? v.matchBadgeWinnerStyle : v.matchBadgeStyle}
        >
          {matchLabel}
        </span>
      </div>

      <div
        className="text-center p-4 rounded-lg border"
        style={v.matchScoreWellStyle}
      >
        <div className="text-[10px] uppercase tracking-wide text-stone-500 font-medium mb-2">
          Match Score
        </div>
        <div
          className="text-4xl font-bold leading-none mb-1"
          style={v.scoreNumberStyle}
        >
          {matchScore}%
        </div>
        {getStarRating(matchScore)}
      </div>

      {hasTripEconomics && (
        <div
          className="rounded-lg border px-3 py-2.5 text-xs text-stone-600 space-y-1.5 leading-relaxed"
          style={v.economicsStyle}
        >
          {card.estimatedSpendBand ? (
            <p>
              <span className="font-semibold text-stone-500">Spend band: </span>
              {card.estimatedSpendBand}
            </p>
          ) : null}
          {card.primaryAirportLabel ? (
            <p>
              <span className="font-semibold text-stone-500">Primary airport: </span>
              {card.primaryAirportLabel}
            </p>
          ) : null}
          {card.distanceFromPrimaryAirportKm != null ? (
            <p>
              <span className="font-semibold text-stone-500">
                Airport to center (driving):{" "}
              </span>
              ~{card.distanceFromPrimaryAirportKm} km
              {card.distanceFromPrimaryAirportDriveMinutes != null
                ? ` · ~${Math.round(card.distanceFromPrimaryAirportDriveMinutes)} min`
                : ""}
              {card.airportDistanceSource === "google_distance_matrix"
                ? " — Google estimate; traffic varies."
                : ""}
            </p>
          ) : null}
        </div>
      )}

      <div className="space-y-3">
        {categories.map((category, catIndex) => (
          <div
            key={category.label}
            className="flex items-center gap-3 min-h-[1.375rem]"
          >
            <span className="text-sm w-5 flex-shrink-0 text-center">
              {category.icon}
            </span>
            <span className="text-xs text-stone-600 w-[5.75rem] flex-shrink-0 tracking-wide leading-tight">
              {category.label}
            </span>
            <div className="flex-1 min-w-0 h-1.5 bg-stone-200/90 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, Math.max(0, category.value))}%` }}
                transition={{
                  delay: index * 0.1 + catIndex * 0.05,
                  duration: 0.55,
                  ease: "easeOut",
                }}
                className="h-full rounded-full"
                style={{ background: v.barGradient }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <div className="p-3 rounded-lg border" style={v.verdictGoodStyle}>
          <div
            className="text-[10px] uppercase tracking-wide font-medium mb-1"
            style={v.verdictGoodLabelStyle}
          >
            Best fit if…
          </div>
          <div className="text-xs text-stone-700 leading-relaxed">{verdictGood}</div>
        </div>
        <div className="p-3 rounded-lg border" style={v.verdictWatchStyle}>
          <div
            className="text-[10px] uppercase tracking-wide font-medium mb-1"
            style={v.verdictWatchLabelStyle}
          >
            Watch out for…
          </div>
          <div className="text-xs text-stone-700 leading-relaxed">{verdictWatch}</div>
        </div>
      </div>

      {airbnbListings.length > 0 && (
        <div>
          <div className="text-[10px] uppercase tracking-wide text-stone-400 font-medium mb-2">
            Airbnb Options
          </div>
          <div className="space-y-2">
            {airbnbListings.map((listing, listIndex) => (
              <a
                key={listIndex}
                href={listing.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-xs text-primary border rounded-lg px-3 py-2 transition-colors hover:brightness-[0.97]"
                style={v.listingLinkStyle}
              >
                🏠 {listing.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
