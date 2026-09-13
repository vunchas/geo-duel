"use client";

import { useMemo } from "react";
import { geoEqualEarth, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { FeatureCollection, Geometry } from "geojson";
import type { GeometryCollection, Topology } from "topojson-specification";
import world from "world-atlas/countries-110m.json";
import { countryLocation } from "@/lib/geo";

const WIDTH = 960;
const HEIGHT = 500;

export function WorldMap({ isoA3 }: { isoA3?: string }) {
  const target = isoA3 ? countryLocation[isoA3] : undefined;

  const { ocean, others, highlighted } = useMemo(() => {
    const topology = world as Topology<{ countries: GeometryCollection }>;
    const collection = feature(
      topology,
      topology.objects.countries
    ) as unknown as FeatureCollection<Geometry>;
    const projection = geoEqualEarth()
      .rotate([-8, 0])
      .fitExtent(
        [
          [10, 16],
          [WIDTH - 10, HEIGHT - 8],
        ],
        { type: "Sphere" }
      );
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
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label="Pasaulio žemėlapis su pažymėta valstybe">
        <path className="world-ocean" d={ocean} />
        {others.map((country) => (
          <path key={country.id} className="world-country" d={country.d} />
        ))}
        {highlighted ? <path className="world-country is-target" d={highlighted} /> : null}
      </svg>
      <p className="map-caption">Pažymėta valstybė visame žemėlapyje — atpažink pagal vietą, ne pagal formą.</p>
    </div>
  );
}
