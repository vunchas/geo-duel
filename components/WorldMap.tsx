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

  const { ocean, others, highlighted, pin } = useMemo(() => {
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
    const pinXY = target ? projection([target.lng, target.lat]) : null;
    return {
      ocean,
      others,
      highlighted,
      pin: pinXY && Number.isFinite(pinXY[0]) && Number.isFinite(pinXY[1]) ? pinXY : null,
    };
  }, [target]);

  return (
    <div className="world-map-wrap">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label="Pasaulio žemėlapis su pažymėta valstybe">
        <path className="world-ocean" d={ocean} />
        {others.map((country) => (
          <path key={country.id} className="world-country" d={country.d} />
        ))}
        {highlighted ? <path className="world-country is-target" d={highlighted} /> : null}
        {pin ? (
          <g className="world-pin" transform={`translate(${pin[0]}, ${pin[1]})`}>
            <circle className="world-pin-halo" r="16" />
            <circle r="6.5" />
          </g>
        ) : null}
      </svg>
      <p className="map-caption">Pažymėta valstybė visame žemėlapyje — atpažink pagal vietą, ne pagal formą.</p>
    </div>
  );
}
