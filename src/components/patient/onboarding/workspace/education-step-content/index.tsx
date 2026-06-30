"use client";

import { SchoolTypeStep } from "@/components/patient/onboarding/steps/school-type-step";
import { ProgrammeStep } from "@/components/patient/onboarding/steps/programme-step";
import { GradeStep } from "@/components/patient/onboarding/steps/grade-step";
import { ONBOARDING_SCREENS } from "@/lib/constants/components/patient/onboarding";
import type { OnboardingStepContentProps } from "@/lib/types/components/patient/onboarding";

export function OnboardingEducationStepContent({
  screen,
  draft,
  programmeSearch,
  onProgrammeSearchChange,
  onProgrammeSelect,
  onSchoolTypeChange,
  onSelectSchool,
  onOpenSchoolPicker,
  onSchoolPickerOpenChange,
  schoolPickerOpen,
  selectedSchoolLogo,
  onGradeChange,
  canContinue,
  onContinue,
}: OnboardingStepContentProps) {
  switch (screen) {
    case ONBOARDING_SCREENS.SCHOOL_TYPE:
      return (
        <SchoolTypeStep
          schoolType={draft.schoolType}
          selectedSchoolId={draft.schoolId}
          selectedSchoolName={draft.schoolName}
          selectedSchoolLogo={selectedSchoolLogo ?? draft.schoolLogo}
          pickerOpen={schoolPickerOpen}
          onSchoolTypeChange={onSchoolTypeChange}
          onOpenPicker={onOpenSchoolPicker}
          onPickerOpenChange={onSchoolPickerOpenChange}
          onSelectSchool={onSelectSchool}
          canContinue={canContinue}
          onContinue={onContinue}
        />
      );
    case ONBOARDING_SCREENS.PROGRAMME:
      return (
        <ProgrammeStep
          programme={draft.programme}
          searchQuery={programmeSearch}
          onSearchChange={onProgrammeSearchChange}
          onProgrammeSelect={onProgrammeSelect}
          canContinue={canContinue}
          onContinue={onContinue}
        />
      );
    case ONBOARDING_SCREENS.GRADE:
      return (
        <GradeStep
          schoolType={draft.schoolType}
          gradeShort={draft.gradeShort}
          programme={draft.programme}
          schoolName={draft.schoolName}
          programmeDurationYears={draft.programmeDurationYears}
          onGradeChange={onGradeChange}
          canContinue={canContinue}
          onContinue={onContinue}
        />
      );
    default:
      return null;
  }
}
