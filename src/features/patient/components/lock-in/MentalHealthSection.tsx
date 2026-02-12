"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { LockInFormData } from "@/hooks/patient/useLockInForm";

interface MentalHealthSectionProps {
  register: UseFormRegister<LockInFormData>;
  errors: FieldErrors<LockInFormData>;
  frequencyOptions: string[];
  yesNoOptions: string[];
}

export function MentalHealthSection({
  register,
  errors,
  frequencyOptions,
  yesNoOptions,
}: MentalHealthSectionProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Mental Health Assessment
      </h2>
      <div className="space-y-4">
        {[
          { name: "feelingDepressed", label: "Feeling Depressed" },
          { name: "lossOfInterest", label: "Loss of Interest" },
          { name: "feelingLonely", label: "Feeling Lonely" },
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

        {[
          { name: "suicidalThoughts", label: "Suicidal Thoughts" },
          { name: "suicidalPlans", label: "Suicidal Plans" },
        ].map((field) => (
          <div key={field.name}>
            <Label htmlFor={field.name}>{field.label}</Label>
            <select
              id={field.name}
              {...register(field.name as keyof LockInFormData)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#955aa4]/20 focus:border-[#955aa4]"
            >
              <option value="">Select</option>
              {yesNoOptions.map((option) => (
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
