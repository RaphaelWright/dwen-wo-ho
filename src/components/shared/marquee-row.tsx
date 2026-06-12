"use client";

import { m } from "motion/react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useMarquee } from "@/hooks/components/use-marquee";
import { MarqueeRowProps } from "@/lib/types/shared-ui";

export const MarqueeRow = ({
  items,
  direction = "left",
  speed = 20,
}: MarqueeRowProps) => {
  const {
    controls,
    hoveredIndex,
    setHoveredIndex,
    handleMouseEnter,
    handleMouseLeave,
  } = useMarquee({ direction, speed });

  return (
    <div
      className="flex overflow-hidden select-none"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <m.div
        className="flex shrink-0 items-center gap-16"
        initial={{ x: direction === "left" ? "0%" : "-50%" }}
        animate={controls}
      >
        {items.concat(items).map((uni, idx) => (
          <div
            key={`${direction}-marquee-${idx}`}
            className={cn(
              "relative h-13.75 w-13.75 shrink-0 cursor-pointer transition-all duration-300 ease-out",
              hoveredIndex !== null &&
                hoveredIndex !== idx &&
                "scale-90 opacity-20 blur-md",
              hoveredIndex === idx && "scale-110 opacity-100",
            )}
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <Image
              src={uni.logo}
              alt={uni.name}
              fill
              quality={100}
              className="object-contain"
              sizes="55px"
            />
          </div>
        ))}
      </m.div>
    </div>
  );
};
