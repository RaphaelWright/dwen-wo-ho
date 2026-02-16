"use client";

import { useAnimationControls } from "framer-motion";
import { useState, useEffect } from "react";

export const useMarquee = ({
  direction = "left",
  speed = 20,
}: {
  direction?: "left" | "right";
  speed?: number;
}) => {
  const controls = useAnimationControls();
  const [isPaused, setIsPaused] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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

  const handleMouseEnter = () => setIsPaused(true);

  const handleMouseLeave = () => {
    setIsPaused(false);
    setHoveredIndex(null);
  };

  return {
    controls,
    isPaused,
    hoveredIndex,
    setHoveredIndex,
    handleMouseEnter,
    handleMouseLeave,
  };
};
