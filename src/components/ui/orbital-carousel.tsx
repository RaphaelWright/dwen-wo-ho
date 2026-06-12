"use client";

import React from "react";
import { m } from "motion/react";
import { cn } from "@/lib/utils";

export interface OrbitalItem {
  id: string | number;
  content: React.ReactNode;
}

export interface OrbitalCarouselProps {
  items: OrbitalItem[];
  orbitRadius?: number;
  itemSize?: number;
  duration?: number;
  className?: string;
  itemClassName?: string;
  showOrbitPath?: boolean;
}

// Calculate cardinal positions for items
const getCardinalOffset = (index: number, total: number) =>
  (index * 360) / total;

export default function OrbitalCarousel({
  items,
  orbitRadius = 200,
  itemSize = 130, // Default to size-30 (120px)
  duration = 20,
  className,
  itemClassName,
  showOrbitPath = true,
}: OrbitalCarouselProps) {
  return (
    <div
      className={cn(
        "relative flex h-full w-full items-center justify-center",
        className,
      )}
    >
      {/* Orbit path visualization */}
      {showOrbitPath && (
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full border-3 border-purple-500/30"
          style={{
            width: `${orbitRadius * 2}px`,
            height: `${orbitRadius * 2}px`,
            boxShadow:
              "0 0 30px rgba(102, 126, 234, 0.2), inset 0 0 30px rgba(102, 126, 234, 0.1)",
          }}
        />
      )}

      {/* Orbiting items */}
      {items.map((item, index) => (
        <OrbitingItem
          key={item.id}
          content={item.content}
          orbitRadius={orbitRadius}
          itemSize={itemSize}
          offsetAngle={getCardinalOffset(index, items.length)}
          duration={duration}
          className={itemClassName}
        />
      ))}
    </div>
  );
}

interface OrbitingItemProps {
  content: React.ReactNode;
  orbitRadius: number;
  itemSize: number;
  offsetAngle: number;
  duration: number;
  className?: string;
}

function OrbitingItem({
  content,
  orbitRadius,
  itemSize,
  offsetAngle,
  duration,
  className,
}: OrbitingItemProps) {
  // Generate keyframes for smooth circular motion
  const steps = 60;
  const xKeyframes = [];
  const yKeyframes = [];
  const offset = itemSize / 2;

  for (let i = 0; i <= steps; i++) {
    const angle = offsetAngle + (360 * i) / steps;
    const radians = (angle * Math.PI) / 180;
    xKeyframes.push(orbitRadius * Math.cos(radians) - offset);
    yKeyframes.push(orbitRadius * Math.sin(radians) - offset);
  }

  return (
    <m.div
      className="absolute top-1/2 left-1/2"
      style={{
        width: itemSize,
        height: itemSize,
      }}
      initial={{
        x: xKeyframes[0],
        y: yKeyframes[0],
        scale: 0.5,
        opacity: 0,
      }}
      animate={{
        x: xKeyframes,
        y: yKeyframes,
        scale: 1,
        opacity: 1,
      }}
      transition={{
        x: {
          duration: duration,
          repeat: Infinity,
          ease: "linear",
        },
        y: {
          duration: duration,
          repeat: Infinity,
          ease: "linear",
        },
        scale: {
          duration: 0.8,
          delay: (offsetAngle / 360) * 0.5,
        },
        opacity: {
          duration: 0.8,
          delay: (offsetAngle / 360) * 0.5,
        },
      }}
      whileHover={{
        scale: 1.2,
      }}
    >
      <div
        className={cn(
          "flex h-full w-full cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 text-4xl shadow-xl backdrop-blur-md",
          className,
        )}
      >
        {content}
      </div>
    </m.div>
  );
}
