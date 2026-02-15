"use client";

import { PARTNER_SCHOOLS } from "@/lib/constants/mock-data";
import WidthConstraint from "../ui/width-constraint";
import { motion, useAnimationControls } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const MarqueeRow = ({
  items,
  direction = "left",
  speed = 20,
}: {
  items: typeof PARTNER_SCHOOLS;
  direction?: "left" | "right";
  speed?: number;
}) => {
  const controls = useAnimationControls();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) {
      controls.stop();
    } else {
      controls.start({
        x: direction === "left" ? "-50%" : "0%",
        transition: {
          repeat: Infinity,
          repeatType: "loop",
          duration: speed,
          ease: "linear",
        },
      });
    }
  }, [isPaused, controls, direction, speed]);

  // Initial animation start
  useEffect(() => {
    controls.start({
      x: direction === "left" ? "-50%" : "0%",
      transition: {
        repeat: Infinity,
        repeatType: "loop",
        duration: speed,
        ease: "linear",
      },
    });
  }, [controls, direction, speed]);

  return (
    <div
      className="flex overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        setIsPaused(false);
        setHoveredIndex(null);
      }}
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

const SocialProof = () => {
  // Use enough items to fill screen width for smooth loop
  const row1Items = [
    ...PARTNER_SCHOOLS.slice(0, 10),
    ...PARTNER_SCHOOLS.slice(0, 10),
  ];
  const row2Items = [...PARTNER_SCHOOLS.slice(4), ...PARTNER_SCHOOLS.slice(4)];

  return (
    <WidthConstraint>
      <div className="text-center mb-8">
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
          Trusted by students from top schools
        </p>
      </div>

      <div className="relative flex flex-col gap-8 overflow-hidden mask-gradient">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-linear-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-linear-to-l from-background to-transparent z-10 pointer-events-none" />

        <MarqueeRow items={row1Items} direction="left" speed={40} />
        <MarqueeRow items={row2Items} direction="right" speed={45} />
      </div>
    </WidthConstraint>
  );
};

export default SocialProof;
