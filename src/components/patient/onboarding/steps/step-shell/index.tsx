"use client";

import type { StepShellProps } from "@/lib/types/components/patient/onboarding";
import { cn } from "@/lib/utils";

export function StepShell({
  title,
  subtitle,
  centered = false,
  children,
}: StepShellProps) {
  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      <div
        className={cn(
          "flex flex-col gap-1.5 sm:gap-2",
          centered && "text-center",
        )}
      >
        <h1
          className={cn(
            "font-heading text-foreground text-xl font-semibold tracking-tight sm:text-2xl",
            centered && "text-center",
          )}
        >
          {title}
        </h1>
        {subtitle ? (
          <p
            className={cn(
              "text-muted-foreground text-sm leading-relaxed sm:text-[0.9375rem]",
              centered && "text-center",
            )}
          >
            {subtitle}
          </p>
        ) : null}
      </div>
      {children}
    </div>
  );
}
