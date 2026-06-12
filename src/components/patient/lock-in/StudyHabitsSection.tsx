"use client";

import {
  StudyHabitsSectionProps,
  LockInFormData,
} from "@/lib/types/components/patient/lock-in";
import { Label } from "@/components/ui/label";
import { LOCK_IN_TEXTS } from "@/lib/constants/components/patient/lock-in";

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
        <div>
          <Label htmlFor="motivationToStudy">
            {LOCK_IN_TEXTS.study.motivationLabel}
          </Label>
          <select
            id="motivationToStudy"
            {...register("motivationToStudy")}
            {...register("motivationToStudy")}
            className="border-input focus:ring-primary/20 focus:border-primary bg-background w-full rounded-lg border px-3 py-2 focus:ring-2 focus:outline-none"
          >
            <option value="">
              {LOCK_IN_TEXTS.study.motivationPlaceholder}
            </option>
            {motivationOptions.map((option) => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
          {errors.motivationToStudy && (
            <p className="mt-1 text-sm text-red-500">
              {errors.motivationToStudy.message}
            </p>
          )}
        </div>

        {LOCK_IN_TEXTS.study.fields.map((field) => (
          <div key={field.name}>
            <Label htmlFor={field.name}>{field.label}</Label>
            <select
              id={field.name}
              {...register(field.name as keyof LockInFormData)}
              {...register(field.name as keyof LockInFormData)}
              className="border-input focus:ring-primary/20 focus:border-primary bg-background w-full rounded-lg border px-3 py-2 focus:ring-2 focus:outline-none"
            >
              <option value="">{LOCK_IN_TEXTS.study.placeholder}</option>
              {studyFrequencyOptions.map((option) => (
                <option key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </option>
              ))}
            </select>
            {errors[field.name as keyof LockInFormData] && (
              <p className="mt-1 text-sm text-red-500">
                {errors[field.name as keyof LockInFormData]?.message}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
