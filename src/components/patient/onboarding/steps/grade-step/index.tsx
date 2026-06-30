"use client";

import { OnboardingContinueForm } from "@/components/patient/onboarding/steps/continue-form";
import { ONBOARDING_COPY } from "@/lib/constants/components/patient/onboarding";
import type { GradeStepProps } from "@/lib/types/components/patient/onboarding";
import { formatStudentClassSummary } from "@/lib/utils/patient/onboarding-class";
import { getFilteredGradeOptions } from "@/lib/utils/patient/get-grade-options";
import { cn } from "@/lib/utils";

export function GradeStep({
  schoolType,
  gradeShort,
  programme,
  schoolName,
  programmeDurationYears,
  onGradeChange,
  canContinue,
  onContinue,
  screenClassName,
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

  const typeLabel = schoolType === "high-school" ? "High School" : "College";
  const badgeLabel = schoolName.trim().charAt(0).toUpperCase();

  return (
    <OnboardingContinueForm
      canContinue={canContinue}
      onContinue={onContinue}
      listenForEnter
      className={cn("screen onboarding-step", screenClassName)}
    >
      {schoolName ? (
        <div className={cn("school-context-pill", "show")}>
          <div className="mini-badge">{badgeLabel}</div>
          <div className="txt">
            {schoolName} <span>· {typeLabel}</span>
          </div>
        </div>
      ) : null}

      <h1 className="screen-title" id="gradeScreenTitle">
        {title}
      </h1>
      <p className="screen-sub" id="gradeScreenSub">
        {subtitle}
      </p>

      <div className="section-label">
        <span id="gradeSectionLabel">{sectionLabel}</span>
        <span
          className={cn("result-pill", classSummary && "show")}
          id="resultPill"
        >
          {classSummary ?? ""}
        </span>
      </div>

      <div className="grade-grid" id="gradeGrid">
        {gradeOptions.map((option) => {
          const isSelected = gradeShort === option.short;

          return (
            <button
              key={option.label}
              type="button"
              className={cn("grade-pill", isSelected && "selected")}
              data-years={option.yearsRemaining}
              data-short={option.short}
              aria-pressed={isSelected}
              onClick={() =>
                onGradeChange({
                  short: option.short,
                  yearsRemaining: option.yearsRemaining,
                })
              }
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </OnboardingContinueForm>
  );
}
