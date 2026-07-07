"use client";

import type { ReactNode } from "react";
import { IoArrowBackOutline, IoArrowForwardOutline } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { ONBOARDING_COPY } from "@/lib/constants/components/patient/onboarding";
import { cn } from "@/lib/utils";

interface OnboardingFooterShellProps {
  stepper: ReactNode;
  backDisabled: boolean;
  nextDisabled: boolean;
  nextLabel: string;
  onBack: () => void;
  onNext: () => void;
}

export function OnboardingFooterShell({
  stepper,
  backDisabled,
  nextDisabled,
  nextLabel,
  onBack,
  onNext,
}: OnboardingFooterShellProps) {
  const hideBack = backDisabled;
  const isBackInteractive = !hideBack;

  return (
    <footer className="border-border bg-background z-sticky-chrome w-full shrink-0 border-t pb-[max(0px,env(safe-area-inset-bottom,0px))]">
      <div className="grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 px-4 py-3 sm:grid-cols-[minmax(5.5rem,1fr)_minmax(0,2.5fr)_minmax(9.5rem,1fr)] sm:gap-4 sm:px-6 sm:py-4">
        <div className="flex h-10 items-center justify-start">
          <Button
            type="button"
            variant="ghost"
            onClick={onBack}
            disabled={backDisabled}
            aria-hidden={hideBack || undefined}
            tabIndex={hideBack ? -1 : undefined}
            aria-label={ONBOARDING_COPY.back}
            className={cn(
              "gap-1",
              isBackInteractive
                ? "border-border bg-card text-foreground hover:border-primary hover:bg-accent hover:text-accent-foreground flex h-10 items-center justify-center rounded-full border px-3 transition-[color,background-color,border-color,transform] duration-200 ease-out hover:-translate-x-0.5 active:translate-x-0 active:scale-[0.98] sm:px-6"
                : `text-muted-foreground flex h-10 items-center justify-center rounded-full border border-transparent bg-transparent px-3 sm:px-6${hideBack ? "pointer-events-none invisible" : ""}`,
            )}
          >
            <IoArrowBackOutline className="size-4 shrink-0" />
            <span className="hidden sm:inline">{ONBOARDING_COPY.back}</span>
          </Button>
        </div>

        <div className="flex h-10 min-w-0 items-center justify-center px-0.5 sm:px-3">
          {stepper}
        </div>

        <div className="flex h-10 items-center justify-end">
          <Button
            type="button"
            disabled={nextDisabled}
            onClick={onNext}
            className="bg-primary text-primary-foreground hover:bg-primary/90 flex h-10 max-w-38 shrink-0 items-center justify-center gap-1 rounded-full px-4 text-sm transition-[background-color,color,opacity] sm:max-w-none sm:px-8 sm:text-base"
          >
            <span className="truncate">{nextLabel}</span>
            <IoArrowForwardOutline className="size-4 shrink-0" />
          </Button>
        </div>
      </div>
    </footer>
  );
}
