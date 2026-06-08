"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  useMotionValueEvent,
  useScroll,
  useTransform,
  motion,
} from "motion/react";
import { cn } from "@/lib/utils";

export const StickyScroll = ({
  content,
  contentClassName,
  colors = [
    "#0a0118", // almost black with purple tint
    "#1a0b2e", // very dark purple
    "#160b28", // deep midnight purple
  ],
  linearGradients = [
    "linear-gradient(to bottom right, #06b6d4, #10b981)",
    "linear-gradient(to bottom right, #ec4899, #6366f1)",
    "linear-gradient(to bottom right, #f97316, #eab308)",
  ],
  activeNodeColor = "#3b82f6",
  inactiveNodeColor = "#1e293b",
  activeBorderColor = "#60a5fa",
  inactiveBorderColor = "#334155",
  titleClassName = "text-slate-100",
  descriptionClassName = "text-slate-300",
  beamClassName = "bg-linear-to-b from-blue-500 via-purple-500 to-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]",
}: {
  content: {
    title: string;
    description: string;
    content?: React.ReactNode;
  }[];
  contentClassName?: string;
  colors?: string[];
  linearGradients?: string[];
  activeNodeColor?: string;
  inactiveNodeColor?: string;
  activeBorderColor?: string;
  inactiveBorderColor?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  beamClassName?: string;
}) => {
  const [activeCard, setActiveCard] = React.useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentContainerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [nodePositions, setNodePositions] = useState<number[]>([]);

  const { scrollYProgress } = useScroll({
    container: containerRef,
    offset: ["start start", "end end"],
  });

  // Calculate all node positions relative to the beam track's coordinate system
  useEffect(() => {
    const calculatePositions = () => {
      if (!contentContainerRef.current) return;

      const containerTop = contentContainerRef.current.offsetTop;

      const positions = itemRefs.current.map((ref) => {
        if (!ref) return 0;
        // Node center = content div position + half of node height (20px)
        // We need to add the container's offset to get the absolute position
        return containerTop + ref.offsetTop + 20;
      });
      setNodePositions(positions);
    };

    calculatePositions();
    setTimeout(calculatePositions, 100);
    window.addEventListener("resize", calculatePositions);
    return () => window.removeEventListener("resize", calculatePositions);
  }, [content]);

  // Smoothly animate beam height based on scroll progress
  const beamHeight = useTransform(
    scrollYProgress,
    [0, 1],
    nodePositions.length > 0
      ? [0, nodePositions[nodePositions.length - 1] - nodePositions[0]]
      : [0, 0],
  );

  // Detect active card based on where the beam actually is
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (nodePositions.length === 0) return;

    const firstNodePos = nodePositions[0];
    const lastNodePos = nodePositions[nodePositions.length - 1];
    const totalBeamHeight = lastNodePos - firstNodePos;

    // Calculate current beam tip position
    const currentBeamHeight = latest * totalBeamHeight;
    const currentBeamTipPosition = firstNodePos + currentBeamHeight;

    // Find which node the beam has reached or passed
    let newActiveCard = 0;
    for (let i = 0; i < nodePositions.length; i++) {
      if (currentBeamTipPosition >= nodePositions[i] - 5) {
        newActiveCard = i;
      }
    }

    setActiveCard(newActiveCard);
  });

  return (
    <motion.div
      animate={{
        backgroundColor: colors[activeCard % colors.length],
      }}
      transition={{ duration: 0.5 }}
      className="relative flex h-[60vh] md:h-150 justify-center overflow-y-auto rounded-xs p-6 md:px-10 md:py-14 scrollbar-hide"
      ref={containerRef}
    >
      <div className="relative flex w-full max-w-4xl items-start pt-10">
        {/* The beam track - now starts exactly at first node center */}
        {nodePositions.length > 0 && (
          <div
            style={{
              top: nodePositions[0] + "px",
              height:
                nodePositions[nodePositions.length - 1] -
                nodePositions[0] +
                "px",
            }}
            className="absolute left-4.75 hidden md:block w-0.5 bg-neutral-800"
          >
            {/* Smoothly growing beam tied directly to scroll progress */}
            <motion.div
              style={{
                height: beamHeight,
              }}
              className={cn("absolute inset-x-0 top-0 w-0.5", beamClassName)}
            />
          </div>
        )}

        <div
          className="relative flex-1 pl-4 md:pl-16"
          ref={contentContainerRef}
        >
          {content.map((item, index) => (
            <div
              key={item.title + index}
              className="relative pb-40 last:pb-20"
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
            >
              {/* Numbered node - positioned at top-0 of this div */}
              <div className="absolute -left-16 top-0 z-20 hidden md:flex h-10 w-10 items-center justify-center">
                <motion.div
                  animate={{
                    backgroundColor:
                      activeCard >= index ? activeNodeColor : inactiveNodeColor,
                    scale: activeCard === index ? 1.2 : 1,
                    boxShadow:
                      activeCard === index
                        ? "0 0 20px rgba(59,130,246,0.6)"
                        : activeCard > index
                          ? "0 0 10px rgba(59,130,246,0.3)"
                          : "none",
                    borderColor:
                      activeCard >= index
                        ? activeBorderColor
                        : inactiveBorderColor,
                  }}
                  transition={{
                    duration: 0.3,
                    ease: "easeOut",
                  }}
                  className="flex size-8 items-center justify-center rounded-full border-2 text-xs font-bold text-white"
                >
                  {index + 1}
                </motion.div>
              </div>

              <motion.h2
                animate={{
                  opacity: activeCard === index ? 1 : 0.3,
                  x: activeCard === index ? 0 : -10,
                }}
                transition={{ duration: 0.3 }}
                className={cn(
                  "text-xl md:text-2xl font-bold leading-8",
                  titleClassName,
                )}
              >
                {item.title}
              </motion.h2>
              <motion.p
                animate={{
                  opacity: activeCard === index ? 1 : 0.3,
                  x: activeCard === index ? 0 : -10,
                }}
                transition={{ duration: 0.3, delay: 0.05 }}
                className={cn(
                  "text-sm md:text-base mt-4 max-w-sm bg",
                  descriptionClassName,
                )}
              >
                {item.description}
              </motion.p>
              {/* Display visual content inline on mobile */}
              <motion.div
                animate={{
                  opacity: activeCard === index ? 1 : 0.3,
                  x: activeCard === index ? 0 : -10,
                }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="mt-6 block lg:hidden w-full overflow-hidden rounded-xl aspect-video md:aspect-square"
              >
                {item.content ?? null}
              </motion.div>
            </div>
          ))}
        </div>
      </div>

      <motion.div
        style={{
          background: linearGradients[activeCard % linearGradients.length],
        }}
        transition={{ duration: 0.5 }}
        className={cn(
          "sticky top-5 hidden lg:block overflow-hidden border rounded-2xl border-transparent shadow-2xl",
          contentClassName,
        )}
      >
        {content[activeCard].content ?? null}
      </motion.div>
    </motion.div>
  );
};
