"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldContent, FieldGroup } from "@/components/ui/field";
import { StepShell } from "@/components/patient/onboarding/steps/step-shell";
import { ONBOARDING_COPY } from "@/lib/constants/components/patient/onboarding";
import type { GradeStepProps } from "@/lib/types/components/patient/onboarding";
import { formatStudentClassSummary } from "@/lib/utils/patient/onboarding-class";
import { getGradeOptionsForSchoolType } from "@/lib/utils/patient/onboarding-validation";

export function GradeStep({
  schoolType,
  gradeShort,
  programme,
  schoolName,
  onGradeChange,
}: GradeStepProps) {
  const gradeOptions = getGradeOptionsForSchoolType(schoolType);
  const classSummary = gradeShort
    ? formatStudentClassSummary({
        gradeShort,
        schoolType,
        programme,
        schoolName,
      })
    : null;

  return (
    <StepShell
      title={ONBOARDING_COPY.grade.title}
      subtitle={ONBOARDING_COPY.grade.subtitle}
    >
      <FieldGroup>
        <Field>
          <FieldContent>
            <div className="flex w-full gap-2">
              {gradeOptions.map((grade) => {
                const isActive = gradeShort === grade;

                return (
                  <Button
                    key={grade}
                    type="button"
                    variant={isActive ? "default" : "outline"}
                    className={`h-11 min-w-0 flex-1 rounded-full px-1.5 text-xs font-semibold sm:h-12 sm:px-2 sm:text-sm ${
                      isActive ? "bg-primary text-primary-foreground" : ""
                    }`}
                    aria-pressed={isActive}
                    onClick={() => onGradeChange(grade)}
                  >
                    {grade}
                  </Button>
                );
              })}
            </div>
          </FieldContent>
        </Field>

        {classSummary ? (
          <div className="border-primary bg-primary/5 text-foreground w-full rounded-2xl border px-3 py-2.5 text-center text-xs leading-snug font-semibold text-balance sm:px-4 sm:py-3 sm:text-sm">
            {classSummary}
          </div>
        ) : null}
      </FieldGroup>
    </StepShell>
  );
}
