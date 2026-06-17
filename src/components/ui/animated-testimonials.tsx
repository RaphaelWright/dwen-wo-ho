"use client";

import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { m, AnimatePresence } from "motion/react";

import { hashStringToRange } from "@/lib/utils/shared/hash";
import { useCallback, useEffect, useMemo, useState } from "react";

type Testimonial = {
  quote: string;
  name: string;
  designation: string;
  src: string;
};
export const AnimatedTestimonials = ({
  testimonials,
  autoplay = false,
}: {
  testimonials: Testimonial[];
  autoplay?: boolean;
}) => {
  const [active, setActive] = useState(0);

  const handleNext = useCallback(() => {
    setActive((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const isActive = (index: number) => {
    return index === active;
  };

  useEffect(() => {
    if (autoplay) {
      const interval = setInterval(handleNext, 5000);
      return () => clearInterval(interval);
    }
  }, [autoplay, handleNext]);

  // Deterministic per-src tilt — Math.random() mismatches SSR hydration.
  const cardRotations = useMemo(
    () => testimonials.map((t) => hashStringToRange(t.src, -10, 10)),
    [testimonials],
  );
  return (
    <div className="mx-auto max-w-sm px-4 py-12 font-sans antialiased md:max-w-4xl md:px-8 md:py-20 lg:px-12">
      <div className="relative grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-20">
        <div>
          <div className="relative h-64 w-full sm:h-72 md:h-80">
            <AnimatePresence>
              {testimonials.map((testimonial, index) => (
                <m.div
                  key={testimonial.src}
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                    z: -100,
                    rotate: cardRotations[index] || 0,
                  }}
                  animate={{
                    opacity: isActive(index) ? 1 : 0.7,
                    scale: isActive(index) ? 1 : 0.95,
                    z: isActive(index) ? 0 : -100,
                    rotate: isActive(index) ? 0 : cardRotations[index] || 0,
                    zIndex: isActive(index)
                      ? 40
                      : testimonials.length + 2 - index,
                    y: isActive(index) ? [0, -80, 0] : 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    z: 100,
                    rotate: cardRotations[index] || 0,
                  }}
                  transition={{
                    duration: 0.4,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 origin-bottom"
                >
                  {/* Dynamic testimonial URLs — next/image impractical */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={testimonial.src}
                    alt={testimonial.name}
                    width={500}
                    height={500}
                    draggable={false}
                    className="h-full w-full rounded-3xl object-cover object-center"
                  />
                </m.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
        <div className="flex flex-col justify-between py-4">
          <m.div
            key={active}
            initial={{
              y: 20,
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            exit={{
              y: -20,
              opacity: 0,
            }}
            transition={{
              duration: 0.2,
              ease: "easeInOut",
            }}
          >
            <h3 className="text-foreground text-2xl font-bold">
              {testimonials[active].name}
            </h3>
            <p className="text-muted-foreground text-sm">
              {testimonials[active].designation}
            </p>
            <m.p className="text-muted-foreground mt-8 text-lg">
              {testimonials[active].quote.split(" ").map((word, index) => (
                <m.span
                  key={`${active}-${index}-${word}`}
                  initial={{
                    filter: "blur(10px)",
                    opacity: 0,
                    y: 5,
                  }}
                  animate={{
                    filter: "blur(0px)",
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.2,
                    ease: "easeInOut",
                    delay: 0.02 * index,
                  }}
                  className="inline-block"
                >
                  {word}&nbsp;
                </m.span>
              ))}
            </m.p>
          </m.div>
          <div className="flex gap-4 pt-12 md:pt-0">
            <button
              type="button"
              onClick={handlePrev}
              className="group/button bg-secondary flex h-7 w-7 items-center justify-center rounded-full"
            >
              <IconArrowLeft className="text-foreground h-5 w-5 transition-transform duration-300 group-hover/button:rotate-12" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="group/button bg-secondary flex h-7 w-7 items-center justify-center rounded-full"
            >
              <IconArrowRight className="text-foreground h-5 w-5 transition-transform duration-300 group-hover/button:-rotate-12" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
