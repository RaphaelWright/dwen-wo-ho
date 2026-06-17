"use client";

import {
  StudyHabitsSectionProps,
  LockInFormData,
} from "@/lib/types/components/patient/lock-in";
import { LOCK_IN_TEXTS } from "@/lib/constants/components/patient/lock-in";
import { LockInFrequencySelectField } from "@/components/patient/lock-in/lock-in-frequency-select-field";

export function StudyHabitsSection({
  register,
  errors,
  motivationOptions,
  studyFrequencyOptions,
}: StudyHabitsSectionProps) {
  return (
    <div className="bg-card border-border rounded-xl border p-6 shadow-sm">
      <h2 className="text-foreground mb-4 text-xl font-bold">
        {LOCK_IN_TEXTS.study.title}
      </h2>
      <div className="space-y-4">
        <LockInFrequencySelectField
          fieldName="motivationToStudy"
          label={LOCK_IN_TEXTS.study.motivationLabel}
          placeholder={LOCK_IN_TEXTS.study.motivationPlaceholder}
          options={motivationOptions}
          register={register}
          errors={errors}
        />

        {LOCK_IN_TEXTS.study.fields.map((field) => (
          <LockInFrequencySelectField
            key={field.name}
            fieldName={field.name as keyof LockInFormData}
            label={field.label}
            placeholder={LOCK_IN_TEXTS.study.placeholder}
            options={studyFrequencyOptions}
            register={register}
            errors={errors}
          />
        ))}
      </div>
    </div>
  );
}
