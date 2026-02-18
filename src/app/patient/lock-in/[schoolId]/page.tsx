"use client";

import WidthConstraint from "@/components/ui/width-constraint";
import {
  useLockInForm,
  frequencyOptions,
  yesNoOptions,
  motivationOptions,
  studyFrequencyOptions,
  timeToExamOptions,
  reasonOptions,
} from "@/hooks/patient/useLockInForm";
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
