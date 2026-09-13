import { geoArea, geoBounds, geoCentroid } from "d3-geo";
import type { Feature, Geometry, MultiPolygon, Polygon } from "geojson";

export function boxAround(lng: number, lat: number, spanLng: number, spanLat: number): Feature<Polygon> {
  const west = lng - spanLng / 2;
  const east = lng + spanLng / 2;
  const south = Math.max(-82, lat - spanLat / 2);
  const north = Math.min(84, lat + spanLat / 2);
  // d3-geo treats clockwise rings as the small enclosed area; counter-clockwise
  // would mean "everything outside the box" and fitExtent would show the whole world.
  return {
    type: "Feature",
    properties: {},
    geometry: {
      type: "Polygon",
      coordinates: [[[west, south], [west, north], [east, north], [east, south], [west, south]]],
    },
  };
}

/**
 * Mainland plus nearby islands only. Overseas territories (French Guiana, the
 * Canaries, Galápagos…) would otherwise drag the centroid into the ocean.
 */
export function coreOf(country: Feature<Geometry>): Feature<Geometry> {
  if (country.geometry.type !== "MultiPolygon") return country;
  const parts = (country.geometry as MultiPolygon).coordinates.map((coordinates) => {
    const poly: Polygon = { type: "Polygon", coordinates };
    return { poly, area: geoArea(poly), center: geoCentroid(poly) };
  });
  const main = parts.reduce((a, b) => (b.area > a.area ? b : a));
  const near = parts.filter((p) => {
    const dLng = Math.abs(((p.center[0] - main.center[0] + 540) % 360) - 180);
    return dLng <= 18 && Math.abs(p.center[1] - main.center[1]) <= 14;
  });
  return {
    type: "Feature",
    properties: {},
    geometry: { type: "MultiPolygon", coordinates: near.map((p) => p.poly.coordinates) },
  };
}

export function regionToFit(country: Feature<Geometry> | undefined, fallback?: { lat: number; lng: number }) {
  if (country) {
    const core = coreOf(country);
    const [[minLng, minLat], [maxLng, maxLat]] = geoBounds(core);
    const [cLng, cLat] = geoCentroid(core);
    // Crosses the antimeridian (Russia): geoBounds reports maxLng < minLng.
    if (maxLng < minLng || maxLng - minLng > 180) return boxAround(cLng, cLat, 110, 55);
    const w = maxLng - minLng;
    const h = maxLat - minLat;
    // Micro-states get a tight window (they'd vanish otherwise), other small
    // states a fixed regional window, large ones a window around their extent.
    const tiny = w < 1.5 && h < 1.5;
    const spanLng = tiny ? 9 : Math.min(Math.max(w * 3, 22), 84);
    const spanLat = tiny ? 6 : Math.min(Math.max(h * 3, 15), 52);
    return boxAround((minLng + maxLng) / 2, (minLat + maxLat) / 2, spanLng, spanLat);
  }
  if (fallback) return boxAround(fallback.lng, fallback.lat, 22, 15);
  return { type: "Sphere" as const };
}
