"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { LockInFormData } from "@/hooks/patient/useLockInForm";

interface ExamAnxietySectionProps {
  register: UseFormRegister<LockInFormData>;
  errors: FieldErrors<LockInFormData>;
  frequencyOptions: string[];
}

export function ExamAnxietySection({
  register,
  errors,
  frequencyOptions,
}: ExamAnxietySectionProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Exam Anxiety</h2>
      <div className="space-y-4">
        {[
          { name: "examWorrying", label: "Exam Worrying" },
          { name: "sleepProblems", label: "Sleep Problems" },
          { name: "fearOfFailure", label: "Fear of Failure" },
          { name: "feelingNervous", label: "Feeling Nervous" },
          {
            name: "sweatingOrHeartRacing",
            label: "Sweating or Heart Racing",
          },
          { name: "stomachUpset", label: "Stomach Upset" },
        ].map((field) => (
          <div key={field.name}>
            <Label htmlFor={field.name}>{field.label}</Label>
            <select
              id={field.name}
              {...register(field.name as keyof LockInFormData)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#955aa4]/20 focus:border-[#955aa4]"
            >
              <option value="">Select frequency</option>
              {frequencyOptions.map((option) => (
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
