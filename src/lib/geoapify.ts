export interface GeoapifyLatLng {
  lat: number;
  lng: number;
}

export interface GeoapifyRouteStep {
  instruction: string;
  distanceKm: number;
  durationMins: number;
  street?: string;
}

export interface GeoapifyRouteResult {
  coordinates: GeoapifyLatLng[];
  distanceKm: number;
  durationMins: number;
  steps: GeoapifyRouteStep[];
}

export interface GeoapifyPlace {
  id: string;
  formatted: string;
  city?: string;
  state?: string;
  lat: number;
  lng: number;
}

export const GEOAPIFY_API_KEY =
  process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY ||
  process.env.NEXT_PUBLIC_MAP_API_KEY ||
  "03376e4c85c4441c90f672093dd58416";

export const GEOAPIFY_MAP_STYLES = {
  street: "osm-bright",
  dark: "dark-matter",
  minimal: "klokantech-basic",
  outdoors: "osm-liberty",
} as const;

export type GeoapifyStyleKey = keyof typeof GEOAPIFY_MAP_STYLES;

/**
 * Returns the raster tile URL pattern for Leaflet
 */
export function getGeoapifyTileUrl(
  style: GeoapifyStyleKey | string = "street",
  apiKey: string = GEOAPIFY_API_KEY
): string {
  const styleName =
    style in GEOAPIFY_MAP_STYLES
      ? GEOAPIFY_MAP_STYLES[style as GeoapifyStyleKey]
      : style;
  return `https://maps.geoapify.com/v1/tile/${styleName}/{z}/{x}/{y}.png?apiKey=${apiKey}`;
}

/**
 * Returns a static map image URL for quick rendering previews
 */
export function getGeoapifyStaticMapUrl({
  lat,
  lng,
  zoom = 14,
  width = 600,
  height = 360,
  markerColor = "173f2d",
  style = "osm-bright",
  apiKey = GEOAPIFY_API_KEY,
}: {
  lat: number;
  lng: number;
  zoom?: number;
  width?: number;
  height?: number;
  markerColor?: string;
  style?: string;
  apiKey?: string;
}): string {
  const marker = `lonlat:${lng},${lat};type:material;color:%23${markerColor};size:medium;icon:car;icontype:awesome`;
  return `https://maps.geoapify.com/v1/staticmap?style=${style}&width=${width}&height=${height}&center=lonlat:${lng},${lat}&zoom=${zoom}&marker=${marker}&apiKey=${apiKey}`;
}

/**
 * Fetches real highway/road routing between two coordinates via Geoapify Routing API
 */
export async function fetchGeoapifyRoute(
  origin: GeoapifyLatLng,
  dest: GeoapifyLatLng,
  apiKey: string = GEOAPIFY_API_KEY
): Promise<GeoapifyRouteResult | null> {
  if (!apiKey) return null;

  try {
    const url = `https://api.geoapify.com/v1/routing?waypoints=${origin.lat},${origin.lng}|${dest.lat},${dest.lng}&mode=drive&apiKey=${apiKey}`;
    const res = await fetch(url);
    if (!res.ok) {
      console.warn("Geoapify Routing API request failed:", res.status, res.statusText);
      return null;
    }

    const data = await res.json();
    const feature = data.features?.[0];
    if (!feature) return null;

    // Extract geometry coordinates (GeoJSON is [lon, lat])
    const rawCoords: [number, number][] =
      feature.geometry.type === "MultiLineString"
        ? feature.geometry.coordinates[0] || []
        : feature.geometry.coordinates || [];

    const coordinates: GeoapifyLatLng[] = rawCoords.map((c) => ({
      lat: c[1],
      lng: c[0],
    }));

    const distanceMeters: number = feature.properties?.distance || 0;
    const timeSeconds: number = feature.properties?.time || 0;

    const steps: GeoapifyRouteStep[] = [];
    const legs = feature.properties?.legs || [];
    for (const leg of legs) {
      for (const step of leg.steps || []) {
        steps.push({
          instruction: step.instruction?.text || "Proceed on route",
          distanceKm: Number(((step.distance || 0) / 1000).toFixed(2)),
          durationMins: Math.max(1, Math.round((step.time || 0) / 60)),
          street: step.instruction?.street_name,
        });
      }
    }

    return {
      coordinates,
      distanceKm: Number((distanceMeters / 1000).toFixed(1)),
      durationMins: Math.max(1, Math.round(timeSeconds / 60)),
      steps,
    };
  } catch (err) {
    console.error("Error fetching Geoapify route:", err);
    return null;
  }
}

/**
 * Searches places/addresses using Geoapify Geocoding API
 */
export async function searchGeoapifyPlaces(
  query: string,
  apiKey: string = GEOAPIFY_API_KEY
): Promise<GeoapifyPlace[]> {
  if (!query || query.trim().length < 2 || !apiKey) return [];

  try {
    const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
      query
    )}&filter=countrycode:in&apiKey=${apiKey}`;
    const res = await fetch(url);
    if (!res.ok) return [];

    const data = await res.json();
    return (data.features || []).map((f: {
      properties: {
        place_id?: string;
        formatted?: string;
        city?: string;
        state?: string;
        lon?: number;
        lat?: number;
      };
      geometry: { coordinates: [number, number] };
    }) => ({
      id: f.properties.place_id || `${f.properties.lat}-${f.properties.lon}`,
      formatted: f.properties.formatted || "",
      city: f.properties.city,
      state: f.properties.state,
      lat: f.geometry?.coordinates?.[1] ?? f.properties.lat ?? 0,
      lng: f.geometry?.coordinates?.[0] ?? f.properties.lon ?? 0,
    }));
  } catch (err) {
    console.error("Error searching Geoapify places:", err);
    return [];
  }
}
