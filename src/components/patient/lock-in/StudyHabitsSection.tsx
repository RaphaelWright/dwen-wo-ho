"use client";

import { StudyHabitsSectionProps } from "@/lib/types/components/patient/lock-in";
import { Label } from "@/components/ui/label";
import { LockInFormData } from "@/hooks/patient/useLockInForm";
import { LOCK_IN_TEXTS } from "@/lib/constants/components/patient/lock-in";

export function StudyHabitsSection({
  register,
  errors,
  motivationOptions,
  studyFrequencyOptions,
}: StudyHabitsSectionProps) {
  return (
    <div className="bg-card rounded-xl shadow-sm border border-border p-6">
      <h2 className="text-xl font-bold text-foreground mb-4">
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
            className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background"
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
            <p className="text-red-500 text-sm mt-1">
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
              className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background"
            >
              <option value="">{LOCK_IN_TEXTS.study.placeholder}</option>
              {studyFrequencyOptions.map((option) => (
                <option key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </option>
              ))}
            </select>
            {errors[field.name as keyof LockInFormData] && (
              <p className="text-red-500 text-sm mt-1">
                {errors[field.name as keyof LockInFormData]?.message}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
