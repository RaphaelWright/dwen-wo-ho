"use client";

import { SchoolContextPill } from "@/components/patient/onboarding/steps/school-context-pill";
import { SchoolPicker } from "@/components/patient/onboarding/overlays/school-picker";
import { OnboardingContinueForm } from "@/components/patient/onboarding/steps/continue-form";
import { StepShell } from "@/components/patient/onboarding/steps/step-shell";
import { ONBOARDING_COPY } from "@/lib/constants/components/patient/onboarding";
import type {
  SchoolType,
  SchoolTypeStepProps,
} from "@/lib/types/components/patient/onboarding";
import { activateOnKeyboard } from "@/lib/utils/shared/a11y";
import { cn } from "@/lib/utils";

export function SchoolTypeStep({
  schoolType,
  selectedSchoolId,
  selectedSchoolName,
  selectedSchoolLogo,
  pickerOpen,
  onSchoolTypeChange,
  onOpenPicker,
  onPickerOpenChange,
  onSelectSchool,
  canContinue,
  onContinue,
  screenClassName,
}: SchoolTypeStepProps) {
  const hasSchool = Boolean(selectedSchoolId && selectedSchoolName);

  const handleTypeSelect = (type: SchoolType) => {
    onSchoolTypeChange(type);
    onOpenPicker();
  };

  return (
    <StepShell
      title="High School or College?"
      subtitle={ONBOARDING_COPY.schoolType.subtitle}
      className={cn("onboarding-step", screenClassName)}
    >
      <OnboardingContinueForm
        canContinue={canContinue}
        onContinue={onContinue}
        listenForEnter
      >
        <div className="type-card-row">
          <div
            role="button"
            tabIndex={0}
            className={cn(
              "type-card",
              schoolType === "high-school" && "selected",
            )}
            data-type="high-school"
            onClick={() => handleTypeSelect("high-school")}
            onKeyDown={activateOnKeyboard(() =>
              handleTypeSelect("high-school"),
            )}
          >
            <div className="check-badge">✓</div>
            <div className="icon">🏫</div>
            <div className="label">HIGH SCHOOL</div>
          </div>

          <div
            role="button"
            tabIndex={0}
            className={cn("type-card", schoolType === "college" && "selected")}
            data-type="college"
            onClick={() => handleTypeSelect("college")}
            onKeyDown={activateOnKeyboard(() => handleTypeSelect("college"))}
          >
            <div className="check-badge">✓</div>
            <div className="icon">🎓</div>
            <div className="label">COLLEGE</div>
          </div>
        </div>

        {hasSchool ? (
          <SchoolContextPill
            schoolName={selectedSchoolName}
            schoolLogo={selectedSchoolLogo}
            schoolType={schoolType}
            onChangeSchool={onOpenPicker}
          />
        ) : null}

        <SchoolPicker
          open={pickerOpen}
          schoolType={schoolType}
          onOpenChange={onPickerOpenChange}
          onSelectSchool={onSelectSchool}
        />
      </OnboardingContinueForm>
    </StepShell>
  );
}
