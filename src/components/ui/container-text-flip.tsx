"use client";

import React, { useState, useEffect, useId } from "react";

import { m } from "motion/react";
import { cn } from "@/lib/utils";

export interface ContainerTextFlipProps {
  /** Array of words to cycle through in the animation */
  words?: string[];
  /** Time in milliseconds between word transitions */
  interval?: number;
  /** Additional CSS classes to apply to the container */
  className?: string;
  /** Additional CSS classes to apply to the text */
  textClassName?: string;
  /** Duration of the transition animation in milliseconds */
  animationDuration?: number;
}

export function ContainerTextFlip({
  words = ["better", "modern", "beautiful", "awesome"],
  interval = 3000,
  className,
  textClassName,
  animationDuration = 700,
}: ContainerTextFlipProps) {
  const id = useId();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [width, setWidth] = useState(100);
  const textRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial width measurement after mount
    requestAnimationFrame(() => {
      if (textRef.current) {
        const textWidth = textRef.current.scrollWidth + 30;
        setWidth(textWidth);
      }
    });

    const intervalId = setInterval(() => {
      setCurrentWordIndex((prevIndex) => {
        const next = (prevIndex + 1) % words.length;
        // Measure width after React paints the new word
        requestAnimationFrame(() => {
          if (textRef.current) {
            const textWidth = textRef.current.scrollWidth + 30;
            setWidth(textWidth);
          }
        });
        return next;
      });
    }, interval);

    return () => clearInterval(intervalId);
  }, [words, interval]);

  return (
    <m.div
      layout
      layoutId={`words-here-${id}`}
      style={{ width }} // Use style for width to allow framer-motion to animate it smoothly alongside layout
      className={cn(
        "relative inline-block rounded-lg pt-2 pb-3 text-center text-4xl font-bold transition-colors duration-300 md:text-7xl",
        "bg-primary/5",
        "shadow-sm",
        className,
      )}
    >
      <m.div
        key={currentWordIndex}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: animationDuration / 1000,
          ease: "easeInOut",
        }}
        className={cn("inline-block px-4 whitespace-nowrap", textClassName)} // Added padding directly here and whitespace-nowrap
        ref={textRef}
      >
        {words[currentWordIndex].split("").map((letter, index) => (
          <m.span
            key={`${currentWordIndex}-${index}-${letter}`}
            initial={{
              opacity: 0,
              filter: "blur(10px)",
            }}
            animate={{
              opacity: 1,
              filter: "blur(0px)",
            }}
            transition={{
              delay: index * 0.05, // Slightly increased delay for better ripple effect
              duration: 0.2,
            }}
            className="inline-block"
          >
            {letter === " " ? "\u00A0" : letter}
          </m.span>
        ))}
      </m.div>
    </m.div>
  );
}
