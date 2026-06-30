"use client";

import { GraduationCap, School } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SchoolContextPill } from "@/components/patient/onboarding/steps/school-context-pill";
import { SchoolPicker } from "@/components/patient/onboarding/overlays/school-picker";
import { OnboardingContinueForm } from "@/components/patient/onboarding/steps/continue-form";
import { StepShell } from "@/components/patient/onboarding/steps/step-shell";
import {
  ONBOARDING_COPY,
  ONBOARDING_SCHOOL_TYPES,
} from "@/lib/constants/components/patient/onboarding";
import type {
  SchoolType,
  SchoolTypeStepProps,
} from "@/lib/types/components/patient/onboarding";

const SCHOOL_TYPE_ICONS = {
  "high-school": School,
  college: GraduationCap,
} as const;

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
}: SchoolTypeStepProps) {
  const hasSchool = Boolean(selectedSchoolId && selectedSchoolName);

  return (
    <StepShell
      title={ONBOARDING_COPY.schoolType.title}
      subtitle={ONBOARDING_COPY.schoolType.subtitle}
      centered
    >
      <OnboardingContinueForm
        canContinue={canContinue}
        onContinue={onContinue}
        listenForEnter
        className="flex w-full flex-col gap-6"
      >
        <div>
          <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wide uppercase">
            {ONBOARDING_COPY.schoolType.toggleTitle}
          </p>
          <p className="text-muted-foreground mb-3 text-sm">
            {ONBOARDING_COPY.schoolType.toggleSubtitle}
          </p>
          <div
            className="bg-muted flex rounded-full p-1"
            role="group"
            aria-label="School level"
          >
            {ONBOARDING_SCHOOL_TYPES.map(({ value, label }) => {
              const Icon = SCHOOL_TYPE_ICONS[value];
              const isActive = schoolType === value;

              return (
                <Button
                  key={value}
                  type="button"
                  variant={isActive ? "default" : "ghost"}
                  className={`h-10 flex-1 rounded-full ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => onSchoolTypeChange(value as SchoolType)}
                  aria-pressed={isActive}
                >
                  <Icon className="size-4 shrink-0" aria-hidden="true" />
                  <span className="truncate">{label}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {hasSchool ? (
          <SchoolContextPill
            schoolName={selectedSchoolName}
            schoolLogo={selectedSchoolLogo}
            schoolType={schoolType}
            onChangeSchool={onOpenPicker}
          />
        ) : (
          <Button
            type="button"
            className="h-12 w-full rounded-full text-base font-semibold"
            onClick={onOpenPicker}
          >
            {ONBOARDING_COPY.schoolType.pickerButton}
          </Button>
        )}

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
