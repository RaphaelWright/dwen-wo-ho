"use client";

import { StepShell } from "@/components/patient/onboarding/steps/step-shell";
import { OnboardingContinueForm } from "@/components/patient/onboarding/steps/continue-form";
import { ONBOARDING_COPY } from "@/lib/constants/components/patient/onboarding";
import type { GradeStepProps } from "@/lib/types/components/patient/onboarding";
import { formatStudentClassSummary } from "@/lib/utils/patient/onboarding-class";
import { getFilteredGradeOptions } from "@/lib/utils/patient/get-grade-options";
import { activateOnKeyboard } from "@/lib/utils/shared/a11y";

export function GradeStep({
  schoolType,
  gradeShort,
  programme,
  schoolName,
  programmeDurationYears,
  onGradeChange,
  canContinue,
  onContinue,
}: GradeStepProps) {
  const gradeOptions = getFilteredGradeOptions({
    schoolType,
    programmeDurationYears,
  });

  const title =
    schoolType === "high-school"
      ? ONBOARDING_COPY.grade.hsTitle
      : ONBOARDING_COPY.grade.collegeTitle;

  const subtitle =
    schoolType === "high-school"
      ? ONBOARDING_COPY.grade.hsSubtitle
      : ONBOARDING_COPY.grade.collegeSubtitle;

  const sectionLabel =
    schoolType === "high-school"
      ? ONBOARDING_COPY.grade.hsSectionLabel
      : ONBOARDING_COPY.grade.collegeSectionLabel;

  const activeOption = gradeOptions.find(
    (option) => option.short === gradeShort,
  );

  const classSummary =
    activeOption &&
    formatStudentClassSummary({
      gradeShort: activeOption.short,
      yearsRemaining: activeOption.yearsRemaining,
      programme,
      schoolName,
    });

  return (
    <StepShell title={title} subtitle={subtitle} centered>
      <OnboardingContinueForm
        canContinue={canContinue}
        onContinue={onContinue}
        listenForEnter
        className="flex w-full flex-col gap-5"
      >
        <p className="text-muted-foreground text-left text-xs font-semibold tracking-wide uppercase">
          {sectionLabel}
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {gradeOptions.map((option) => {
            const isActive = gradeShort === option.short;

            return (
              <div
                key={option.label}
                role="button"
                tabIndex={0}
                aria-pressed={isActive}
                onClick={() =>
                  onGradeChange({
                    short: option.short,
                    yearsRemaining: option.yearsRemaining,
                  })
                }
                onKeyDown={activateOnKeyboard(() =>
                  onGradeChange({
                    short: option.short,
                    yearsRemaining: option.yearsRemaining,
                  }),
                )}
                className={`border-border hover:border-primary hover:bg-accent flex min-h-18 cursor-pointer items-center rounded-2xl border-2 px-4 py-3 text-left transition-colors ${
                  isActive ? "border-primary bg-accent" : "bg-card"
                }`}
              >
                <span className="text-foreground text-sm font-semibold sm:text-base">
                  {option.label}
                </span>
              </div>
            );
          })}
        </div>

        {classSummary ? (
          <output className="border-success/40 bg-success/10 text-success block w-full rounded-2xl border px-4 py-3 text-center text-sm leading-snug font-semibold text-balance sm:text-base">
            {classSummary}
          </output>
        ) : null}
      </OnboardingContinueForm>
    </StepShell>
  );
}
