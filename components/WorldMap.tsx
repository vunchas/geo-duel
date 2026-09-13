"use client";

import { useMemo } from "react";
import { geoBounds, geoCentroid, geoEqualEarth, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Feature, FeatureCollection, Geometry, Polygon } from "geojson";
import type { GeometryCollection, Topology } from "topojson-specification";
import world from "world-atlas/countries-50m.json";
import { countryLocation } from "@/lib/geo";

const WIDTH = 960;
const HEIGHT = 500;

function boxAround(lng: number, lat: number, spanLng: number, spanLat: number): Feature<Polygon> {
  const west = lng - spanLng / 2;
  const east = lng + spanLng / 2;
  const south = Math.max(-80, lat - spanLat / 2);
  const north = Math.min(80, lat + spanLat / 2);
  return {
    type: "Feature",
    properties: {},
    geometry: {
      type: "Polygon",
      coordinates: [[
        [west, south],
        [east, south],
        [east, north],
        [west, north],
        [west, south],
      ]],
    },
  };
}

function regionToFit(
  country: Feature<Geometry> | undefined,
  fallback?: { lat: number; lng: number }
) {
  if (country) {
    const [[minLng, minLat], [maxLng, maxLat]] = geoBounds(country);
    if (maxLng - minLng > 180) {
      const [lng, lat] = geoCentroid(country);
      return boxAround(lng, lat, 38, 24);
    }
    const cx = (minLng + maxLng) / 2;
    const cy = (minLat + maxLat) / 2;
    return boxAround(
      cx,
      cy,
      Math.min(Math.max((maxLng - minLng) * 3.6, 28), 78),
      Math.min(Math.max((maxLat - minLat) * 3.6, 18), 48)
    );
  }
  if (fallback) return boxAround(fallback.lng, fallback.lat, 28, 18);
  return { type: "Sphere" as const };
}

export function WorldMap({ isoA3 }: { isoA3?: string }) {
  const target = isoA3 ? countryLocation[isoA3] : undefined;

  const { ocean, others, highlighted } = useMemo(() => {
    const topology = world as Topology<{ countries: GeometryCollection }>;
    const collection = feature(
      topology,
      topology.objects.countries
    ) as unknown as FeatureCollection<Geometry>;
    const country = target
      ? collection.features.find((item) => Number(item.id) === target.numeric)
      : undefined;
    const focus = country ? geoCentroid(country) : target ? [target.lng, target.lat] : [8, 0];
    const projection = geoEqualEarth()
      .rotate([-focus[0], -focus[1] * 0.2])
      .fitExtent(
        [
          [18, 18],
          [WIDTH - 18, HEIGHT - 18],
        ],
        regionToFit(country, target)
      )
      .clipExtent([
        [0, 0],
        [WIDTH, HEIGHT],
      ]);
    const pathGen = geoPath(projection);
    const ocean = pathGen({ type: "Sphere" }) ?? "";
    const others: { id: string; d: string }[] = [];
    let highlighted: string | undefined;
    for (const item of collection.features) {
      const d = pathGen(item);
      if (!d) continue;
      if (target && Number(item.id) === target.numeric) highlighted = d;
      else others.push({ id: String(item.id), d });
    }
    return { ocean, others, highlighted };
  }, [target]);

  return (
    <div className="world-map-wrap">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label="Žemėlapis su pažymėta valstybe ir kaimynėmis">
        <path className="world-ocean" d={ocean} />
        {others.map((country) => (
          <path key={country.id} className="world-country" d={country.d} />
        ))}
        {highlighted ? <path className="world-country is-target" d={highlighted} /> : null}
      </svg>
      <p className="map-caption">Pažymėta valstybė ir jos kaimynės — atpažink pagal vietą.</p>
    </div>
  );
}
