import { AccordionSection } from "@/components/results/AccordionSection";
import {
  comparisonGridClassName,
  bottomLineBorderClass,
} from "@/lib/resultsLayout";
import type { DestinationComparisonCard, TripInterpretation } from "@/types/interpretation";

function mapsActivitySearchUrl(activity: string, nearPlace: string): string {
  const q = `${activity} ${nearPlace}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}

type Props = {
  interpretation: TripInterpretation;
};

export function ResultsInsightsAccordions({ interpretation }: Props) {
  const cards = interpretation.comparisonCards;
  const adventureGrid = comparisonGridClassName(cards.length, "gap-6");
  const bottomGrid = comparisonGridClassName(cards.length, "gap-4");

  const tradeoffs =
    interpretation.tradeoffWarnings.length > 0
      ? interpretation.tradeoffWarnings
      : [
          "No extra cautions were generated — still double-check visas, insurance, transit strikes, and local holidays for your exact dates.",
        ];

  return (
    <div className="space-y-4">
      <AccordionSection
        title="🗺️ Adventure options by base"
        defaultOpen={false}
      >
        <div className={adventureGrid}>
          {cards.map((card, columnIndex) => (
            <AdventureColumn
              key={card.destinationName}
              card={card}
              columnIndex={columnIndex}
            />
          ))}
        </div>
      </AccordionSection>

      <AccordionSection
        title="💡 Things you might not be thinking about"
        defaultOpen={false}
      >
        <div className="space-y-3">
          {tradeoffs.map((warning, index) => (
            <div
              key={index}
              className="p-3 bg-stone-50/95 border border-stone-200 rounded-lg text-xs text-stone-700 leading-relaxed"
            >
              {warning}
            </div>
          ))}
        </div>
      </AccordionSection>

      <AccordionSection title="⭐ Bottom line" defaultOpen={false}>
        {cards.length === 1 ? (
          <BottomLineSingle card={cards[0]} />
        ) : (
          <div className={`mt-2 ${bottomGrid}`}>
            {cards.map((card, index) => (
              <div
                key={card.destinationName}
                className={`p-5 bg-stone-50/95 border rounded-lg border-l-4 ${bottomLineBorderClass(
                  index
                )} border-stone-200`}
              >
                <h4 className="text-sm font-medium text-stone-900 mb-2 font-serif">
                  {card.destinationName.split("/")[0].trim()}
                </h4>
                <p className="text-xs text-stone-700 leading-relaxed mb-2">
                  {card.verdictGood}
                </p>
                <p className="text-xs text-stone-600 leading-relaxed italic">
                  {card.verdictWatch}
                </p>
              </div>
            ))}
          </div>
        )}
      </AccordionSection>
    </div>
  );
}

function AdventureColumn({
  card,
  columnIndex,
}: {
  card: DestinationComparisonCard;
  columnIndex: number;
}) {
  const mapsBase = card.searchLinks.googleMaps;
  const activities = card.suggestedActivities;

  const hasTripEconomics =
    Boolean(card.estimatedSpendBand) ||
    Boolean(card.primaryAirportLabel) ||
    card.distanceFromPrimaryAirportKm != null;

  return (
    <div className="min-w-0 rounded-lg border border-stone-200/90 bg-stone-50/60 p-4">
      <div className="mb-3 pb-3 border-b border-stone-200">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-stone-400">
          Base option {columnIndex + 1}
        </p>
        <h4 className="mt-2 text-base font-semibold text-stone-900 font-serif leading-snug">
          {card.destinationName}
        </h4>
        {hasTripEconomics ? (
          <dl className="mt-3 space-y-1.5 text-[11px] text-stone-600 leading-relaxed">
            {card.estimatedSpendBand ? (
              <div>
                <dt className="font-semibold text-stone-500 inline">Spend band: </dt>
                <dd className="inline">{card.estimatedSpendBand}</dd>
              </div>
            ) : null}
            {card.primaryAirportLabel ? (
              <div>
                <dt className="font-semibold text-stone-500 inline">Primary airport: </dt>
                <dd className="inline">{card.primaryAirportLabel}</dd>
              </div>
            ) : null}
            {card.distanceFromPrimaryAirportKm != null ? (
              <div>
                <dt className="font-semibold text-stone-500 inline">
                  Airport to center (driving):{" "}
                </dt>
                <dd className="inline">
                  ~{card.distanceFromPrimaryAirportKm} km
                  {card.distanceFromPrimaryAirportDriveMinutes != null
                    ? ` · ~${Math.round(card.distanceFromPrimaryAirportDriveMinutes)} min`
                    : ""}
                  {card.airportDistanceSource === "google_distance_matrix"
                    ? " (Google; traffic varies)"
                    : ""}
                </dd>
              </div>
            ) : null}
          </dl>
        ) : null}
      </div>
      {card.summary ? (
        <p className="text-xs text-stone-600 mb-3 leading-relaxed">{card.summary}</p>
      ) : null}

      {card.bestFor.length > 0 && (
        <div className="mb-3">
          <p className="text-[10px] uppercase tracking-wide text-stone-400 font-medium mb-1.5">
            Strong fit for
          </p>
          <ul className="list-disc list-inside text-xs text-stone-700 space-y-1">
            {card.bestFor.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mb-3">
        <p className="text-[10px] uppercase tracking-wide text-stone-400 font-medium mb-1.5">
          Activities & ideas
        </p>
        {activities.length > 0 ? (
          <ul className="space-y-2 text-xs">
            {activities.map((activity) => (
              <li
                key={activity}
                className="pb-2 border-b border-stone-200/80 last:border-0 last:pb-0"
              >
                <a
                  href={mapsActivitySearchUrl(activity, card.destinationName)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-800 hover:text-amber-950 font-medium underline-offset-2 hover:underline"
                >
                  {activity}
                </a>
                <span className="text-stone-500"> — Maps</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-stone-600 leading-relaxed">
            No activities listed for this base. Use the links below or open the
            destination card above.
          </p>
        )}
      </div>

      {card.possibleDrawbacks.length > 0 && (
        <div className="mb-3 p-2.5 bg-amber-50/90 border border-amber-100 rounded-md">
          <p className="text-[10px] uppercase tracking-wide text-amber-900/70 font-medium mb-1">
            Logistics & caveats
          </p>
          <ul className="text-xs text-amber-950/90 space-y-1 list-disc list-inside">
            {card.possibleDrawbacks.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-xs text-stone-600 leading-relaxed mb-2">
        <span className="font-medium text-stone-800">Watch: </span>
        {card.verdictWatch}
      </p>

      <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px]">
        {mapsBase ? (
          <a
            href={mapsBase}
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-800 hover:underline font-medium"
          >
            Area in Google Maps
          </a>
        ) : null}
        {card.searchLinks.tripadvisorSearch ? (
          <a
            href={card.searchLinks.tripadvisorSearch}
            target="_blank"
            rel="noopener noreferrer"
            className="text-stone-600 hover:text-stone-900 hover:underline"
          >
            TripAdvisor search
          </a>
        ) : null}
        {card.searchLinks.airbnbSearch ? (
          <a
            href={card.searchLinks.airbnbSearch}
            target="_blank"
            rel="noopener noreferrer"
            className="text-stone-600 hover:text-stone-900 hover:underline"
          >
            Airbnb search
          </a>
        ) : null}
      </div>
    </div>
  );
}

function BottomLineSingle({ card }: { card: DestinationComparisonCard }) {
  return (
    <div className="mt-2 space-y-3 text-sm text-stone-800">
      <p className="font-medium font-serif text-base text-stone-900 leading-snug">
        {card.destinationName}
      </p>
      <p className="text-xs leading-relaxed text-stone-800">{card.verdictGood}</p>
      <p className="text-xs leading-relaxed text-stone-600">{card.verdictWatch}</p>
      {card.summary ? (
        <p className="text-xs leading-relaxed text-stone-600 border-t border-stone-200 pt-3">
          {card.summary}
        </p>
      ) : null}
    </div>
  );
}
