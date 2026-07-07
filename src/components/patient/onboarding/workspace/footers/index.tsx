"use client";

import { IoCheckmark } from "react-icons/io5";
import {
  AUTH_FOOTER_STEP_LABELS,
  ONBOARDING_FOOTER_STEP_LABELS,
} from "@/lib/constants/components/patient/onboarding";
import type {
  AuthFooterProps,
  OnboardingPhaseFooterProps,
} from "@/lib/types/components/patient/onboarding";
import { cn } from "@/lib/utils";

function MockAuthStepper({
  steps,
  activeLabel,
}: {
  steps: readonly string[];
  activeLabel: string;
}) {
  const activeIndex = steps.findIndex(
    (step) => step.toLowerCase() === activeLabel.toLowerCase(),
  );

  return (
    <div className="asteps">
      {steps.map((label, index) => {
        const isActive = index === activeIndex;
        const isDone = index < activeIndex;

        return (
          <div key={label} className="contents">
            <div
              className={cn("astep", isActive && "active", isDone && "done")}
            >
              <div className="astep-circle">
                {isDone ? <IoCheckmark aria-hidden="true" /> : index + 1}
              </div>
              <div className="astep-label">{label}</div>
            </div>
            {index < steps.length - 1 ? <div className="astep-line" /> : null}
          </div>
        );
      })}
    </div>
  );
}

function MockOnboardingStepper({
  steps,
  activeLabel,
  completedSteps,
}: {
  steps: readonly string[];
  activeLabel: string;
  completedSteps: readonly string[];
}) {
  const completedSet = new Set(
    completedSteps.map((step) => step.toLowerCase()),
  );
  const activeIndex = steps.findIndex(
    (step) => step.toLowerCase() === activeLabel.toLowerCase(),
  );

  return (
    <div className="step-track">
      {steps.map((label, index) => {
        const isDone =
          completedSet.has(label.toLowerCase()) || index < activeIndex;

        return (
          <div key={label} className="contents">
            <div className={cn("step-chip", isDone && "done")}>
              {isDone ? <IoCheckmark aria-hidden="true" /> : null}
            </div>
            <span className="step-label">{label}</span>
            {index < steps.length - 1 ? <div className="step-seg" /> : null}
          </div>
        );
      })}
    </div>
  );
}

export function OnboardingAuthFooter({
  stepLabel,
  showStepper = true,
  stepLabels = AUTH_FOOTER_STEP_LABELS,
  hideNext = false,
  backDisabled,
  nextDisabled,
  nextLabel,
  onBack,
  onNext,
}: AuthFooterProps) {
  return (
    <>
      <button
        type="button"
        className="back-btn"
        disabled={backDisabled}
        onClick={onBack}
      >
        Back
      </button>
      {showStepper && stepLabel ? (
        <MockAuthStepper steps={stepLabels} activeLabel={stepLabel} />
      ) : (
        <div />
      )}
      {hideNext ? (
        <div />
      ) : (
        <button
          type="button"
          className={cn("next-btn", !nextDisabled && "active")}
          disabled={nextDisabled}
          onClick={onNext}
        >
          {nextLabel}
        </button>
      )}
    </>
  );
}

export function OnboardingPhaseFooter({
  stepLabel,
  completedSteps,
  backDisabled,
  nextDisabled,
  nextLabel,
  onBack,
  onNext,
}: OnboardingPhaseFooterProps) {
  return (
    <>
      <button
        type="button"
        className="ghost-btn"
        disabled={backDisabled}
        onClick={onBack}
      >
        Back
      </button>
      {stepLabel ? (
        <MockOnboardingStepper
          steps={ONBOARDING_FOOTER_STEP_LABELS}
          activeLabel={stepLabel}
          completedSteps={completedSteps}
        />
      ) : (
        <div />
      )}
      <button
        type="button"
        className={cn("primary-btn", nextDisabled && "disabled")}
        disabled={nextDisabled}
        onClick={onNext}
      >
        {nextLabel}
      </button>
    </>
  );
}
