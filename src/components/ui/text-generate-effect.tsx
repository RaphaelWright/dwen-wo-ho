"use client";
import { useEffect } from "react";
import { m, stagger, useAnimate } from "motion/react";
import { cn } from "@/lib/utils";

export const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration = 0.5,
}: {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
}) => {
  const [scope, animate] = useAnimate();
  const wordsArray = words.split(" ");
  useEffect(() => {
    animate(
      "span",
      {
        opacity: 1,
        filter: filter ? "blur(0px)" : "none",
      },
      {
        duration: duration ? duration : 1,
        delay: stagger(0.05),
      },
    );
  }, [animate, duration, filter, words]);

  return (
    <div className={cn(className)}>
      <m.div ref={scope}>
        {wordsArray.map((word, idx) => {
          return (
            <m.span
              key={word + idx}
              className="opacity-0"
              style={{
                filter: filter ? "blur(10px)" : "none",
              }}
            >
              {word}{" "}
            </m.span>
          );
        })}
      </m.div>
    </div>
  );
};
