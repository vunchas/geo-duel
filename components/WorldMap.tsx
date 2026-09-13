"use client";

import { useMemo } from "react";
import { geoCentroid, geoEqualEarth, geoPath } from "d3-geo";
import { feature, neighbors } from "topojson-client";
import type { FeatureCollection, Geometry } from "geojson";
import type { GeometryCollection, Topology } from "topojson-specification";
import world from "world-atlas/countries-50m.json";
import { countryLocation } from "@/lib/geo";
import { coreOf, regionToFit } from "@/lib/mapFit";

const WIDTH = 900;
const HEIGHT = 680;

const topology = world as Topology<{ countries: GeometryCollection }>;
const collection = feature(topology, topology.objects.countries) as unknown as FeatureCollection<Geometry>;
const numericToIso3 = new Map(Object.entries(countryLocation).map(([iso3, v]) => [v.numeric, iso3]));

/** world-atlas leaves some ids empty (disputed territories); match those by name. */
const NAME_FALLBACK: Record<string, string> = { XKX: "Kosovo" };

const featureIndexByIso3 = new Map<string, number>();
collection.features.forEach((f, index) => {
  const iso3 = numericToIso3.get(Number(f.id));
  if (iso3) featureIndexByIso3.set(iso3, index);
});
for (const [iso3, name] of Object.entries(NAME_FALLBACK)) {
  const index = collection.features.findIndex((f) => (f.properties as { name?: string } | null)?.name === name);
  if (index >= 0) featureIndexByIso3.set(iso3, index);
}
const iso3ByFeatureIndex = new Map([...featureIndexByIso3].map(([iso3, index]) => [index, iso3]));

let adjacency: number[][] | null = null;

/** ISO3 codes of bordering countries that exist in the study list. */
export function neighborIso3(isoA3: string): string[] {
  const index = featureIndexByIso3.get(isoA3);
  if (index === undefined) return [];
  adjacency ??= neighbors(topology.objects.countries.geometries);
  return adjacency[index].map((i) => iso3ByFeatureIndex.get(i)).filter((v): v is string => Boolean(v));
}

export function WorldMap({ isoA3, highlightNeighbors = false }: { isoA3?: string; highlightNeighbors?: boolean }) {
  const target = isoA3 ? countryLocation[isoA3] : undefined;

  const { ocean, others, highlighted, near, marker } = useMemo(() => {
    const targetIndex = isoA3 ? featureIndexByIso3.get(isoA3) : undefined;
    const country = targetIndex === undefined ? undefined : collection.features[targetIndex];
    const focus = country ? geoCentroid(coreOf(country)) : target ? [target.lng, target.lat] : [8, 0];
    const projection = geoEqualEarth()
      .rotate([-focus[0], 0])
      .fitExtent([[10, 10], [WIDTH - 10, HEIGHT - 10]], regionToFit(country, target))
      .clipExtent([[0, 0], [WIDTH, HEIGHT]]);
    const pathGen = geoPath(projection);
    const nearSet = new Set(highlightNeighbors && isoA3 ? neighborIso3(isoA3).map((c) => featureIndexByIso3.get(c)) : []);
    const others: { id: string; d: string }[] = [];
    const near: { id: string; d: string }[] = [];
    let highlighted: string | undefined;
    collection.features.forEach((item, index) => {
      const d = pathGen(item);
      if (!d) return;
      const key = `${index}-${item.id ?? "x"}`;
      if (index === targetIndex) highlighted = d;
      else if (nearSet.has(index)) near.push({ id: key, d });
      else others.push({ id: key, d });
    });
    // Micro-states are a few pixels wide even when zoomed in; ring them so they can be found.
    let marker: { x: number; y: number } | undefined;
    if (country) {
      const [[x0, y0], [x1, y1]] = pathGen.bounds(coreOf(country));
      if (Math.max(x1 - x0, y1 - y0) < 40) marker = { x: (x0 + x1) / 2, y: (y0 + y1) / 2 };
    }
    return { ocean: pathGen({ type: "Sphere" }) ?? "", others, highlighted, near, marker };
  }, [target, isoA3, highlightNeighbors]);

  return (
    <div className="map-frame">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label="Žemėlapis su pažymėta valstybe">
        <path className="map-ocean" d={ocean} />
        {others.map((c) => <path key={c.id} className="map-land" d={c.d} />)}
        {near.map((c) => <path key={c.id} className="map-land is-near" d={c.d} />)}
        {highlighted ? <path className="map-land is-target" d={highlighted} /> : null}
        {marker ? <circle className="map-ring" cx={marker.x} cy={marker.y} r={44} /> : null}
      </svg>
    </div>
  );
}