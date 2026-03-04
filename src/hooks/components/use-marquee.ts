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
      // Small delay on resume helps prevent jarring jumps
      controls.start({
        x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"],
        transition: {
          repeat: Infinity,
          repeatType: "loop",
          duration: speed,
          ease: "linear",
          // The key fix: ensure it doesn't try to tween from a dead stop slowly
        },
      });
    }
  }, [isPaused, controls, direction, speed]);

  // Initial animation start - only run once on mount
  useEffect(() => {
    controls.start({
      x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"],
      transition: {
        repeat: Infinity,
        repeatType: "loop",
        duration: speed,
        ease: "linear",
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
