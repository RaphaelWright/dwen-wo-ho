"use client";

import WidthConstraint from "@/components/ui/width-constraint";
import { useLockInForm } from "@/hooks/patient/lock-in/use-form";
import {
  LOCKIN_FREQUENCY_OPTIONS as frequencyOptions,
  LOCKIN_YES_NO_OPTIONS as yesNoOptions,
  LOCKIN_MOTIVATION_OPTIONS as motivationOptions,
  LOCKIN_STUDY_FREQUENCY_OPTIONS as studyFrequencyOptions,
  LOCKIN_TIME_TO_EXAM_OPTIONS as timeToExamOptions,
  LOCKIN_REASON_OPTIONS as reasonOptions,
} from "@/lib/constants/components/patient/lock-in";
import {
  LockInHeader,
  PersonalInfoSection,
  LockInDetailsSection,
  MentalHealthSection,
  ExamAnxietySection,
  StudyHabitsSection,
  FormActionButtons,
} from "@/components/patient/lock-in";

export default function LockInFormPage() {
  const { router, isSubmitting, register, handleSubmit, errors, onSubmit } =
    useLockInForm();

  return (
    <div className="min-h-screen bg-gray-50">
      <WidthConstraint>
        <div className="p-8 pb-20">
          <LockInHeader onBack={() => router.push("/patient/lock-in")} />

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <PersonalInfoSection register={register} errors={errors} />

            <LockInDetailsSection
              register={register}
              errors={errors}
              reasonOptions={reasonOptions}
              timeToExamOptions={timeToExamOptions}
            />

            <MentalHealthSection
              register={register}
              errors={errors}
              frequencyOptions={frequencyOptions}
              yesNoOptions={yesNoOptions}
            />

            <ExamAnxietySection
              register={register}
              errors={errors}
              frequencyOptions={frequencyOptions}
            />

            <StudyHabitsSection
              register={register}
              errors={errors}
              motivationOptions={motivationOptions}
              studyFrequencyOptions={studyFrequencyOptions}
            />

            <FormActionButtons
              isSubmitting={isSubmitting}
              onCancel={() => router.push("/patient/lock-in")}
            />
          </form>
        </div>
      </WidthConstraint>
    </div>
  );
}
