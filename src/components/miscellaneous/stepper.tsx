"use client";

import { useEffect, useRef } from "react";
import { Check } from "lucide-react";
import { useStepper } from "@/hooks/components/miscellaneous/use-stepper";
import { IStepperProps } from "@/lib/types/components/ui/stepper";
import { cn } from "@/lib/utils";

const Stepper = <T extends string[]>({
  steps,
  step,
  completedSteps,
  className,
}: IStepperProps<T>) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);
  const { isStatusActive, isStatusCompleted } = useStepper(
    steps,
    step,
    completedSteps,
  );

  const activeIndex = steps.findIndex(
    (currStatus) => currStatus.toLowerCase() === step.toLowerCase(),
  );

  useEffect(() => {
    const activeEl = stepRefs.current[activeIndex];
    if (!activeEl || activeIndex < 0) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    activeEl.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeIndex, step]);

  return (
    <div
      ref={scrollRef}
      className={cn(
        "w-full snap-x snap-mandatory overflow-x-auto py-2",
        className,
      )}
    >
      <ul className="flex min-w-max items-center gap-1 sm:gap-2">
        {steps.map((item, itemIdx) => {
          const currentStatusIndex = steps.findIndex(
            (currStatus) => currStatus.toLowerCase() === item.toLowerCase(),
          );
          const isActive = isStatusActive(currentStatusIndex);
          const isCompleted = isStatusCompleted(currentStatusIndex);
          const isLast = itemIdx === steps.length - 1;

          return (
            <li
              key={itemIdx}
              ref={(element) => {
                stepRefs.current[itemIdx] = element;
              }}
              className="flex snap-center items-center"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div
                    className={cn(
                      "flex size-5 items-center justify-center rounded-full border-2 transition-all duration-300 sm:size-6",
                      isActive
                        ? "border-primary bg-primary text-primary-foreground"
                        : isCompleted
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted-foreground/30 text-muted-foreground/50",
                    )}
                  >
                    {isCompleted ? (
                      <Check className="animate-in zoom-in size-3.5" />
                    ) : (
                      <span className="text-xs font-bold">{itemIdx + 1}</span>
                    )}
                  </div>

                  <span
                    className={cn(
                      "text-xs font-medium whitespace-nowrap transition-colors duration-300 sm:text-sm",
                      isActive
                        ? "text-foreground font-bold"
                        : isCompleted
                          ? "text-muted-foreground"
                          : "text-muted-foreground/50",
                    )}
                  >
                    {item}
                  </span>
                </div>

                {!isLast ? (
                  <div
                    className={cn(
                      "h-0.5 w-4 rounded-full transition-colors duration-500 sm:w-8",
                      isCompleted ? "bg-primary" : "bg-muted-foreground/20",
                    )}
                  />
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Stepper;
