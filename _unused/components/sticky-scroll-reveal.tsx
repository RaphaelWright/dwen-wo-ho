"use client";
import React, { useEffect, useRef, useState } from "react";
import { useMotionValueEvent, useScroll, useTransform, m } from "motion/react";
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

  // Measure node positions from layout (not from the `content` prop directly)
  // so this stays a DOM-measurement effect rather than prop-synced state. A
  // ResizeObserver re-measures whenever the rendered content changes size.
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
    const timeoutId = setTimeout(calculatePositions, 100);
    window.addEventListener("resize", calculatePositions);

    const container = contentContainerRef.current;
    const resizeObserver = new ResizeObserver(calculatePositions);
    if (container) resizeObserver.observe(container);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", calculatePositions);
      resizeObserver.disconnect();
    };
  }, []);

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
    <m.div
      animate={{
        backgroundColor: colors[activeCard % colors.length],
      }}
      transition={{ duration: 0.5 }}
      className="scrollbar-hide relative flex h-[60vh] justify-center overflow-y-auto rounded-xs p-6 md:h-150 md:px-10 md:py-14"
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
            className="absolute left-4.75 hidden w-0.5 bg-neutral-800 md:block"
          >
            {/* Smoothly growing beam tied directly to scroll progress */}
            <m.div
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
              <div className="absolute top-0 -left-16 z-20 hidden h-10 w-10 items-center justify-center md:flex">
                <m.div
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
                </m.div>
              </div>

              <m.h2
                animate={{
                  opacity: activeCard === index ? 1 : 0.3,
                  x: activeCard === index ? 0 : -10,
                }}
                transition={{ duration: 0.3 }}
                className={cn(
                  "text-xl leading-8 font-bold md:text-2xl",
                  titleClassName,
                )}
              >
                {item.title}
              </m.h2>
              <m.p
                animate={{
                  opacity: activeCard === index ? 1 : 0.3,
                  x: activeCard === index ? 0 : -10,
                }}
                transition={{ duration: 0.3, delay: 0.05 }}
                className={cn(
                  "bg mt-4 max-w-sm text-sm md:text-base",
                  descriptionClassName,
                )}
              >
                {item.description}
              </m.p>
              {/* Display visual content inline on mobile */}
              <m.div
                animate={{
                  opacity: activeCard === index ? 1 : 0.3,
                  x: activeCard === index ? 0 : -10,
                }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="mt-6 block aspect-video w-full overflow-hidden rounded-xl md:aspect-square lg:hidden"
              >
                {item.content ?? null}
              </m.div>
            </div>
          ))}
        </div>
      </div>

      <m.div
        style={{
          background: linearGradients[activeCard % linearGradients.length],
        }}
        transition={{ duration: 0.5 }}
        className={cn(
          "sticky top-5 hidden overflow-hidden rounded-2xl border border-transparent shadow-2xl lg:block",
          contentClassName,
        )}
      >
        {content[activeCard].content ?? null}
      </m.div>
    </m.div>
  );
};
