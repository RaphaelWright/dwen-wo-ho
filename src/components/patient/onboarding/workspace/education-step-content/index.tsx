"use client";

import { SchoolTypeStep } from "@/components/patient/onboarding/steps/school-type-step";
import { ProgrammeStep } from "@/components/patient/onboarding/steps/programme-step";
import { GradeStep } from "@/components/patient/onboarding/steps/grade-step";
import { useOnboardingScreenFlip } from "@/hooks/components/patient/onboarding/use-onboarding-screen-flip";
import { ONBOARDING_SCREENS } from "@/lib/constants/components/patient/onboarding";
import type { OnboardingStepContentProps } from "@/lib/types/components/patient/onboarding";

export function OnboardingEducationStepContent(
  props: OnboardingStepContentProps,
) {
  const { displayScreen, screenClassName } = useOnboardingScreenFlip(
    props.screen,
  );

  switch (displayScreen) {
    case ONBOARDING_SCREENS.SCHOOL_TYPE:
      return (
        <SchoolTypeStep
          schoolType={props.draft.schoolType}
          selectedSchoolId={props.draft.schoolId}
          selectedSchoolName={props.draft.schoolName}
          selectedSchoolLogo={
            props.selectedSchoolLogo ?? props.draft.schoolLogo
          }
          pickerOpen={props.schoolPickerOpen}
          screenClassName={screenClassName}
          onSchoolTypeChange={props.onSchoolTypeChange}
          onOpenPicker={props.onOpenSchoolPicker}
          onPickerOpenChange={props.onSchoolPickerOpenChange}
          onSelectSchool={props.onSelectSchool}
          canContinue={props.canContinue}
          onContinue={props.onContinue}
        />
      );
    case ONBOARDING_SCREENS.PROGRAMME:
      return (
        <ProgrammeStep
          programme={props.draft.programme}
          schoolName={props.draft.schoolName}
          schoolLogo={props.selectedSchoolLogo ?? props.draft.schoolLogo}
          schoolType={props.draft.schoolType}
          searchQuery={props.programmeSearch}
          screenClassName={screenClassName}
          onSearchChange={props.onProgrammeSearchChange}
          onProgrammeSelect={props.onProgrammeSelect}
          canContinue={props.canContinue}
          onContinue={props.onContinue}
        />
      );
    case ONBOARDING_SCREENS.GRADE:
      return (
        <GradeStep
          schoolType={props.draft.schoolType}
          gradeShort={props.draft.gradeShort}
          programme={props.draft.programme}
          schoolName={props.draft.schoolName}
          programmeDurationYears={props.draft.programmeDurationYears}
          screenClassName={screenClassName}
          onGradeChange={props.onGradeChange}
          canContinue={props.canContinue}
          onContinue={props.onContinue}
        />
      );
    default:
      return null;
  }
}
