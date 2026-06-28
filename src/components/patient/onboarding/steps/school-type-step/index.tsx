"use client";

import { GraduationCap, School } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { SchoolCombobox } from "@/components/patient/onboarding/steps/school-combobox";
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
  onSchoolTypeChange,
  onSelectSchool,
}: SchoolTypeStepProps) {
  return (
    <StepShell
      title={ONBOARDING_COPY.schoolType.title}
      subtitle={ONBOARDING_COPY.schoolType.subtitle}
    >
      <FieldGroup>
        <Field>
          <FieldTitle>{ONBOARDING_COPY.schoolType.toggleTitle}</FieldTitle>
          <FieldDescription>
            {ONBOARDING_COPY.schoolType.toggleSubtitle}
          </FieldDescription>
          <FieldContent>
            <div
              className="bg-muted/60 mt-3 flex rounded-full p-1"
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
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="patient-school">
            {ONBOARDING_COPY.schoolType.pickerLabel}
          </FieldLabel>
          <FieldContent>
            <SchoolCombobox
              schoolType={schoolType}
              selectedSchoolId={selectedSchoolId}
              onSelectSchool={onSelectSchool}
            />
          </FieldContent>
        </Field>
      </FieldGroup>
    </StepShell>
  );
}
