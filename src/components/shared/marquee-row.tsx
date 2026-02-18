"use client";

import { motion } from "motion/react";
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
      <motion.div
        className="flex gap-16 items-center shrink-0"
        initial={{ x: direction === "left" ? "0%" : "-50%" }}
        animate={controls}
      >
        {items.concat(items).map((uni, idx) => (
          <div
            key={`${direction}-${idx}`}
            className={cn(
              "cursor-pointer shrink-0 transition-all duration-300 ease-out",
              hoveredIndex !== null &&
                hoveredIndex !== idx &&
                "blur-md scale-90 opacity-20",
              hoveredIndex === idx && "scale-110 opacity-100",
            )}
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <Image
              src={uni.logo}
              alt={uni.name}
              width={55}
              height={55}
              quality={100}
              className="object-contain"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
};
