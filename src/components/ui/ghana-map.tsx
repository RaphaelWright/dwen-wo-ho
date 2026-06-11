"use client";

import { m } from "motion/react";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import * as d3 from "d3-geo";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import ghanaGeoUrl from "@/data/ghana-regions.json";

interface GhanaRegionProperties {
  region: string;
  capital?: string;
}

type GhanaFeature = Feature<Geometry, GhanaRegionProperties>;

interface GhanaGeoJson extends FeatureCollection {
  features: GhanaFeature[];
}

interface GhanaRegion extends GhanaFeature {
  id: string;
  name: string;
  capital?: string;
  path: string | null;
  centroid: { x: number; y: number };
  className: string;
}

interface ConnectingLine {
  id: string;
  start: { x: number; y: number };
  end: { x: number; y: number };
}

const ghanaGeo = ghanaGeoUrl as GhanaGeoJson;

// Map colors suitable for dark/light mode
const REGION_COLORS = [
  "fill-emerald-500",
  "fill-amber-500",
  "fill-orange-500",
  "fill-yellow-500",
  "fill-blue-500",
  "fill-indigo-500",
  "fill-violet-500",
  "fill-teal-500",
  "fill-pink-500",
  "fill-rose-500",
  "fill-red-500",
  "fill-cyan-500",
  "fill-teal-500",
  "fill-lime-500",
  "fill-green-500",
  "fill-sky-500",
];

export default function GhanaMap({ className }: { className?: string }) {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  // Projection setup
  const projection = useMemo(() => {
    const collection: FeatureCollection = {
      type: "FeatureCollection",
      features: ghanaGeo.features,
    };

    // Use geoIdentity for planar projection to avoid spherical winding issues
    // reflectY(true) is needed because SVG Y-axis is top-down, while Latitude is bottom-up
    return d3
      .geoIdentity()
      .reflectY(true)
      .fitSize([500, 600], collection);
  }, []);

  const pathGenerator = useMemo(() => {
    return d3.geoPath().projection(projection);
  }, [projection]);

  // Extract features and calculate centroids
  const regions = useMemo((): GhanaRegion[] => {
    return ghanaGeo.features.map((feature, idx) => {
      const centroid = pathGenerator.centroid(feature);
      return {
        ...feature,
        id: feature.properties.region || `region-${idx}`,
        name: feature.properties.region,
        capital: feature.properties.capital,
        path: pathGenerator(feature),
        centroid: { x: centroid[0], y: centroid[1] },
        className: REGION_COLORS[idx % REGION_COLORS.length],
      };
    });
  }, [pathGenerator]);

  // Create connecting lines (looping through regions)
  const connectingLines = useMemo((): ConnectingLine[] => {
    return regions.map((region, idx) => {
      const nextRegion = regions[(idx + 1) % regions.length];
      return {
        id: `line-${region.id}-${nextRegion.id}`,
        start: region.centroid,
        end: nextRegion.centroid,
      };
    });
  }, [regions]);

  return (
    <div
      className={cn("relative w-full aspect-3/4 max-w-lg mx-auto", className)}
    >
      <svg
        viewBox="0 0 500 600"
        className="w-full h-full drop-shadow-xl"
        style={{ filter: "drop-shadow(0px 10px 20px rgba(0,0,0,0.15))" }}
      >
        {/* Regions Layer */}
        {regions.map((region) => (
          <m.path
            key={region.id}
            d={region.path ?? undefined}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{
              opacity: hoveredRegion === region.id ? 0.9 : 0.8,
              scale: hoveredRegion === region.id ? 1.02 : 1,
            }}
            transition={{ duration: 0.3 }}
            className={cn(
              "stroke-white stroke-[1px] cursor-pointer transition-colors duration-200",
              region.className,
            )}
            onMouseEnter={() => setHoveredRegion(region.id)}
            onMouseLeave={() => setHoveredRegion(null)}
          />
        ))}

        {/* Connecting Lines Layer */}
        <g className="pointer-events-none">
          {connectingLines.map((line, idx) => {
            const midX = (line.start.x + line.end.x) / 2;
            const midY = Math.min(line.start.y, line.end.y) - 40; // Curve upwards
            const path = `M ${line.start.x} ${line.start.y} Q ${midX} ${midY} ${line.end.x} ${line.end.y}`;

            return (
              <m.path
                key={line.id}
                d={path}
                fill="none"
                stroke="url(#gradient-line)"
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                  duration: 1.5,
                  delay: idx * 0.1,
                  repeat: Infinity,
                  repeatType: "reverse",
                  repeatDelay: 1,
                }}
              />
            );
          })}
        </g>

        {/* Gradient Definition for Lines */}
        <defs>
          <linearGradient id="gradient-line" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
            <stop offset="50%" stopColor="rgba(255,255,255,1)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>

        {/* Labels Layer (Regional Capitals) */}
        {regions.map((region) => {
          if (!region.capital) return null;

          return (
            <m.g
              key={`label-group-${region.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="pointer-events-none"
            >
              {/* Capital Dot */}
              <circle
                cx={region.centroid.x}
                cy={region.centroid.y}
                r="2"
                fill="white"
              />

              {/* Label Text - Show Region Name on Hover, Capital otherwise */}
              <text
                x={region.centroid.x}
                y={region.centroid.y + 12}
                textAnchor="middle"
                className="fill-white text-[10px] font-bold drop-shadow-md"
                style={{ textShadow: "0px 1px 2px rgba(0,0,0,0.8)" }}
              >
                {hoveredRegion === region.id
                  ? region.name.toUpperCase()
                  : region.capital}
              </text>
            </m.g>
          );
        })}
      </svg>
    </div>
  );
}
