import type { DestinationComparisonCard } from "@/types/interpretation";

type LatLng = { lat: number; lng: number };

type GeocodeResponse = {
  status: string;
  results?: { geometry: { location: LatLng } }[];
};

type DistanceMatrixResponse = {
  status: string;
  rows?: {
    elements: {
      status: string;
      distance?: { value: number };
      duration?: { value: number };
    }[];
  }[];
};

async function geocode(
  address: string,
  apiKey: string
): Promise<LatLng | null> {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address
  )}&key=${encodeURIComponent(apiKey)}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = (await res.json()) as GeocodeResponse;
  if (data.status !== "OK" || !data.results?.[0]?.geometry?.location) {
    return null;
  }
  return data.results[0].geometry.location;
}

async function drivingMetersAndSeconds(
  origin: LatLng,
  destination: LatLng,
  apiKey: string
): Promise<{ meters: number; seconds: number } | null> {
  const origins = `${origin.lat},${origin.lng}`;
  const dests = `${destination.lat},${destination.lng}`;
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${origins}&destinations=${dests}&mode=driving&key=${encodeURIComponent(
    apiKey
  )}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = (await res.json()) as DistanceMatrixResponse;
  const el = data.rows?.[0]?.elements?.[0];
  if (!el || el.status !== "OK" || !el.distance || !el.duration) return null;
  return { meters: el.distance.value, seconds: el.duration.value };
}

function airportSearchQuery(card: DestinationComparisonCard): string {
  const label = card.primaryAirportLabel?.trim();
  if (label) return label;
  return `main international airport near ${card.destinationName}`;
}

/**
 * Geocoding + Distance Matrix (driving), server-side only.
 * Use `GOOGLE_MAPS_API_KEY` (not NEXT_PUBLIC) with Geocoding API and
 * Distance Matrix API enabled on the key.
 */
export async function enrichCardWithAirportDrivingDistance(
  card: DestinationComparisonCard,
  apiKey: string
): Promise<DestinationComparisonCard> {
  try {
    const destCenter = await geocode(
      `${card.destinationName} city center`,
      apiKey
    );
    if (!destCenter) return card;

    const airportPoint = await geocode(airportSearchQuery(card), apiKey);
    if (!airportPoint) return card;

    const leg = await drivingMetersAndSeconds(airportPoint, destCenter, apiKey);
    if (!leg) return card;

    return {
      ...card,
      distanceFromPrimaryAirportKm: Math.round((leg.meters / 1000) * 10) / 10,
      distanceFromPrimaryAirportDriveMinutes:
        Math.round(leg.seconds / 60) || undefined,
      airportDistanceSource: "google_distance_matrix",
    };
  } catch (e) {
    console.error("Airport distance enrichment failed:", e);
    return card;
  }
}

export async function enrichAllCardsAirportDistances(
  cards: DestinationComparisonCard[],
  apiKey: string
): Promise<DestinationComparisonCard[]> {
  const out: DestinationComparisonCard[] = [];
  for (const card of cards) {
    if (out.length > 0) await new Promise((r) => setTimeout(r, 120));
    out.push(await enrichCardWithAirportDrivingDistance(card, apiKey));
  }
  return out;
}
