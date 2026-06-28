"use client";

import { SchoolTypeStep } from "@/components/patient/onboarding/steps/school-type-step";
import { ProgrammeStep } from "@/components/patient/onboarding/steps/programme-step";
import { GradeStep } from "@/components/patient/onboarding/steps/grade-step";
import { ONBOARDING_SCREENS } from "@/lib/constants/components/patient/onboarding";
import type { OnboardingStepContentProps } from "@/lib/types/components/patient/onboarding";

export function OnboardingEducationStepContent({
  screen,
  draft,
  onProgrammeChange,
  onSchoolTypeChange,
  onSelectSchool,
  onGradeChange,
}: OnboardingStepContentProps) {
  switch (screen) {
    case ONBOARDING_SCREENS.SCHOOL_TYPE:
      return (
        <SchoolTypeStep
          schoolType={draft.schoolType}
          selectedSchoolId={draft.schoolId}
          onSchoolTypeChange={onSchoolTypeChange}
          onSelectSchool={onSelectSchool}
        />
      );
    case ONBOARDING_SCREENS.PROGRAMME:
      return (
        <ProgrammeStep
          programme={draft.programme}
          onProgrammeChange={onProgrammeChange}
        />
      );
    case ONBOARDING_SCREENS.GRADE:
      return (
        <GradeStep
          schoolType={draft.schoolType}
          gradeShort={draft.gradeShort}
          programme={draft.programme}
          schoolName={draft.schoolName}
          onGradeChange={onGradeChange}
        />
      );
    default:
      return null;
  }
}
